import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

// POST /api/features - Submit a feature idea OR vote on an idea
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const serviceSupabase = createServiceClient();
    const { data: pioneer } = await serviceSupabase
      .from("pioneers")
      .select("id, status")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!pioneer || pioneer.status !== "active") {
      return NextResponse.json(
        { error: "Active Pioneer status required" },
        { status: 403 }
      );
    }

    const body = await request.json();

    // 1. Voting on a feature
    if (body.action === "vote") {
      const { featureId, voteType } = body;
      if (!featureId || !["up", "down"].includes(voteType)) {
        return NextResponse.json({ error: "Invalid vote parameters" }, { status: 400 });
      }

      // Check existing vote
      const { data: existingVote } = await serviceSupabase
        .from("feature_votes")
        .select("id, vote_type")
        .eq("feature_id", featureId)
        .eq("pioneer_id", pioneer.id)
        .maybeSingle();

      if (existingVote) {
        if (existingVote.vote_type === voteType) {
          // Remove vote on double click
          await serviceSupabase.from("feature_votes").delete().eq("id", existingVote.id);
          return NextResponse.json({ success: true, action: "removed" });
        } else {
          // Change vote
          await serviceSupabase
            .from("feature_votes")
            .update({ vote_type: voteType })
            .eq("id", existingVote.id);
          return NextResponse.json({ success: true, action: "updated" });
        }
      } else {
        // Insert new vote
        await serviceSupabase.from("feature_votes").insert({
          feature_id: featureId,
          pioneer_id: pioneer.id,
          vote_type: voteType,
        });
        return NextResponse.json({ success: true, action: "voted" });
      }
    }

    // 2. Suggesting a new feature idea
    if (body.action === "suggest") {
      const { title, description, importance } = body;
      if (!title || !description) {
        return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
      }

      const { data: newIdea, error } = await serviceSupabase
        .from("feature_ideas")
        .insert({
          pioneer_id: pioneer.id,
          title: title.trim(),
          description: description.trim(),
          importance: importance || "important",
          status: "under_review",
        })
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, idea: newIdea });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err: any) {
    console.error("[api/features] Error:", err);
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}
