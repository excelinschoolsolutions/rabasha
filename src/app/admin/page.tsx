import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/admin";
import { createServiceClient } from "@/lib/supabase/service";
import { AdminDashboardClient } from "./AdminDashboardClient";

export default async function AdminPage() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  const serviceSupabase = createServiceClient();

  // 1. Fetch Overview Metrics
  const { count: totalPioneers } = await serviceSupabase
    .from("pioneers")
    .select("*", { count: "exact", head: true });

  const { count: activePioneers } = await serviceSupabase
    .from("pioneers")
    .select("*", { count: "exact", head: true })
    .eq("status", "active");

  const { count: pendingPioneers } = await serviceSupabase
    .from("pioneers")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending_payment");

  const { data: contributions } = await serviceSupabase
    .from("contributions")
    .select("amount, status");

  const successfulContributions = (contributions || []).filter((c) => c.status === "success");
  const totalRevenueNaira = successfulContributions.reduce((sum, c) => sum + (c.amount || 0), 0);
  const totalTransactions = successfulContributions.length;

  const { count: totalFeatures } = await serviceSupabase
    .from("feature_ideas")
    .select("*", { count: "exact", head: true });

  // 2. Fetch Recent Pioneers
  const { data: recentPioneers } = await serviceSupabase
    .from("pioneers")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);

  // 3. Fetch Recent Contributions
  const { data: recentContributions } = await serviceSupabase
    .from("contributions")
    .select(`
      id,
      amount,
      paystack_ref,
      status,
      created_at,
      pioneers (id, full_name, email, pioneer_number, phone, university)
    `)
    .order("created_at", { ascending: false })
    .limit(10);

  return (
    <AdminDashboardClient
      admin={{
        email: admin.email,
        role: admin.role,
      }}
      initialMetrics={{
        totalPioneers: totalPioneers || 0,
        activePioneers: activePioneers || 0,
        pendingPioneers: pendingPioneers || 0,
        totalRevenueNaira,
        totalTransactions,
        totalFeatures: totalFeatures || 0,
      }}
      initialRecentPioneers={recentPioneers || []}
      initialRecentContributions={recentContributions || []}
    />
  );
}
