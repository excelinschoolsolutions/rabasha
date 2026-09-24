@@ -8,3 +8,16 @@ export async function logout() {
  await supabase.auth.signOut();
  redirect("/login");
}

export async function logoutPioneer() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function logoutAdmin() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
