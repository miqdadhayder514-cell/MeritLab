import type { AppRole } from "@/lib/auth-context";
import { createClient } from "./server";

export async function getServerIdentity() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError?.name === "AuthSessionMissingError") return null;
  if (userError) throw userError;
  if (!user) return null;

  const [profileResult, roleResult] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase.from("user_roles").select("role").eq("user_id", user.id).maybeSingle(),
  ]);
  if (profileResult.error) throw profileResult.error;
  if (roleResult.error) throw roleResult.error;
  const savedRole = roleResult.data?.role;

  return {
    user,
    profile: profileResult.data,
    role:
      savedRole === "student" || savedRole === "admin" ? (savedRole as AppRole) : null,
  };
}
