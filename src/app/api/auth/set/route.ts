import { NextResponse } from "next/server";
import { createServerClient, parseCookieHeader, serializeCookieHeader } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: Request) {
	const body = await request.json();
	const access_token: string | undefined = body?.access_token;
	const refresh_token: string | undefined = body?.refresh_token;
	if (!access_token || !refresh_token) {
		return NextResponse.json({ ok: false }, { status: 400 });
	}
	const incomingCookies = parseCookieHeader(request.headers.get("cookie") ?? "");
	const response = NextResponse.json({ ok: true });
	const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
		cookies: {
			getAll: () => incomingCookies,
			setAll: (cookies) => cookies.forEach((c) => response.headers.append("Set-Cookie", serializeCookieHeader(c))),
		},
	});
	await supabase.auth.setSession({ access_token, refresh_token });
	return response;
}
