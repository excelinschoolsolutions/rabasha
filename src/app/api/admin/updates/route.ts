import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin, logAdminAction } from "@/lib/admin";
import { createServiceClient } from "@/lib/supabase/service";

// GET /api/admin/updates - Fetch all updates
export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized admin access" }, { status: 401 });
    }

    const serviceSupabase = createServiceClient();
    const { data: updates, error } = await serviceSupabase
      .from("updates")
      .select("*")
      .order("published_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ updates: updates || [] });
  } catch (err: any) {
    console.error("[api/admin/updates GET] Error:", err);
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}

// POST /api/admin/updates - Create a new platform update
export async function POST(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized admin access" }, { status: 401 });
    }

    const body = await request.json();
    const { title, body: updateBody, image_url } = body;

    if (!title || !updateBody) {
      return NextResponse.json({ error: "Title and body are required" }, { status: 400 });
    }

    const serviceSupabase = createServiceClient();
    const { data: newUpdate, error } = await serviceSupabase
      .from("updates")
      .insert({
        title: title.trim(),
        body: updateBody.trim(),
        image_url: image_url || null,
        published_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await logAdminAction({
      adminId: admin.id,
      action: "create_update",
      targetTable: "updates",
      targetId: newUpdate.id,
      details: { title, adminEmail: admin.email },
    });

    return NextResponse.json({ success: true, update: newUpdate });
  } catch (err: any) {
    console.error("[api/admin/updates POST] Error:", err);
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/admin/updates - Delete a platform update
export async function DELETE(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized admin access" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const updateId = searchParams.get("id");

    if (!updateId) {
      return NextResponse.json({ error: "Update ID is required" }, { status: 400 });
    }

    const serviceSupabase = createServiceClient();
    const { error } = await serviceSupabase.from("updates").delete().eq("id", updateId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await logAdminAction({
      adminId: admin.id,
      action: "delete_update",
      targetTable: "updates",
      targetId: updateId,
      details: { adminEmail: admin.email },
    });

    return NextResponse.json({ success: true, message: "Update deleted" });
  } catch (err: any) {
    console.error("[api/admin/updates DELETE] Error:", err);
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}
