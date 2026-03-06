"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";

export default function SecureAccessPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
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
			setError("Terjadi kesalahan. Silakan coba lagi.");
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

			<div className="relative z-10 max-w-md w-full space-y-8 px-4 sm:px-6 lg:px-8 text-white py-4 bg-white/50 backdrop-blur-md">
				{/* Header */}
				<div className="text-center space-y-3">
					<div className="flex items-center justify-center">
						<div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg shadow-blue-500/20">
							<Lock className="w-6 h-6 text-white" />
						</div>
					</div>
					<h2 className="text-5xl md:text-7xl font-bold leading-tight">
						Takshaka
					</h2>
					<p className="text-lg md:text-2xl font-light">
						Masukkan kredensial Anda untuk mengakses dashboard
					</p>
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
								required
								className="w-full pl-10 pr-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white placeholder-white/60 transition duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-white/40 disabled:opacity-50 disabled:cursor-not-allowed"
								placeholder="nama@example.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								disabled={isLoading}
							/>
						</div>
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
								required
								className="w-full pl-10 pr-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white placeholder-white/60 transition duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-white/40 disabled:opacity-50 disabled:cursor-not-allowed"
								placeholder="••••••••"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								disabled={isLoading}
							/>
						</div>
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
				<p className="text-center text-xs text-white/60">
					© 2026 Takshaka. Semua hak terlindungi.
				</p>
			</div>
		</div>
	);
}
