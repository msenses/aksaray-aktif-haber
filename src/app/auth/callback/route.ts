import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const code = searchParams.get("code");
	const redirectTo = "/admin";
	if (!code) {
		return NextResponse.redirect(new URL("/login?error=missing_code", request.url));
	}
	const supabase = createSupabaseServerClient();
	await supabase.auth.exchangeCodeForSession(code);
	return NextResponse.redirect(new URL(redirectTo, request.url));
}
