import { NextRequest, NextResponse } from "next/server";
import { verifyTransaction, fulfillMutaContribution } from "@/lib/paystack";

// Paystack redirects the customer's browser here after they complete (or
// abandon) checkout. This is purely for fast UX — the webhook route is
// the authoritative confirmation, since a browser redirect can be closed,
// blocked, or skipped entirely. Both paths are safe to run more than
// once: fulfillMutaContribution only ever moves a contribution from pending to
// success, never the reverse, and re-running it on an already-successful
// row is a harmless no-op.
export async function GET(request: NextRequest) {
  const reference =
    request.nextUrl.searchParams.get("reference") ||
    request.nextUrl.searchParams.get("trxref");

  if (!reference) {
    console.warn("[checkout/callback] No reference or trxref parameter found in URL.");
    return NextResponse.redirect(new URL("/checkout/failed", request.url));
  }

  try {
    const result = await verifyTransaction(reference);

    if (result.status !== "success") {
      console.warn(`[checkout/callback] Paystack returned status: ${result.status} for ref: ${reference}`);
      return NextResponse.redirect(new URL("/checkout/failed", request.url));
    }

    // Fulfill contribution idempotently
    await fulfillMutaContribution(reference, result);

    // Payment is verified as success by Paystack, redirect user to welcome page
    return NextResponse.redirect(new URL("/welcome", request.url));
  } catch (err) {
    console.error("[checkout/callback] Error processing callback:", err);
    return NextResponse.redirect(new URL("/checkout/failed", request.url));
  }
}
