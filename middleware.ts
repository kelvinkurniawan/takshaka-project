import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "auth_session";

export async function middleware(request: NextRequest) {
  // Check if user is trying to access protected routes
  const { pathname } = request.nextUrl;

  // Protected routes that require authentication
  const protectedRoutes = [
    "/app/dashboard",
    "/app/categories",
    "/app/content",
    "/app/users",
    "/app/settings",
  ];

  // Check if current path is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (isProtectedRoute) {
    // Get session cookie
    const cookieStore = await cookies();
    const session = cookieStore.get(SESSION_COOKIE_NAME);

    if (!session?.value) {
      // Redirect to login page if not authenticated
      const loginUrl = new URL("/secure-access", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Allow access to public routes or authenticated users
  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    // Run middleware on all routes
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
