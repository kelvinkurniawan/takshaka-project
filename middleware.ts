import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE_NAME = "auth_session";

export async function middleware(request: NextRequest) {
	// Check if user is trying to access protected /app/* routes
	const { pathname } = request.nextUrl;

	const isAppRoute = pathname.startsWith("/app");

	// Exclude API under /app/api/* and the login page itself
	const isAppApi = pathname.startsWith("/app/api");
	const isLoginPage =
		pathname === "/app/secure-access" || pathname === "/app/secure-access/";

	if (isAppRoute && !isAppApi && !isLoginPage) {
		// Read session cookie from the incoming request
		const sessionValue = request.cookies.get(SESSION_COOKIE_NAME)?.value;

		// Basic validation of session cookie (expects numeric user id)
		if (!sessionValue || Number.isNaN(parseInt(sessionValue, 10))) {
			const loginUrl = new URL("/app/secure-access", request.url);
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
