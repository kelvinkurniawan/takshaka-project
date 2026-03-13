"use client";

import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

interface RecaptchaProviderProps {
	children: React.ReactNode;
}

export function RecaptchaProvider({ children }: RecaptchaProviderProps) {
	const reCaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

	if (!reCaptchaKey) {
		console.warn(
			"NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not set. reCAPTCHA will not work.",
		);
		return <>{children}</>;
	}

	return (
		<GoogleReCaptchaProvider reCaptchaKey={reCaptchaKey}>
			{children}
		</GoogleReCaptchaProvider>
	);
}
