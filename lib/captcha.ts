/**
 * Verify reCAPTCHA v3 token
 * @param token - The token received from the client
 * @returns Object with success status and score
 */
export async function verifyCaptchaToken(token: string): Promise<{
	success: boolean;
	score: number;
	action: string;
	error?: string;
}> {
	const secretKey = process.env.RECAPTCHA_SECRET_KEY;

	if (!secretKey) {
		console.error("RECAPTCHA_SECRET_KEY is not set");
		return {
			success: false,
			score: 0,
			action: "",
			error: "reCAPTCHA not configured",
		};
	}

	try {
		const response = await fetch(
			"https://www.google.com/recaptcha/api/siteverify",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: `secret=${secretKey}&response=${token}`,
			},
		);

		const data = await response.json();

		return {
			success: data.success && data.score > 0.5, // 0.5 is a reasonable threshold
			score: data.score || 0,
			action: data.action || "",
			error: data["error-codes"]?.[0],
		};
	} catch (error) {
		console.error("Error verifying captcha:", error);
		return {
			success: false,
			score: 0,
			action: "",
			error: "Failed to verify token",
		};
	}
}
