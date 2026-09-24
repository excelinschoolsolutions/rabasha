import { createServiceClient } from "@/lib/supabase/service";

const PAYSTACK_BASE = "https://api.paystack.co";

function secretKey(): string {
@@ -6,11 +8,34 @@ function secretKey(): string {
  return key;
}

export interface PaystackMetadata {
  product?: string;
  order_id?: string;
  [key: string]: any;
}

export interface PaystackVerifyData {
  status: string;
  reference: string;
  amount: number;
  gateway_response?: string;
  paid_at?: string;
  channel?: string;
  currency?: string;
  customer?: {
    email: string;
    [key: string]: any;
  };
  metadata?: PaystackMetadata;
  [key: string]: any;
}

export async function initializeTransaction(params: {
  email: string;
  amountNaira: number;
  reference: string;
  callbackUrl: string;
  metadata?: PaystackMetadata;
}) {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: "POST",
@@ -23,6 +48,7 @@ export async function initializeTransaction(params: {
      amount: params.amountNaira * 100, // Paystack expects kobo
      reference: params.reference,
      callback_url: params.callbackUrl,
      metadata: params.metadata,
    }),
  });

@@ -33,7 +59,7 @@ export async function initializeTransaction(params: {
  return json.data as { authorization_url: string; reference: string };
}

export async function verifyTransaction(reference: string) {
export async function verifyTransaction(reference: string): Promise<PaystackVerifyData> {
  const res = await fetch(
    `${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`,
    { headers: { Authorization: `Bearer ${secretKey()}` } },
@@ -42,5 +68,102 @@ export async function verifyTransaction(reference: string) {
  if (!res.ok || !json.status) {
    throw new Error(json.message || "Could not verify payment with Paystack.");
  }
  return json.data as { status: string; reference: string; amount: number };
  return json.data as PaystackVerifyData;
}

/**
 * Idempotently marks a Mụta pioneer contribution as successful and activates the pioneer profile.
 * Can safely be called by both Webhook and Browser Redirect callback routes without double-processing.
 */
export async function fulfillMutaContribution(
  reference: string,
  verifyData?: PaystackVerifyData,
): Promise<{ success: boolean; alreadyProcessed?: boolean; error?: string }> {
  try {
    const supabase = createServiceClient();

    // 1. First attempt: Find contribution by Paystack reference
    const { data: contribution, error: fetchError } = await supabase
      .from("contributions")
      .select("id, pioneer_id, status")
      .eq("paystack_ref", reference)
      .maybeSingle();

    if (fetchError) {
      console.error("[fulfillMutaContribution] Error fetching contribution:", fetchError);
    }

    if (contribution) {
      // Idempotency check: If already marked success, do nothing
      if (contribution.status === "success") {
        return { success: true, alreadyProcessed: true };
      }

      // Update contribution status to success
      const { error: updateContributionError } = await supabase
        .from("contributions")
        .update({ status: "success" })
        .eq("id", contribution.id);

      if (updateContributionError) {
        console.error("[fulfillMutaContribution] Error updating contribution status:", updateContributionError);
      }

      // Update pioneer status to active
      if (contribution.pioneer_id) {
        const { error: updatePioneerError } = await supabase
          .from("pioneers")
          .update({ status: "active" })
          .eq("id", contribution.pioneer_id);

        if (updatePioneerError) {
          console.error("[fulfillMutaContribution] Error updating pioneer status:", updatePioneerError);
        }
      }

      return { success: true, alreadyProcessed: false };
    }

    // 2. Fallback attempt: If contribution not found by ref, look up pioneer by email from Paystack verification
    const customerEmail = verifyData?.customer?.email;
    if (customerEmail) {
      console.log(`[fulfillMutaContribution] Searching pioneer profile by email: ${customerEmail}`);
      const { data: pioneer, error: pioneerError } = await supabase
        .from("pioneers")
        .select("id, status")
        .eq("email", customerEmail)
        .maybeSingle();

      if (pioneerError) {
        console.error("[fulfillMutaContribution] Error fetching pioneer by email:", pioneerError);
      }

      if (pioneer) {
        // Activate pioneer
        await supabase
          .from("pioneers")
          .update({ status: "active" })
          .eq("id", pioneer.id);

        // Record contribution if possible
        const amountNaira = verifyData?.amount ? verifyData.amount / 100 : 2000;
        await supabase
          .from("contributions")
          .insert({
            pioneer_id: pioneer.id,
            amount: amountNaira,
            paystack_ref: reference,
            status: "success",
          });

        return { success: true, alreadyProcessed: false };
      }
    }

    console.warn(`[fulfillMutaContribution] No contribution or pioneer profile matched for ref: ${reference}`);
    return { success: true, alreadyProcessed: false };
  } catch (err: any) {
    console.error("[fulfillMutaContribution] Unexpected error:", err);
    return { success: false, error: err?.message || "Internal fulfillment error" };
  }
}
