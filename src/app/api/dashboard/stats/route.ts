import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const serviceSupabase = createServiceClient();

    // 1. Fetch Pioneer Profile
    const { data: pioneer, error: pioneerError } = await serviceSupabase
      .from("pioneers")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (pioneerError || !pioneer) {
      return NextResponse.json({ error: "Pioneer profile not found" }, { status: 404 });
    }

    // 2. Check if payment is pending
    if (pioneer.status === "pending_payment") {
      return NextResponse.json({
        isPendingPayment: true,
        pioneer: {
          id: pioneer.id,
          full_name: pioneer.full_name,
          email: pioneer.email,
          status: pioneer.status,
        },
      });
    }

    // 3. Fetch Referrals Count
    const { count: referredCount } = await serviceSupabase
      .from("pioneers")
      .select("*", { count: "exact", head: true })
      .eq("referred_by", pioneer.id)
      .eq("status", "active");

    // 4. Fetch Feature Ideas & Votes
    const { data: features } = await serviceSupabase
      .from("feature_ideas")
      .select(`
        id,
        title,
        description,
        importance,
        status,
        created_at,
        feature_votes(id, pioneer_id, vote_type)
      `)
      .order("created_at", { ascending: false });

    const formattedFeatures = (features || []).map((f: any) => {
      const votes = f.feature_votes || [];
      const upvotes = votes.filter((v: any) => v.vote_type === "up").length;
      const downvotes = votes.filter((v: any) => v.vote_type === "down").length;
      const userVote = votes.find((v: any) => v.pioneer_id === pioneer.id)?.vote_type || null;

      return {
        id: f.id,
        title: f.title,
        description: f.description,
        importance: f.importance,
        status: f.status,
        votesCount: upvotes - downvotes,
        userVote,
      };
    });

    // 5. Fetch Platform Updates
    const { data: updates } = await serviceSupabase
      .from("updates")
      .select("*")
      .order("published_at", { ascending: false })
      .limit(5);

    // 6. Pioneer Journey Milestones
    const journey = [
      { label: "Joined waitlist", done: true },
      { label: "Became a Pioneer", done: pioneer.status === "active" },
      { label: "Explore Mụta", done: true },
      { label: "Submit a feature idea", done: (features || []).some((f: any) => f.pioneer_id === pioneer.id) },
      { label: "Attend a Pioneer meeting", done: false },
      { label: "Mụta launch", done: false },
    ];

    return NextResponse.json({
      isPendingPayment: false,
      pioneer: {
        id: pioneer.id,
        pioneer_number: pioneer.pioneer_number || 1,
        full_name: pioneer.full_name,
        email: pioneer.email,
        phone: pioneer.phone,
        university: pioneer.university,
        department: pioneer.department,
        level: pioneer.level,
        referral_code: pioneer.referral_code,
        status: pioneer.status,
        created_at: pioneer.created_at,
      },
      stats: {
        referredCount: referredCount || 0,
      },
      journey,
      features: formattedFeatures,
      updates: updates || [],
    });
  } catch (err: any) {
    console.error("[api/dashboard/stats] Error:", err);
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}
