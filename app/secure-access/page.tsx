"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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

	return (
		<div className="relative h-screen flex items-center justify-center overflow-hidden">
			{/* background image + overlay to mirror homepage hero */}
			<div className="absolute inset-0">
				<Image
					src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
					alt="Background"
					fill
					className="object-cover"
					priority
				/>
			</div>
			<div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40"></div>

			<div className="relative z-10 max-w-md w-full space-y-8 px-8 sm:px-6 lg:px-8 text-white py-8 rounded-lg bg-white/5 backdrop-blur-md border border-white/10">
				{/* Header */}
				<div className="text-center space-y-3">
					<img
						src="/images/logo.png"
						alt="Logo"
						className="mx-auto w-60 h-auto"
					/>
				</div>

				{/* Form */}
				<form className="space-y-5" onSubmit={handleSubmit}>
					{/* Error Alert */}
					{error && (
						<div className="flex gap-3 rounded-lg bg-red-500/10 border border-red-500/30 p-4">
							<AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
							<div className="text-sm font-medium text-red-300">{error}</div>
						</div>
					)}

					{/* Email Input */}
					<div className="group">
						<label
							htmlFor="email"
							className="block text-sm font-medium text-white/90 mb-2"
						>
							Email
						</label>
						<div className="relative">
							<Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70 group-focus-within:text-blue-400 transition" />
							<input
								id="email"
								name="email"
								type="email"
								autoComplete="email"
								className={`w-full pl-10 pr-4 py-3 bg-black/50 rounded-lg text-white placeholder-white/60 transition duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed ${
									errors.email && touched.email
										? "border border-red-500 focus:border-red-600 focus:ring-red-500/20"
										: "border border-white/20 focus:border-blue-500 focus:ring-blue-500/20 hover:border-white/40"
								}`}
								placeholder="nama@example.com"
								value={email}
								onChange={handleChange}
								onBlur={handleBlur}
								disabled={isLoading}
							/>
						</div>
						{errors.email && touched.email && (
							<p className="mt-1 text-xs text-red-400">{errors.email}</p>
						)}
					</div>

					{/* Password Input */}
					<div className="group">
						<label
							htmlFor="password"
							className="block text-sm font-medium text-white/90 mb-2"
						>
							Password
						</label>
						<div className="relative">
							<Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70 group-focus-within:text-blue-400 transition" />
							<input
								id="password"
								name="password"
								type="password"
								autoComplete="current-password"
								className={`w-full pl-10 pr-4 py-3 bg-black/50 rounded-lg text-white placeholder-white/60 transition duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed ${
									errors.password && touched.password
										? "border border-red-500 focus:border-red-600 focus:ring-red-500/20"
										: "border border-white/20 focus:border-blue-500 focus:ring-blue-500/20 hover:border-white/40"
								}`}
								placeholder="••••••••"
								value={password}
								onChange={handleChange}
								onBlur={handleBlur}
								disabled={isLoading}
							/>
						</div>
						{errors.password && touched.password && (
							<p className="mt-1 text-xs text-red-400">{errors.password}</p>
						)}
					</div>

					{/* Submit Button */}
					<button
						type="submit"
						disabled={isLoading}
						className="w-full py-3 px-4 bg-black text-white font-semibold rounded-lg transition duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg disabled:hover:shadow-blue-500/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
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

				{/* Footer */}
				<div className="space-y-3 text-center">
					<p className="text-xs text-white/50">
						This site is protected by reCAPTCHA and the Google{" "}
						<a
							href="https://policies.google.com/privacy"
							className="underline hover:text-white/70 transition"
						>
							Privacy Policy
						</a>{" "}
						and{" "}
						<a
							href="https://policies.google.com/terms"
							className="underline hover:text-white/70 transition"
						>
							Terms of Service
						</a>{" "}
						apply.
					</p>
					<p className="text-xs text-white/40">
						© 2026 Takshaka. Semua hak terlindungi.
					</p>
				</div>
			</div>
		</div>
	);
}
