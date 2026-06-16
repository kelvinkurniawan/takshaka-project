export const CSRF_COOKIE_NAME = "csrf_token";
export const CSRF_HEADER_NAME = "x-csrf-token";

export function generateCsrfToken(): string {
	const array = new Uint8Array(32);
	crypto.getRandomValues(array);
	return Array.from(array)
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");
}

export function getCsrfTokenFromRequest(request: Request): string | null {
	return request.headers.get(CSRF_HEADER_NAME);
}

export function getCsrfTokenFromCookie(request: Request): string | null {
	const cookieHeader = request.headers.get("cookie") || "";
	const match = cookieHeader.match(
		new RegExp(`${CSRF_COOKIE_NAME}=([^;]+)`),
	);
	return match ? match[1] : null;
}

export function verifyCsrfToken(request: Request): boolean {
	const headerToken = getCsrfTokenFromRequest(request);
	const cookieToken = getCsrfTokenFromCookie(request);
	if (!headerToken || !cookieToken) return false;
	return headerToken === cookieToken;
}
