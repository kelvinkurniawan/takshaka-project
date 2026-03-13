"use client";

import { useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

interface CommentFormProps {
	contentId: number;
	parentCommentId?: number;
	isReply?: boolean;
	onSuccess?: () => void;
}

export default function CommentForm({
	contentId,
	parentCommentId,
	isReply = false,
	onSuccess,
}: CommentFormProps) {
	const { executeRecaptcha } = useGoogleReCaptcha();
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState<{
		type: "success" | "error";
		text: string;
	} | null>(null);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		content: "",
		honeypot: "",
	});

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setMessage(null);

		try {
			// Check honeypot
			if (formData.honeypot) {
				setMessage({
					type: "error",
					text: "Invalid submission",
				});
				setLoading(false);
				return;
			}

			if (!executeRecaptcha) {
				throw new Error("reCAPTCHA not available");
			}

			// Get reCAPTCHA token
			const token = await executeRecaptcha("comment_form");

			const submissionTime = Date.now();
			const endpoint =
				isReply && parentCommentId
					? `/api/comments/${parentCommentId}`
					: "/api/comments";

			const response = await fetch(endpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...(isReply ? {} : { contentId }),
					...formData,
					submissionTime,
					honeypot: formData.honeypot,
					recaptchaToken: token,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				setMessage({
					type: "error",
					text: data.error || "Failed to submit comment",
				});
			} else {
				setMessage({
					type: "success",
					text: data.message,
				});
				setFormData({ name: "", email: "", content: "", honeypot: "" });
				if (onSuccess) {
					setTimeout(onSuccess, 1500);
				}
			}
		} catch (error) {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			console.error(error);
			setMessage({
				type: "error",
				text: "An error occurred. Please try again.",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			{/* Honeypot field - hidden from real users */}
			<input
				type="text"
				name="honeypot"
				value={formData.honeypot}
				onChange={handleChange}
				style={{ display: "none" }}
				tabIndex={-1}
				autoComplete="off"
			/>

			{/* Message */}
			{message && (
				<div
					className={`p-4 rounded-lg ${
						message.type === "success"
							? "bg-green-50 text-green-800 border border-green-200"
							: "bg-red-50 text-red-800 border border-red-200"
					}`}
				>
					{message.text}
				</div>
			)}

			{/* Name */}
			<div>
				<label
					htmlFor={`name-${parentCommentId}`}
					className="block text-sm font-medium mb-2"
				>
					Name
				</label>
				<input
					id={`name-${parentCommentId}`}
					type="text"
					name="name"
					value={formData.name}
					onChange={handleChange}
					placeholder="Your Name"
					required
					disabled={loading}
					className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
				/>
			</div>

			{/* Email */}
			<div>
				<label
					htmlFor={`email-${parentCommentId}`}
					className="block text-sm font-medium mb-2"
				>
					Email
				</label>
				<input
					id={`email-${parentCommentId}`}
					type="email"
					name="email"
					value={formData.email}
					onChange={handleChange}
					placeholder="email@example.com"
					required
					disabled={loading}
					className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
				/>
			</div>

			{/* Content */}
			<div>
				<label
					htmlFor={`content-${parentCommentId}`}
					className="block text-sm font-medium mb-2"
				>
					{isReply ? "Reply" : "Comment"}
				</label>
				<textarea
					id={`content-${parentCommentId}`}
					name="content"
					value={formData.content}
					onChange={handleChange}
					placeholder={
						isReply ? "Write your reply..." : "Write your comment..."
					}
					required
					disabled={loading}
					rows={4}
					className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 resize-none"
				/>
				<p className="text-xs text-gray-500 mt-2">
					{formData.content.length} / 5000 characters
				</p>
			</div>

			{/* Submit Button */}
			<button
				type="submit"
				disabled={
					loading || !formData.name || !formData.email || !formData.content
				}
				className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:bg-gray-300 transition"
			>
				{loading
					? "Submitting..."
					: isReply
						? "Submit Reply"
						: "Submit Comment"}
			</button>
		</form>
	);
}
