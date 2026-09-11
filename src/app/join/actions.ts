"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function registerPioneer(formData: FormData) {
  const fullName = String(formData.get("fullName") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const university = String(formData.get("university") || "").trim();
  const department = String(formData.get("department") || "").trim();
  const level = String(formData.get("level") || "").trim();
  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");
  const referredByCode = String(formData.get("referredByCode") || "").trim();

  if (!fullName || !email || !phone || !department || !level) {
    return { error: "Please fill in every field." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }
  if (password !== confirmPassword) {
    return { error: "Passwords don't match." };
  }

  const supabase = await createClient();

  // All profile fields ride along as auth user metadata. A database
  // trigger (handle_new_pioneer) reads this metadata and creates the
  // public.pioneers row with elevated privileges — this avoids relying
  // on a client session that may not exist yet if email confirmation
  // is required.
  const { data, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone,
        university: university || "Rivers State University",
        department,
        level,
        referred_by_code: referredByCode || null,
      },
    },
  });

  if (authError) {
    return { error: authError.message };
  }
  if (!data.user) {
    return { error: "Couldn't create your account. Please try again." };
  }

  // If email confirmation is required, there's no session yet — send
  // them to check their inbox instead of straight to checkout.
  if (!data.session) {
    redirect("/join/check-email");
  }

  redirect("/checkout");
}
