import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Successful authentication - redirect to the next page or home
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Authentication failed - redirect to sign in with error
  return NextResponse.redirect(
    `${origin}/auth/sign-in?error=Authentication failed`
  );
}
