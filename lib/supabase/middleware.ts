import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export const updateSession = async (request: NextRequest) => {
  const response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const clearSupabaseAuthCookies = () => {
    const cookieNames = request.cookies
      .getAll()
      .map((cookie) => cookie.name)
      .filter((name) => name.startsWith("sb-"));

    cookieNames.forEach((name) => {
      response.cookies.set(name, "", {
        path: "/",
        maxAge: 0,
      });
    });
  };

  const isStaleRefreshError = (message: string) =>
    message.includes("Invalid Refresh Token") ||
    message.includes("Refresh Token Not Found");

  let user = null;
  try {
    const {
      data: { user: authUser },
      error,
    } = await supabase.auth.getUser();

    if (error?.message && isStaleRefreshError(error.message)) {
      clearSupabaseAuthCookies();
      user = null;
    } else if (error) {
      user = authUser ?? null;
    } else {
      user = authUser;
    }
  } catch (error) {
    if (error instanceof Error && isStaleRefreshError(error.message)) {
      clearSupabaseAuthCookies();
    } else {
      throw error;
    }
  }

  if (request.nextUrl.pathname.startsWith("/admin") && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
};
