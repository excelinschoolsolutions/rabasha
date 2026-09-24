import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// This client uses the SERVICE ROLE key, which bypasses Row Level
// Security entirely. Never import this file into anything that runs in
// the browser, and never expose SUPABASE_SERVICE_ROLE_KEY as NEXT_PUBLIC_.
// It exists only for the Paystack callback/webhook routes, which need to
// mark payments as successful on behalf of a pioneer who may not have an
// active session at that moment (e.g. a webhook has no session at all).
export function createServiceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
