import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin, logAdminAction } from "@/lib/admin";
import { createServiceClient } from "@/lib/supabase/service";

// GET /api/admin/features - Fetch all feature ideas with votes and pioneer details
export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized admin access" }, { status: 401 });
    }

    const serviceSupabase = createServiceClient();
    const { data: features, error } = await serviceSupabase
      .from("feature_ideas")
      .select(`
        id,
        title,
        description,
        importance,
        status,
        created_at,
        pioneers (id, full_name, email, university),
        feature_votes (id, vote_type)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const formatted = (features || []).map((f: any) => {
      const votes = f.feature_votes || [];
      const upvotes = votes.filter((v: any) => v.vote_type === "up").length;
      const downvotes = votes.filter((v: any) => v.vote_type === "down").length;

      return {
        id: f.id,
        title: f.title,
        description: f.description,
        importance: f.importance,
        status: f.status,
        votesCount: upvotes - downvotes,
        totalVotes: votes.length,
        created_at: f.created_at,
        pioneer: f.pioneers,
      };
    });

    return NextResponse.json({ features: formatted });
  } catch (err: any) {
    console.error("[api/admin/features GET] Error:", err);
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/admin/features - Moderate feature idea status (under_review, planned, shipped, declined)
export async function PATCH(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized admin access" }, { status: 401 });
    }

    const body = await request.json();
    const { featureId, status } = body;

    if (!featureId || !["under_review", "planned", "shipped", "declined"].includes(status)) {
      return NextResponse.json({ error: "Invalid featureId or status" }, { status: 400 });
    }

    const serviceSupabase = createServiceClient();
    const { data: updatedFeature, error } = await serviceSupabase
      .from("feature_ideas")
      .update({ status })
      .eq("id", featureId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await logAdminAction({
      adminId: admin.id,
      action: "update_feature_status",
      targetTable: "feature_ideas",
      targetId: featureId,
      details: { newStatus: status, adminEmail: admin.email },
    });

    return NextResponse.json({ success: true, feature: updatedFeature });
  } catch (err: any) {
    console.error("[api/admin/features PATCH] Error:", err);
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}
