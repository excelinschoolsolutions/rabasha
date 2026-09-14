import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin";
import { createServiceClient } from "@/lib/supabase/service";

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized admin access" }, { status: 401 });
    }

    const serviceSupabase = createServiceClient();

    // 1. Total Pioneers count
    const { count: totalPioneers } = await serviceSupabase
      .from("pioneers")
      .select("*", { count: "exact", head: true });

    // 2. Active Pioneers count
    const { count: activePioneers } = await serviceSupabase
      .from("pioneers")
      .select("*", { count: "exact", head: true })
      .eq("status", "active");

    // 3. Pending Payment Pioneers count
    const { count: pendingPioneers } = await serviceSupabase
      .from("pioneers")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending_payment");

    // 4. Total Contributions & Revenue
    const { data: contributions } = await serviceSupabase
      .from("contributions")
      .select("amount, status");

    const successfulContributions = (contributions || []).filter((c) => c.status === "success");
    const totalRevenueNaira = successfulContributions.reduce((sum, c) => sum + (c.amount || 0), 0);
    const totalTransactions = successfulContributions.length;

    // 5. Total Feature Ideas count
    const { count: totalFeatures } = await serviceSupabase
      .from("feature_ideas")
      .select("*", { count: "exact", head: true });

    // 6. Recent Pioneers
    const { data: recentPioneers } = await serviceSupabase
      .from("pioneers")
      .select("id, pioneer_number, full_name, email, university, department, level, status, created_at")
      .order("created_at", { ascending: false })
      .limit(6);

    // 7. Recent Contributions
    const { data: recentContributions } = await serviceSupabase
      .from("contributions")
      .select(`
        id,
        amount,
        paystack_ref,
        status,
        created_at,
        pioneers (full_name, email, pioneer_number)
      `)
      .order("created_at", { ascending: false })
      .limit(6);

    return NextResponse.json({
      admin: {
        email: admin.email,
        role: admin.role,
      },
      metrics: {
        totalPioneers: totalPioneers || 0,
        activePioneers: activePioneers || 0,
        pendingPioneers: pendingPioneers || 0,
        totalRevenueNaira,
        totalTransactions,
        totalFeatures: totalFeatures || 0,
      },
      recentPioneers: recentPioneers || [],
      recentContributions: recentContributions || [],
    });
  } catch (err: any) {
    console.error("[api/admin/stats] Error:", err);
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}
