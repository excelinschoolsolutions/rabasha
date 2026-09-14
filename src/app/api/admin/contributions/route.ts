import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin";
import { createServiceClient } from "@/lib/supabase/service";

// GET /api/admin/contributions - Fetch contributions list
export async function GET(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized admin access" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "";

    const serviceSupabase = createServiceClient();
    let query = serviceSupabase
      .from("contributions")
      .select(`
        id,
        amount,
        paystack_ref,
        status,
        created_at,
        pioneers (id, full_name, email, pioneer_number, phone, university)
      `)
      .order("created_at", { ascending: false });

    if (status && ["success", "pending", "failed"].includes(status)) {
      query = query.eq("status", status);
    }

    const { data: contributions, error } = await query.limit(100);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ contributions: contributions || [] });
  } catch (err: any) {
    console.error("[api/admin/contributions GET] Error:", err);
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}
