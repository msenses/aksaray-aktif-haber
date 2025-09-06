import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient, parseCookieHeader, serializeCookieHeader } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	if (!pathname.startsWith("/admin")) return NextResponse.next();

	const cookies = parseCookieHeader(request.headers.get("cookie") ?? "");
	const response = NextResponse.next();
	const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
		cookies: {
			getAll: () => cookies,
			setAll: (setCookies) => {
				setCookies.forEach((c) => response.headers.append("Set-Cookie", serializeCookieHeader(c)));
			},
		},
	});

	const { data } = await supabase.auth.getSession();
	if (!data.session) {
		const url = request.nextUrl.clone();
		url.pathname = "/login";
		return NextResponse.redirect(url);
	}
	return response;
}

export const config = {
	matcher: ["/admin/:path*"],
};
