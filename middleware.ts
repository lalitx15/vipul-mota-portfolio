import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/supabase";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return response;
  }

  const supabase = createServerClient<Database>(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options as any)
        );
      },
    },
  });

  // Refresh auth token
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Protect /member routes
  if (pathname.startsWith("/member")) {
    if (!user) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/login";
      redirectUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Protect /admin routes
  if (pathname.startsWith("/admin")) {
    const hasAdminSession =
      request.cookies.get("vm_admin_session")?.value === "authenticated";

    // Permit access to dedicated admin login interface
    if (pathname === "/admin/login") {
      if (hasAdminSession) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = "/admin";
        return NextResponse.redirect(redirectUrl);
      }

      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("role, status")
          .eq("id", user.id)
          .maybeSingle();
        const profile = data as { role?: string; status?: string } | null;
        if (profile?.role === "admin" && profile?.status === "active") {
          const redirectUrl = request.nextUrl.clone();
          redirectUrl.pathname = "/admin";
          return NextResponse.redirect(redirectUrl);
        }
      }
      return response;
    }

    // If master admin cookie is authenticated, grant access immediately!
    if (hasAdminSession) {
      return response;
    }

    if (!user) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/admin/login";
      return NextResponse.redirect(redirectUrl);
    }

    // Check user role from profiles table
    const { data } = await supabase
      .from("profiles")
      .select("role, status")
      .eq("id", user.id)
      .maybeSingle();

    const profile = data as { role?: string; status?: string } | null;

    if (profile?.role !== "admin" || profile?.status !== "active") {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/admin/login";
      return NextResponse.redirect(redirectUrl);
    }
  }

  // If already authenticated, redirect away from /login and /signup
  if (user && (pathname === "/login" || pathname === "/signup")) {
    const nextParam = request.nextUrl.searchParams.get("next");
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = nextParam && nextParam.startsWith("/") ? nextParam : "/member";
    redirectUrl.searchParams.delete("next");
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets like .svg, .png, .jpg, .jpeg, .gif, .webp
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
