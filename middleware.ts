import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	if (!pathname.startsWith("/admin")) return NextResponse.next();

	const response = NextResponse.next();
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
		url.pathname = "/login";
		return NextResponse.redirect(url);
	}
	return response;
}

export const config = {
	matcher: ["/admin/:path*"],
};
