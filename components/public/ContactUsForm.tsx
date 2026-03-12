"use client";

import { useState } from "react";

export function ContactUsForm() {
	const [formData, setFormData] = useState({
		fullName: "",
		email: "",
		phoneNumber: "",
		country: "",
		subject: "",
		message: "",
	});

	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			console.log("submit", formData);

			await new Promise((r) => setTimeout(r, 1000));

			setSuccess(true);

			setFormData({
				fullName: "",
				email: "",
				phoneNumber: "",
				country: "",
				subject: "",
				message: "",
			});

			setTimeout(() => setSuccess(false), 3000);
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-8">
			{/* name + email */}
			<div className="grid grid-cols-2 gap-6">
				<FloatingInput
					label="Full Name"
					name="fullName"
					value={formData.fullName}
					onChange={handleChange}
				/>

				<FloatingInput
					label="Email"
					name="email"
					type="email"
					value={formData.email}
					onChange={handleChange}
				/>
			</div>

			{/* phone + country */}
			<div className="grid grid-cols-2 gap-6">
				<FloatingInput
					label="Phone Number"
					name="phoneNumber"
					type="tel"
					value={formData.phoneNumber}
					onChange={handleChange}
				/>

				<FloatingInput
					label="Country"
					name="country"
					value={formData.country}
					onChange={handleChange}
				/>
			</div>

			<FloatingInput
				label="Subject"
				name="subject"
				value={formData.subject}
				onChange={handleChange}
			/>

			<FloatingTextarea
				label="Message"
				name="message"
				value={formData.message}
				onChange={handleChange}
			/>

			{success && (
				<div className="p-4 text-green-700 border border-green-200 bg-green-50">
					Message sent successfully!
				</div>
			)}

			<div className="flex justify-end">
				<button
					type="submit"
					disabled={loading}
					className="px-8 py-3 border border-gray-800 font-semibold uppercase tracking-wider hover:bg-gray-800 hover:text-white transition disabled:opacity-50"
				>
					{loading ? "Submitting..." : "Submit"}
				</button>
			</div>
		</form>
	);
}

function FloatingInput({
	label,
	name,
	value,
	onChange,
	type = "text",
}: {
	label: string;
	name: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	type?: string;
}) {
	return (
		<div className="relative">
			<input
				type={type}
				name={name}
				value={value}
				onChange={onChange}
				placeholder=" "
				className="peer w-full border-b border-gray-300 bg-transparent py-3 focus:outline-none focus:border-gray-700"
			/>

			<label
				className="
				absolute left-0 top-3 text-gray-500 text-sm uppercase tracking-wider
				transition-all
				peer-focus:-top-2 peer-focus:text-xs peer-focus:text-gray-700
				peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm
				peer-placeholder-shown:text-gray-500
				"
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
}: {
	label: string;
	name: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) {
	return (
		<div className="relative">
			<textarea
				name={name}
				value={value}
				onChange={onChange}
				placeholder=" "
				rows={5}
				className="peer w-full border-b border-gray-300 bg-transparent py-3 resize-none focus:outline-none focus:border-gray-700"
			/>

			<label
				className="
				absolute left-0 top-3 text-gray-500 text-sm uppercase tracking-wider
				transition-all
				peer-focus:-top-2 peer-focus:text-xs peer-focus:text-gray-700
				peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm
				peer-placeholder-shown:text-gray-500
				"
			>
				{label}
			</label>
		</div>
	);
}
