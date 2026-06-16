import { CSRF_COOKIE_NAME, CSRF_HEADER_NAME } from "@/lib/csrf";

function getCsrfToken(): string {
	if (typeof document === "undefined") return "";
	const match = document.cookie.match(
		new RegExp(`${CSRF_COOKIE_NAME}=([^;]+)`),
	);
	return match ? match[1] : "";
}

export async function apiFetch(
	url: string,
	options: RequestInit = {},
): Promise<Response> {
	const csrfToken = getCsrfToken();
	return fetch(url, {
		...options,
		headers: {
			...options.headers,
			...(csrfToken ? { [CSRF_HEADER_NAME]: csrfToken } : {}),
		},
	});
}
