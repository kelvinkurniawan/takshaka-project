"use client";
import { apiFetch } from "@/lib/api-fetch";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Check, AlertCircle } from "lucide-react";

interface UserProfile {
	id: number;
	name: string;
	email: string;
	role: string;
	createdAt: string;
}

type Tab = "profile" | "password";

export default function ProfilePage() {
	const router = useRouter();
	const [user, setUser] = useState<UserProfile | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [activeTab, setActiveTab] = useState<Tab>("profile");

	// Profile form states
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

	// Password form states
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isChangingPassword, setIsChangingPassword] = useState(false);

	// Fetch user profile
	useEffect(() => {
		const fetchProfile = async () => {
			try {
				setIsLoading(true);
				const response = await apiFetch("/api/app/profile");

				if (!response.ok) {
					if (response.status === 401) {
						router.push("/secure-access");
						return;
					}
					throw new Error("Failed to fetch profile");
				}

				const data = await response.json();
				setUser(data);
				setName(data.name);
				setEmail(data.email);
			} catch (err) {
				setError(err instanceof Error ? err.message : "Failed to load profile");
			} finally {
				setIsLoading(false);
			}
		};

		fetchProfile();
	}, [router]);

	const handleUpdateProfile = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setSuccess("");

		try {
			setIsUpdatingProfile(true);

			const response = await apiFetch("/api/app/profile", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name, email }),
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || "Failed to update profile");
			}

			const updatedUser = await response.json();
			setUser(updatedUser);
			setSuccess("Profile updated successfully");

			setTimeout(() => setSuccess(""), 3000);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to update profile");
		} finally {
			setIsUpdatingProfile(false);
		}
	};

	const handleChangePassword = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setSuccess("");

		if (newPassword !== confirmPassword) {
			setError("New password and confirm password do not match");
			return;
		}

		try {
			setIsChangingPassword(true);

			const response = await apiFetch("/api/app/profile/change-password", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					currentPassword,
					newPassword,
					confirmPassword,
				}),
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || "Failed to change password");
			}

			setSuccess("Password changed successfully");
			setCurrentPassword("");
			setNewPassword("");
			setConfirmPassword("");

			setTimeout(() => setSuccess(""), 3000);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to change password",
			);
		} finally {
			setIsChangingPassword(false);
		}
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
			</div>
		);
	}

	if (!user) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<p className="text-red-500">Failed to load profile</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
					Profile Settings
				</h1>
				<p className="text-gray-600 dark:text-gray-400 mt-2">
					Manage your account settings and preferences
				</p>
			</div>

			{/* Alert Messages */}
			{error && (
				<div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
					<AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
					<p className="text-red-800 dark:text-red-300">{error}</p>
				</div>
			)}

			{success && (
				<div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-start gap-3">
					<Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
					<p className="text-green-800 dark:text-green-300">{success}</p>
				</div>
			)}

			{/* Tabs */}
			<div className="border-b border-gray-200 dark:border-gray-700">
				<div className="flex space-x-8">
					<button
						onClick={() => setActiveTab("profile")}
						className={`px-1 py-4 border-b-2 font-medium text-sm transition-colors ${
							activeTab === "profile"
								? "border-blue-500 text-blue-600 dark:text-blue-400"
								: "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
						}`}
					>
						Profile Information
					</button>
					<button
						onClick={() => setActiveTab("password")}
						className={`px-1 py-4 border-b-2 font-medium text-sm transition-colors ${
							activeTab === "password"
								? "border-blue-500 text-blue-600 dark:text-blue-400"
								: "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
						}`}
					>
						Change Password
					</button>
				</div>
			</div>

			{/* Tab Content */}
			{activeTab === "profile" && (
				<div className="bg-white dark:bg-[#323232] rounded-lg border border-gray-200 dark:border-gray-700 p-6">
					<form onSubmit={handleUpdateProfile} className="space-y-6 max-w-2xl">
						{/* Name */}
						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								Full Name
							</label>
							<input
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#225] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
								required
							/>
						</div>

						{/* Email */}
						<div>
							<label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								<Mail size={16} />
								Email Address
							</label>
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#225] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
								required
							/>
						</div>

						{/* Role (Read-only) */}
						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								Role
							</label>
							<div className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-[#225] text-gray-900 dark:text-white capitalize">
								{user.role}
							</div>
						</div>

						{/* Created At (Read-only) */}
						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								Member Since
							</label>
							<div className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-[#225] text-gray-900 dark:text-white">
								{new Date(user.createdAt).toLocaleDateString("en-US", {
									year: "numeric",
									month: "long",
									day: "numeric",
								})}
							</div>
						</div>

						{/* Submit Button */}
						<button
							type="submit"
							disabled={isUpdatingProfile}
							className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
						>
							{isUpdatingProfile ? "Updating..." : "Update Profile"}
						</button>
					</form>
				</div>
			)}

			{activeTab === "password" && (
				<div className="bg-white dark:bg-[#323232] rounded-lg border border-gray-200 dark:border-gray-700 p-6">
					<form onSubmit={handleChangePassword} className="space-y-6 max-w-2xl">
						<p className="text-sm text-gray-600 dark:text-gray-400">
							Password must be at least 8 characters and contain at least one
							uppercase letter and one number.
						</p>

						{/* Current Password */}
						<div>
							<label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								<Lock size={16} />
								Current Password
							</label>
							<input
								type="password"
								value={currentPassword}
								onChange={(e) => setCurrentPassword(e.target.value)}
								className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#225] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
								required
							/>
						</div>

						{/* New Password */}
						<div>
							<label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								<Lock size={16} />
								New Password
							</label>
							<input
								type="password"
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
								className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#225] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
								required
							/>
						</div>

						{/* Confirm Password */}
						<div>
							<label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								<Lock size={16} />
								Confirm Password
							</label>
							<input
								type="password"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#225] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
								required
							/>
						</div>

						{/* Submit Button */}
						<button
							type="submit"
							disabled={isChangingPassword}
							className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
						>
							{isChangingPassword ? "Changing..." : "Change Password"}
						</button>
					</form>
				</div>
			)}
		</div>
	);
}
