import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { PendingPaymentBanner } from "./PendingPaymentBanner";
import { DashboardClient } from "./DashboardClient";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const serviceSupabase = createServiceClient();

  // 1. Fetch Pioneer Profile
  const { data: pioneer, error: pioneerError } = await serviceSupabase
    .from("pioneers")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (pioneerError) {
    console.error("[DashboardPage] Error fetching pioneer profile:", pioneerError);
  }

  // If no pioneer profile exists or status is pending_payment, deny access to the full dashboard
  if (!pioneer || pioneer.status === "pending_payment") {
    return (
      <PendingPaymentBanner
        fullName={pioneer?.full_name || user.user_metadata?.full_name || ""}
        email={pioneer?.email || user.email || ""}
      />
    );
  }

  // 2. Fetch Referred Pioneers Count
  const { count: referredCount } = await serviceSupabase
    .from("pioneers")
    .select("*", { count: "exact", head: true })
    .eq("referred_by", pioneer.id)
    .eq("status", "active");

  // 3. Fetch Feature Ideas and Votes
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
      description: f.description || "",
      importance: f.importance,
      status: f.status,
      votesCount: upvotes - downvotes,
      userVote,
    };
  });

  // 4. Fetch Platform Updates
  const { data: updates } = await serviceSupabase
    .from("updates")
    .select("*")
    .order("published_at", { ascending: false })
    .limit(5);

  // 5. Build Dynamic Journey Milestones
  const journey = [
    { label: "Joined waitlist", done: true },
    { label: "Became a Pioneer", done: pioneer.status === "active" },
    { label: "Explore Mụta", done: true },
    {
      label: "Submit a feature idea",
      done: (features || []).some((f: any) => f.pioneer_id === pioneer.id),
    },
    { label: "Attend a Pioneer meeting", done: false },
    { label: "Mụta launch", done: false },
  ];

  return (
    <DashboardClient
      pioneer={{
        id: pioneer.id,
        pioneer_number: pioneer.pioneer_number,
        full_name: pioneer.full_name,
        email: pioneer.email,
        university: pioneer.university || "Rivers State University",
        department: pioneer.department || "",
        level: pioneer.level || "",
        referral_code: pioneer.referral_code || "",
        status: pioneer.status,
        created_at: pioneer.created_at,
      }}
      referredCount={referredCount || 0}
      journey={journey}
      initialFeatures={formattedFeatures}
      updates={updates || []}
    />
  );
}

