import { NextRequest, NextResponse } from "next/server";
import { verifyTransaction } from "@/lib/paystack";
import { createServiceClient } from "@/lib/supabase/service";

// Paystack redirects the customer's browser here after they complete (or
// abandon) checkout. This is purely for fast UX — the webhook route is
// the authoritative confirmation, since a browser redirect can be closed,
// blocked, or skipped entirely. Both paths are safe to run more than
// once: the update below only ever moves a contribution from pending to
// success, never the reverse, and re-running it on an already-successful
// row is a harmless no-op.
export async function GET(request: NextRequest) {
  const reference = request.nextUrl.searchParams.get("reference");

  if (!reference) {
    return NextResponse.redirect(new URL("/checkout/failed", request.url));
  }

  try {
    const result = await verifyTransaction(reference);

    if (result.status !== "success") {
      return NextResponse.redirect(new URL("/checkout/failed", request.url));
    }

    const supabase = createServiceClient();

    const { data: contribution } = await supabase
      .from("contributions")
      .select("id, pioneer_id, status")
      .eq("paystack_ref", reference)
      .maybeSingle();

    if (!contribution) {
      return NextResponse.redirect(new URL("/checkout/failed", request.url));
    }

    if (contribution.status !== "success") {
      await supabase
        .from("contributions")
        .update({ status: "success" })
        .eq("id", contribution.id);

      await supabase
        .from("pioneers")
        .update({ status: "active" })
        .eq("id", contribution.pioneer_id);
    }

    return NextResponse.redirect(new URL("/welcome", request.url));
  } catch {
    return NextResponse.redirect(new URL("/checkout/failed", request.url));
  }
}
