import { NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: Request) {
	const body = await request.json();
	const access_token: string | undefined = body?.access_token;
	const refresh_token: string | undefined = body?.refresh_token;
	if (!access_token || !refresh_token) {
		return NextResponse.json({ ok: false }, { status: 400 });
	}

	const res = NextResponse.json({ ok: true });
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

	await supabase.auth.setSession({ access_token, refresh_token });
	return res;
}
