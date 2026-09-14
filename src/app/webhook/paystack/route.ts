import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { verifyTransaction, fulfillMutaContribution } from "@/lib/paystack";

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");
  const secret = process.env.PAYSTACK_SECRET_KEY;

  if (!secret) {
    console.error("[webhook/paystack] PAYSTACK_SECRET_KEY is not set.");
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  // 1. Verify HMAC SHA-512 signature against x-paystack-signature header
  const expectedSignature = crypto
    .createHmac("sha512", secret)
    .update(rawBody)
    .digest("hex");

  if (!signature || signature !== expectedSignature) {
    console.warn("[webhook/paystack] Invalid signature received.");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: any;
  try {
    event = JSON.parse(rawBody);
  } catch (err) {
    console.error("[webhook/paystack] Failed to parse JSON body:", err);
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Handle charge.success events
  if (event?.event === "charge.success") {
    const reference = event?.data?.reference as string | undefined;

    if (reference) {
      try {
        // 2. Authoritative check: Never trust the webhook payload alone.
        // Query Paystack's verify endpoint as the single source of truth.
        const verifyData = await verifyTransaction(reference);

        if (verifyData.status === "success") {
          // 3. Inspect metadata.product to route to the correct product
          const product =
            verifyData?.metadata?.product ||
            event?.data?.metadata?.product ||
            (reference.startsWith("muta_") ? "muta" : undefined);

          if (product === "muta") {
            // Fulfill Mụta pioneer contribution idempotently
            const fulfillment = await fulfillMutaContribution(reference, verifyData);
            console.log(
              `[webhook/paystack] Mụta payment fulfilled for ref: ${reference}, alreadyProcessed: ${fulfillment.alreadyProcessed}`,
            );
          } else {
            // Routing for Product B (or any non-Mụta product)
            console.log(
              `[webhook/paystack] Routing event to Product B (product: ${product}, ref: ${reference})`,
            );

            const productBWebhookUrl =
              process.env.PRODUCT_B_WEBHOOK_URL ||
              "https://excel-in-school-backend.onrender.com/payments/webhook";
            
            if (productBWebhookUrl) {
              try {
                await fetch(productBWebhookUrl, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "x-paystack-signature": signature,
                    "x-forwarded-by": "muta-paystack-shared-webhook",
                  },
                  body: rawBody,
                });
                console.log(`[webhook/paystack] Successfully forwarded event to Product B at ${productBWebhookUrl}`);
              } catch (forwardErr) {
                console.error("[webhook/paystack] Failed to forward event to Product B:", forwardErr);
              }
            }
          }
        } else {
          console.warn(`[webhook/paystack] Transaction verify returned non-success status: ${verifyData.status}`);
        }
      } catch (err) {
        console.error("[webhook/paystack] Error during transaction verification / fulfillment:", err);
      }
    }
  }

  // 4. Always respond 200 OK promptly to acknowledge receipt and prevent Paystack retries
  return NextResponse.json({ received: true }, { status: 200 });
}
