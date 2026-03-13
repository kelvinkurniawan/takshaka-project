"use client";

import { useState, useEffect } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

interface ValidationErrors {
	fullName?: string;
	email?: string;
	phoneNumber?: string;
	country?: string;
	subject?: string;
	message?: string;
}

export function ContactUsForm() {
	const { executeRecaptcha } = useGoogleReCaptcha();
	const [formData, setFormData] = useState({
		fullName: "",
		email: "",
		phoneNumber: "",
		country: "",
		subject: "",
		message: "",
	});

	const [errors, setErrors] = useState<ValidationErrors>({});
	const [touched, setTouched] = useState<Record<string, boolean>>({});
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState("");
	const [reCaptchaReady, setReCaptchaReady] = useState(false);

	// Check if reCAPTCHA is available
	useEffect(() => {
		if (executeRecaptcha) {
			setReCaptchaReady(true);
		}
	}, [executeRecaptcha]);

	const validateField = (name: string, value: string): string | undefined => {
		switch (name) {
			case "fullName":
				if (!value.trim()) return "Full name is required";
				if (value.trim().length < 2)
					return "Full name must be at least 2 characters";
				if (value.trim().length > 255)
					return "Full name must be less than 255 characters";
				return undefined;

			case "email":
				if (!value.trim()) return "Email is required";
				const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
				if (!emailRegex.test(value))
					return "Please enter a valid email address";
				return undefined;

			case "phoneNumber":
				if (value && value.length > 20)
					return "Phone number must be less than 20 characters";
				return undefined;

			case "country":
				if (value && value.length > 100)
					return "Country must be less than 100 characters";
				return undefined;

			case "subject":
				if (!value.trim()) return "Subject is required";
				if (value.trim().length < 3)
					return "Subject must be at least 3 characters";
				if (value.trim().length > 255)
					return "Subject must be less than 255 characters";
				return undefined;

			case "message":
				if (!value.trim()) return "Message is required";
				if (value.trim().length < 10)
					return "Message must be at least 10 characters";
				if (value.length > 5000)
					return "Message must be less than 5000 characters";
				return undefined;

			default:
				return undefined;
		}
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		// Validate on change if field has been touched
		if (touched[name]) {
			const fieldError = validateField(name, value);
			setErrors((prev) => ({
				...prev,
				[name]: fieldError,
			}));
		}
	};

	const handleBlur = (
		e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
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

		Object.keys(formData).forEach((key) => {
			const fieldError = validateField(
				key,
				formData[key as keyof typeof formData],
			);
			if (fieldError) {
				newErrors[key as keyof ValidationErrors] = fieldError;
			}
		});

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			// Validate form first
			if (!validateForm()) {
				setLoading(false);
				setError("Please fix the errors above before submitting");
				return;
			}

			if (!executeRecaptcha) {
				throw new Error(
					"reCAPTCHA is not available. Please refresh the page and try again.",
				);
			}

			if (!reCaptchaReady) {
				throw new Error(
					"reCAPTCHA is loading. Please wait a moment and try again.",
				);
			}

			// Get reCAPTCHA token
			const token = await executeRecaptcha("contact_form");

			// Submit to API with token
			const response = await fetch("/api/contact-submissions", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...formData,
					recaptchaToken: token,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Failed to submit form");
			}

			setSuccess(true);

			setFormData({
				fullName: "",
				email: "",
				phoneNumber: "",
				country: "",
				subject: "",
				message: "",
			});
			setTouched({});
			setErrors({});

			setTimeout(() => setSuccess(false), 3000);
		} catch (err) {
			console.error("Error submitting form:", err);
			setError(
				err instanceof Error
					? err.message
					: "Failed to submit. Please try again.",
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-8">
			{/* reCAPTCHA Status */}
			{!reCaptchaReady && (
				<div className="p-4 text-amber-700 border border-amber-200 bg-amber-50 rounded text-sm">
					reCAPTCHA is loading... Please wait.
				</div>
			)}

			{/* name + email */}
			<div className="grid grid-cols-2 gap-6">
				<div>
					<FloatingInput
						label="Full Name *"
						name="fullName"
						value={formData.fullName}
						onChange={handleChange}
						onBlur={handleBlur}
						disabled={loading}
						hasError={!!errors.fullName && touched.fullName}
					/>
					{errors.fullName && touched.fullName && (
						<p className="mt-1 text-xs text-red-600">{errors.fullName}</p>
					)}
				</div>

				<div>
					<FloatingInput
						label="Email *"
						name="email"
						type="email"
						value={formData.email}
						onChange={handleChange}
						onBlur={handleBlur}
						disabled={loading}
						hasError={!!errors.email && touched.email}
					/>
					{errors.email && touched.email && (
						<p className="mt-1 text-xs text-red-600">{errors.email}</p>
					)}
				</div>
			</div>

			{/* phone + country */}
			<div className="grid grid-cols-2 gap-6">
				<div>
					<FloatingInput
						label="Phone Number"
						name="phoneNumber"
						type="tel"
						value={formData.phoneNumber}
						onChange={handleChange}
						onBlur={handleBlur}
						disabled={loading}
						hasError={!!errors.phoneNumber && touched.phoneNumber}
					/>
					{errors.phoneNumber && touched.phoneNumber && (
						<p className="mt-1 text-xs text-red-600">{errors.phoneNumber}</p>
					)}
				</div>

				<div>
					<FloatingInput
						label="Country"
						name="country"
						value={formData.country}
						onChange={handleChange}
						onBlur={handleBlur}
						disabled={loading}
						hasError={!!errors.country && touched.country}
					/>
					{errors.country && touched.country && (
						<p className="mt-1 text-xs text-red-600">{errors.country}</p>
					)}
				</div>
			</div>

			<div>
				<FloatingInput
					label="Subject *"
					name="subject"
					value={formData.subject}
					onChange={handleChange}
					onBlur={handleBlur}
					disabled={loading}
					hasError={!!errors.subject && touched.subject}
				/>
				{errors.subject && touched.subject && (
					<p className="mt-1 text-xs text-red-600">{errors.subject}</p>
				)}
			</div>

			<div>
				<FloatingTextarea
					label="Message *"
					name="message"
					value={formData.message}
					onChange={handleChange}
					onBlur={handleBlur}
					disabled={loading}
					hasError={!!errors.message && touched.message}
				/>
				{errors.message && touched.message && (
					<p className="mt-1 text-xs text-red-600">{errors.message}</p>
				)}
				<p className="mt-1 text-xs text-gray-400">
					{formData.message.length} / 5000 characters
				</p>
			</div>

			{success && (
				<div className="p-4 text-green-700 border border-green-200 bg-green-50 rounded">
					✓ Message sent successfully! Thank you for contacting us.
				</div>
			)}

			{error && (
				<div className="p-4 text-red-700 border border-red-200 bg-red-50 rounded">
					{error}
				</div>
			)}

			<div className="flex justify-end pt-4">
				<button
					type="submit"
					disabled={loading || !reCaptchaReady}
					className="px-8 py-3 border border-gray-800 font-semibold uppercase tracking-wider hover:bg-gray-800 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
					title={!reCaptchaReady ? "reCAPTCHA is loading..." : ""}
				>
					{loading ? "Submitting..." : "Submit"}
				</button>
			</div>

			<p className="text-xs text-gray-400 pt-2">
				* Required fields | This site is protected by reCAPTCHA and the Google{" "}
				<a href="https://policies.google.com/privacy" className="underline">
					Privacy Policy
				</a>{" "}
				and{" "}
				<a href="https://policies.google.com/terms" className="underline">
					Terms of Service
				</a>{" "}
				apply.
			</p>
		</form>
	);
}

function FloatingInput({
	label,
	name,
	value,
	onChange,
	onBlur,
	type = "text",
	disabled = false,
	hasError = false,
}: {
	label: string;
	name: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
	type?: string;
	disabled?: boolean;
	hasError?: boolean;
}) {
	return (
		<div className="relative">
			<input
				type={type}
				name={name}
				value={value}
				onChange={onChange}
				onBlur={onBlur}
				placeholder=" "
				disabled={disabled}
				className={`peer w-full border-b bg-transparent py-3 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
					hasError
						? "border-red-500 focus:border-red-600"
						: "border-gray-300 focus:border-gray-700"
				}`}
			/>

			<label
				className={`absolute left-0 text-sm uppercase tracking-wider transition-all
						top-3

						peer-focus:-top-2 peer-focus:text-xs
						peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm
						peer-[&:not(:placeholder-shown)]:-top-2
						peer-[&:not(:placeholder-shown)]:text-xs
						${
							hasError
								? "text-red-600 peer-focus:text-red-600"
								: "text-gray-500 peer-focus:text-gray-700"
						}
					`}
			>
				{label}
			</label>
		</div>
	);
}

function FloatingTextarea({
	label,
	name,
	value,
	onChange,
	onBlur,
	disabled = false,
	hasError = false,
}: {
	label: string;
	name: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
	disabled?: boolean;
	hasError?: boolean;
}) {
	return (
		<div className="relative">
			<textarea
				name={name}
				value={value}
				onChange={onChange}
				onBlur={onBlur}
				placeholder=" "
				rows={5}
				disabled={disabled}
				className={`peer w-full border-b bg-transparent py-3 resize-none focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
					hasError
						? "border-red-500 focus:border-red-600"
						: "border-gray-300 focus:border-gray-700"
				}`}
			/>

			<label
				className={`absolute left-0 text-sm uppercase tracking-wider transition-all
						top-3

						peer-focus:-top-2 peer-focus:text-xs
						peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm
						peer-[&:not(:placeholder-shown)]:-top-2
						peer-[&:not(:placeholder-shown)]:text-xs
						${
							hasError
								? "text-red-600 peer-focus:text-red-600"
								: "text-gray-500 peer-focus:text-gray-700"
						}
					`}
			>
				{label}
			</label>
		</div>
	);
}
