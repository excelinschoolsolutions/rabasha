import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin, logAdminAction } from "@/lib/admin";
import { createServiceClient } from "@/lib/supabase/service";

// GET /api/admin/pioneers - Fetch pioneers with search, status filter, and pagination
export async function GET(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized admin access" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";

    const serviceSupabase = createServiceClient();
    let query = serviceSupabase
      .from("pioneers")
      .select("*")
      .order("created_at", { ascending: false });

    if (status && ["active", "pending_payment", "inactive"].includes(status)) {
      query = query.eq("status", status);
    }

    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,referral_code.ilike.%${search}%`);
    }

    const { data: pioneers, error } = await query.limit(100);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ pioneers: pioneers || [] });
  } catch (err: any) {
    console.error("[api/admin/pioneers GET] Error:", err);
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/admin/pioneers - Update pioneer status (e.g. manually activate or deactivate)
export async function PATCH(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized admin access" }, { status: 401 });
    }

    const body = await request.json();
    const { pioneerId, status } = body;

    if (!pioneerId || !["active", "pending_payment", "inactive"].includes(status)) {
      return NextResponse.json({ error: "Invalid pioneerId or status value" }, { status: 400 });
    }

    const serviceSupabase = createServiceClient();
    const { data: updatedPioneer, error } = await serviceSupabase
      .from("pioneers")
      .update({ status })
      .eq("id", pioneerId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log admin action
    await logAdminAction({
      adminId: admin.id,
      action: "update_pioneer_status",
      targetTable: "pioneers",
      targetId: pioneerId,
      details: { newStatus: status, updatedBy: admin.email },
    });

    return NextResponse.json({ success: true, pioneer: updatedPioneer });
  } catch (err: any) {
    console.error("[api/admin/pioneers PATCH] Error:", err);
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}
