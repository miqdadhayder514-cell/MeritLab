import { type NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

function safeNextPath(value: string | null) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/dashboard";
}

export async function GET(request: NextRequest) {
  const next = safeNextPath(request.nextUrl.searchParams.get("next"));
  const code = request.nextUrl.searchParams.get("code");
  if (!isSupabaseConfigured) {
    return NextResponse.redirect(new URL("/login?error=configuration", request.url));
  }
  if (!code) {
    return NextResponse.redirect(new URL("/login?error=verification", request.url));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    const destination = next === "/reset-password" ? next : "/login";
    return NextResponse.redirect(new URL(`${destination}?error=callback`, request.url));
  }

  return NextResponse.redirect(new URL(next, request.url));
}
