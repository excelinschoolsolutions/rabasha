import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// This client uses the SERVICE ROLE key, which bypasses Row Level
// Security entirely. Never import this file into anything that runs in
// the browser, and never expose SUPABASE_SERVICE_ROLE_KEY as NEXT_PUBLIC_.
// It exists only for the Paystack callback/webhook routes, which need to
// mark payments as successful on behalf of a pioneer who may not have an
// active session at that moment (e.g. a webhook has no session at all).
export function createServiceClient() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "https://ygimsldeaoyugyltqibj.supabase.co";
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlnaW1zbGRlYW95dWd5bHRxaWJqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODg1MjkyMCwiZXhwIjoyMTA0NDI4OTIwfQ.PBBZheybxhX-UFdrJuAlq4MvHsjjg6pgeA5-DsMaMNM";

  return createSupabaseClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
