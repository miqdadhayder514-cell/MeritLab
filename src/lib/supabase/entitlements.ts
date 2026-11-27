import "server-only";

import { createClient } from "./server";

export async function hasPlusAccess() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("has_plus_access");
  if (error) throw error;
  return data === true;
}
