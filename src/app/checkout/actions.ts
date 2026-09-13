"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { initializeTransaction } from "@/lib/paystack";

export async function startCheckout(formData: FormData) {
  const amount = Number(formData.get("amount"));

  if (!amount || amount < 2000) {
    return { error: "Minimum contribution is ₦2,000." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    redirect("/login");
  }

  // A reference we control, so we can look the transaction back up
  // ourselves regardless of how Paystack's own IDs are formatted.
  const reference = `muta_${crypto.randomUUID()}`;

  // Creates the contributions row via a SECURITY DEFINER function scoped
  // to "insert a row for my own pioneer profile only" — see the
  // create_pending_contribution migration.
  const { error: rpcError } = await supabase.rpc("create_pending_contribution", {
    p_amount: amount,
    p_reference: reference,
  });

  if (rpcError) {
    return { error: rpcError.message };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  let authorizationUrl: string;
  try {
    const result = await initializeTransaction({
      email: user.email,
      amountNaira: amount,
      reference,
      callbackUrl: `${siteUrl}/checkout/callback`,
    });
    authorizationUrl = result.authorization_url;
  } catch (err) {
    return {
      error:
        err instanceof Error
          ? err.message
          : "Couldn't start payment. Please try again.",
    };
  }

  redirect(authorizationUrl);
}
