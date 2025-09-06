import { NextResponse } from "next/server";
import { createServerClient, parseCookieHeader, serializeCookieHeader } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(request: Request) {
	const url = new URL(request.url);
	const code = url.searchParams.get("code");
	if (!code) {
		return NextResponse.redirect(new URL("/login?error=missing_code", url));
	}

	const incomingCookies = parseCookieHeader(request.headers.get("cookie") ?? "");
	const response = NextResponse.redirect(new URL("/admin", url));

	const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
		cookies: {
			getAll: () => incomingCookies,
			setAll: (cookies) => {
				cookies.forEach((cookie) => {
					response.headers.append("Set-Cookie", serializeCookieHeader(cookie));
				});
			},
		},
	});

	await supabase.auth.exchangeCodeForSession(code);

	return response;
}
