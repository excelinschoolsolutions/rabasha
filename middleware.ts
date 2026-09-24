import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Run on every route except static assets and server-to-server
     * endpoints (API routes, Paystack callback/webhook) that don't need
     * a browser session refreshed.
     */
    "/((?!_next/static|_next/image|favicon.ico|api/|checkout/callback|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
