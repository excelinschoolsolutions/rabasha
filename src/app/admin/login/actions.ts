"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { logAdminAction } from "@/lib/admin";

export async function loginAdmin(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Please enter your admin email and password." };
  }

  const supabase = await createClient();

  // 1. Authenticate with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  console.log("[loginAdmin] signInWithPassword result:", { userId: authData?.user?.id, error: authError?.message, errorCode: authError?.status });

  if (authError || !authData.user) {
    return { error: `Invalid admin email or password. (${authError?.message || "no user"})` };
  }

  // 2. Verify admin permissions in public.admins
  const serviceSupabase = createServiceClient();
  const { data: adminRecord, error: adminError } = await serviceSupabase
    .from("admins")
    .select("id, role")
    .eq("user_id", authData.user.id)
    .maybeSingle();

  if (adminError || !adminRecord) {
    // User is authenticated but is NOT an authorized admin
    await supabase.auth.signOut();
    return { error: "Access denied. You do not have administrator permissions." };
  }

  // 3. Log the login action
  await logAdminAction({
    adminId: adminRecord.id,
    action: "admin_login",
    details: { email, role: adminRecord.role },
  });

  redirect("/admin");
}
