import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
	generateCsrfToken,
	verifyCsrfToken,
	CSRF_COOKIE_NAME,
} from "@/lib/csrf";

const SESSION_COOKIE_NAME = "auth_session";
const MUTATION_METHODS = ["POST", "PUT", "DELETE", "PATCH"];

// API routes that skip CSRF validation (public endpoints)
const PUBLIC_API_PATTERNS = [
	/^\/api\/auth\//,
	/^\/api\/public\//,
	/^\/api\/comments/,
	/^\/api\/contact-submissions$/,
	/^\/api\/search/,
	/^\/api\/app\/analytics\/track/,
	/^\/api\/health/,
	/^\/api\/seed/,
	/^\/api\/cron\//,
];

function isPublicApi(pathname: string): boolean {
	return PUBLIC_API_PATTERNS.some((pattern) => pattern.test(pathname));
}

function buildCsrfCookieHeader(token: string, isProduction: boolean): string {
	return `${CSRF_COOKIE_NAME}=${token}; Path=/; Max-Age=86400; SameSite=Strict${isProduction ? "; Secure" : ""}`;
}

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const isProduction = process.env.NODE_ENV === "production";

	// CSRF validation for mutation requests to protected API routes
	if (
		MUTATION_METHODS.includes(request.method) &&
		pathname.startsWith("/api/") &&
		!isPublicApi(pathname)
	) {
		if (!verifyCsrfToken(request)) {
			return NextResponse.json(
				{ error: "CSRF token mismatch" },
				{ status: 403 },
			);
		}
	}

	// Protect /app/* routes (redirect to login if no session)
	const isAppRoute = pathname.startsWith("/app");
	const isAppApi = pathname.startsWith("/app/api");
	const isLoginPage =
		pathname === "/app/secure-access" || pathname === "/app/secure-access/";

	if (isAppRoute && !isAppApi && !isLoginPage) {
		const sessionValue = request.cookies.get(SESSION_COOKIE_NAME)?.value;

		if (!sessionValue || Number.isNaN(parseInt(sessionValue, 10))) {
			const loginUrl = new URL("/app/secure-access", request.url);
			return NextResponse.redirect(loginUrl);
		}
	}

	const response = NextResponse.next();

	// Set CSRF cookie on non-API responses if not already present
	if (!pathname.startsWith("/api/") && !pathname.startsWith("/_next/")) {
		const existingCsrf = request.cookies.get(CSRF_COOKIE_NAME)?.value;
		if (!existingCsrf) {
			const token = generateCsrfToken();
			response.headers.append(
				"Set-Cookie",
				buildCsrfCookieHeader(token, isProduction),
			);
		}
	}

	return response;
}

export const config = {
	matcher: [
		"/((?!_next/static|_next/image|favicon.ico).*)",
	],
};
