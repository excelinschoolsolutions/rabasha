"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function loginPioneer(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const supabase = await createClient();
  const { data: loginData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  console.log("[loginPioneer] signInWithPassword result:", { userId: loginData?.user?.id, error: error?.message, errorCode: error?.status });

  if (error) {
    console.warn("[loginPioneer] Supabase auth error:", error.message);
    return { error: error.message || "Incorrect email or password." };
  }

  redirect("/dashboard");
}
