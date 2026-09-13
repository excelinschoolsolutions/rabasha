import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

// Paystack calls this server-to-server whenever a transaction event
// happens. Unlike the /checkout/callback route, this doesn't depend on
// the customer's browser at all — it's the source of truth for "did the
// money actually arrive," so register this URL in your Paystack
// dashboard under Settings → API Keys & Webhooks.
export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");
  const secret = process.env.PAYSTACK_SECRET_KEY;

  if (!secret) {
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  const expectedSignature = crypto
    .createHmac("sha512", secret)
    .update(rawBody)
    .digest("hex");

  if (signature !== expectedSignature) {
    // Not actually from Paystack — reject without processing.
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody);

  if (event.event === "charge.success") {
    const reference = event.data.reference as string;
    const supabase = createServiceClient();

    const { data: contribution } = await supabase
      .from("contributions")
      .select("id, pioneer_id, status")
      .eq("paystack_ref", reference)
      .maybeSingle();

    if (contribution && contribution.status !== "success") {
      await supabase
        .from("contributions")
        .update({ status: "success" })
        .eq("id", contribution.id);

      await supabase
        .from("pioneers")
        .update({ status: "active" })
        .eq("id", contribution.pioneer_id);
    }
  }

  // Always 200 so Paystack doesn't endlessly retry an event we've
  // already handled (or intentionally ignored).
  return NextResponse.json({ received: true });
}
