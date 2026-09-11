"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { generateReferralCode } from "@/lib/referral";

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

  // 1. Create the auth user.
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError || !authData.user) {
    return { error: authError?.message ?? "Couldn't create your account." };
  }

  // 2. Look up who referred them, if a referral code was passed in.
  let referredBy: string | null = null;
  if (referredByCode) {
    const { data: referrer } = await supabase
      .from("pioneers")
      .select("id")
      .eq("referral_code", referredByCode)
      .maybeSingle();
    referredBy = referrer?.id ?? null;
  }

  // 3. Generate a unique referral code for this new pioneer, retrying on
  // the rare collision.
  let referralCode = generateReferralCode();
  for (let attempt = 0; attempt < 5; attempt++) {
    const { data: existing } = await supabase
      .from("pioneers")
      .select("id")
      .eq("referral_code", referralCode)
      .maybeSingle();
    if (!existing) break;
    referralCode = generateReferralCode();
  }

  // 4. Create the pioneer profile row, status starts as pending_payment.
  const { error: insertError } = await supabase.from("pioneers").insert({
    user_id: authData.user.id,
    full_name: fullName,
    email,
    phone,
    university: university || "Rivers State University",
    department,
    level,
    referral_code: referralCode,
    referred_by: referredBy,
  });

  if (insertError) {
    return { error: insertError.message };
  }

  redirect("/checkout");
}
