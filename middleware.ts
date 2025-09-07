import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const isAdminPath = pathname.startsWith("/admin");
	const isAuthPath = pathname.startsWith("/admin/login") || pathname.startsWith("/admin/reset");
	if (!isAdminPath || isAuthPath) {
		return NextResponse.next();
	}

	// Mark admin routes so server components can detect reliably
	const requestHeaders = new Headers(request.headers);
	requestHeaders.set("x-admin-route", "1");
	const response = NextResponse.next({ request: { headers: requestHeaders } });
	const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
		cookies: {
			get(name: string) {
				return request.cookies.get(name)?.value;
			},
			set(name: string, value: string, options: CookieOptions) {
				response.cookies.set({ name, value, ...options });
			},
			remove(name: string, options: CookieOptions) {
				response.cookies.set({ name, value: "", ...options, maxAge: 0 });
			},
		},
	});

	const { data } = await supabase.auth.getSession();
	if (!data.session) {
		const url = request.nextUrl.clone();
		url.pathname = "/admin/login";
		return NextResponse.redirect(url);
	}
	return response;
}

export const config = {
	matcher: ["/admin/:path*"],
};
