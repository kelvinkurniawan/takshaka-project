"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";

interface ValidationErrors {
	email?: string;
	password?: string;
}

export default function SecureAccessPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState<ValidationErrors>({});
	const [touched, setTouched] = useState<Record<string, boolean>>({});

	const validateField = (name: string, value: string): string | undefined => {
		switch (name) {
			case "email":
				if (!value.trim()) return "Email is required";
				const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
				if (!emailRegex.test(value)) return "Please enter a valid email";
				return undefined;

			case "password":
				if (!value.trim()) return "Password is required";
				if (value.length < 6) return "Password must be at least 6 characters";
				return undefined;

			default:
				return undefined;
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;

		if (name === "email") setEmail(value);
		if (name === "password") setPassword(value);

		// Validate on change if field has been touched
		if (touched[name]) {
			const fieldError = validateField(name, value);
			setErrors((prev) => ({
				...prev,
				[name]: fieldError,
			}));
		}
	};

	const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setTouched((prev) => ({
			...prev,
			[name]: true,
		}));

		const fieldError = validateField(name, value);
		setErrors((prev) => ({
			...prev,
			[name]: fieldError,
		}));
	};

	const validateForm = (): boolean => {
		const newErrors: ValidationErrors = {};

		const emailError = validateField("email", email);
		if (emailError) newErrors.email = emailError;

		const passwordError = validateField("password", password);
		if (passwordError) newErrors.password = passwordError;

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		// Validate form
		if (!validateForm()) {
			return;
		}

		setIsLoading(true);

		try {
			const response = await fetch("/api/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
			});

			const data = await response.json();

			if (!response.ok) {
				setError(data.error || "Login gagal");
				return;
			}

			// Redirect to dashboard on successful login
			router.push("/app/dashboard");
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: "Terjadi kesalahan. Silakan coba lagi.",
			);
			console.error("Login error:", err);
		} finally {
			setIsLoading(false);
		}
	};

	// Geist input: white surface, shadow-as-border, blue focus ring (design.md)
	const inputBase =
		"w-full pl-10 pr-4 py-2.5 rounded-md bg-white text-[#171717] text-sm placeholder-[#808080] transition duration-150 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

	return (
		<div
			className="min-h-screen flex items-center justify-center bg-white px-4"
			style={{
				fontFamily:
					'"Geist", Arial, "Apple Color Emoji", "Segoe UI Emoji", sans-serif',
			}}
		>
			<div className="w-full max-w-sm">
				{/* Logo */}
				<div className="flex justify-center mb-8">
					<img src="/images/logo.png" alt="Logo" className="w-44 h-auto" />
				</div>

				{/* Card — shadow-as-border, no CSS border */}
				<div
					className="rounded-lg bg-white p-8"
					style={{ boxShadow: "var(--ds-shadow-card)" }}
				>
					<h1
						className="text-2xl font-semibold text-[#171717] text-center"
						style={{ letterSpacing: "-0.96px" }}
					>
						Sign in
					</h1>
					<p className="text-sm text-[#4d4d4d] text-center mt-1 mb-6">
						Masuk untuk mengelola Takshaka CMS
					</p>

					<form className="space-y-4" onSubmit={handleSubmit}>
						{/* Error Alert */}
						{error && (
							<div className="flex gap-3 rounded-md bg-[#fef2f2] p-3 shadow-[0_0_0_1px_rgba(220,38,38,0.2)]">
								<AlertCircle className="w-5 h-5 text-[#dc2626] flex-shrink-0 mt-0.5" />
								<div className="text-sm font-medium text-[#b91c1c]">{error}</div>
							</div>
						)}

						{/* Email Input */}
						<div className="group">
							<label
								htmlFor="email"
								className="block text-sm font-medium text-[#171717] mb-2"
							>
								Email
							</label>
							<div className="relative">
								<Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#808080] group-focus-within:text-[#0072f5] transition" />
								<input
									id="email"
									name="email"
									type="email"
									autoComplete="email"
									className={`${inputBase} ${
										errors.email && touched.email
											? "shadow-[0_0_0_1px_rgba(220,38,38,0.5)] focus:shadow-[0_0_0_2px_rgba(220,38,38,0.5)]"
											: "shadow-[0_0_0_1px_rgba(0,0,0,0.1)] focus:shadow-[0_0_0_2px_hsla(212,100%,48%,1)]"
									}`}
									placeholder="nama@example.com"
									value={email}
									onChange={handleChange}
									onBlur={handleBlur}
									disabled={isLoading}
								/>
							</div>
							{errors.email && touched.email && (
								<p className="mt-1 text-xs text-[#dc2626]">{errors.email}</p>
							)}
						</div>

						{/* Password Input */}
						<div className="group">
							<label
								htmlFor="password"
								className="block text-sm font-medium text-[#171717] mb-2"
							>
								Password
							</label>
							<div className="relative">
								<Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#808080] group-focus-within:text-[#0072f5] transition" />
								<input
									id="password"
									name="password"
									type="password"
									autoComplete="current-password"
									className={`${inputBase} ${
										errors.password && touched.password
											? "shadow-[0_0_0_1px_rgba(220,38,38,0.5)] focus:shadow-[0_0_0_2px_rgba(220,38,38,0.5)]"
											: "shadow-[0_0_0_1px_rgba(0,0,0,0.1)] focus:shadow-[0_0_0_2px_hsla(212,100%,48%,1)]"
									}`}
									placeholder="••••••••"
									value={password}
									onChange={handleChange}
									onBlur={handleBlur}
									disabled={isLoading}
								/>
							</div>
							{errors.password && touched.password && (
								<p className="mt-1 text-xs text-[#dc2626]">{errors.password}</p>
							)}
						</div>

						{/* Submit — dark primary CTA, 6px radius (design.md) */}
						<button
							type="submit"
							disabled={isLoading}
							className="w-full py-2.5 px-4 bg-[#171717] text-white text-sm font-medium rounded-md transition duration-150 flex items-center justify-center gap-2 hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:shadow-[0_0_0_2px_#fff,0_0_0_4px_hsla(212,100%,48%,1)]"
						>
							{isLoading ? (
								<>
									<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
									Melakukan login...
								</>
							) : (
								<>
									Login
									<ArrowRight className="w-4 h-4" />
								</>
							)}
						</button>
					</form>
				</div>

				{/* Footer */}
				<div className="space-y-3 text-center mt-6">
					<p className="text-xs text-[#808080]">
						This site is protected by reCAPTCHA and the Google{" "}
						<a
							href="https://policies.google.com/privacy"
							className="text-[#0072f5] hover:underline"
						>
							Privacy Policy
						</a>{" "}
						and{" "}
						<a
							href="https://policies.google.com/terms"
							className="text-[#0072f5] hover:underline"
						>
							Terms of Service
						</a>{" "}
						apply.
					</p>
					<p className="text-xs text-[#a1a1a1]">
						© 2026 Takshaka. Semua hak terlindungi.
					</p>
				</div>
			</div>
		</div>
	);
}
