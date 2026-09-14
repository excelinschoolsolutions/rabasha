import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

export interface AdminProfile {
  id: string;
  user_id: string;
  role: "super_admin" | "ops" | "moderator";
  email: string;
  created_at: string;
}

/**
 * Checks if the current session belongs to an authenticated admin.
 * Returns the admin profile or null if not an admin.
 */
export async function getCurrentAdmin(): Promise<AdminProfile | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !user.email) {
      return null;
    }

    const serviceSupabase = createServiceClient();
    const { data: adminRecord, error } = await serviceSupabase
      .from("admins")
      .select("id, user_id, role, created_at")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error || !adminRecord) {
      return null;
    }

    return {
      id: adminRecord.id,
      user_id: adminRecord.user_id,
      role: adminRecord.role,
      email: user.email,
      created_at: adminRecord.created_at,
    };
  } catch (err) {
    console.error("[getCurrentAdmin] Error checking admin status:", err);
    return null;
  }
}

/**
 * Records an audit log in public.admin_actions.
 */
export async function logAdminAction(params: {
  adminId: string;
  action: string;
  targetTable?: string;
  targetId?: string;
  details?: Record<string, any>;
}) {
  try {
    const serviceSupabase = createServiceClient();
    await serviceSupabase.from("admin_actions").insert({
      admin_id: params.adminId,
      action: params.action,
      target_table: params.targetTable || null,
      target_id: params.targetId || null,
      details: params.details || null,
    });
  } catch (err) {
    console.error("[logAdminAction] Error logging admin action:", err);
  }
}
