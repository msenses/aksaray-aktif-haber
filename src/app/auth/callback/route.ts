import { NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(request: Request) {
	const url = new URL(request.url);
	const code = url.searchParams.get("code");
	if (!code) {
		return NextResponse.redirect(new URL("/login?error=missing_code", url));
	}

	const res = NextResponse.redirect(new URL("/admin", url));
	const cookieStore = cookies();

	const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
		cookies: {
			get(name: string) {
				return cookieStore.get(name)?.value;
			},
			set(name: string, value: string, options: CookieOptions) {
				res.cookies.set({ name, value, ...options });
			},
			remove(name: string, options: CookieOptions) {
				res.cookies.set({ name, value: "", ...options, maxAge: 0 });
			},
		},
	});

	await supabase.auth.exchangeCodeForSession(code);

	return res;
}
