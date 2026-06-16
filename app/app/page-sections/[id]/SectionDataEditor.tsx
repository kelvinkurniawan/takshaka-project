"use client";
import { apiFetch } from "@/lib/api-fetch";

import { useState } from "react";
import {
	Save,
	Loader,
	AlertCircle,
	ChevronDown,
	ChevronUp,
	Upload,
} from "lucide-react";

interface PageSection {
	id: number;
	pageName: string;
	pageSlug: string;
	pageData: string;
	created_by: number;
	created_at: string;
	updated_at: string;
}

interface SectionDataEditorProps {
	section: PageSection;
	onSave: () => Promise<void>;
}

type EditingState = {
	[key: string]: {
		[key: string]: any;
	};
};

export default function SectionDataEditor({
	section,
	onSave,
}: SectionDataEditorProps) {
	const [data, setData] = useState<Record<string, any>>(
		JSON.parse(section.pageData),
	);
	const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
	const [saving, setSaving] = useState(false);
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	const toggleExpanded = (key: string) => {
		setExpanded((prev) => ({
			...prev,
			[key]: !prev[key],
		}));
	};

	const handleFieldChange = (
		sectionKey: string,
		fieldKey: string,
		value: any,
	) => {
		setData((prev) => ({
			...prev,
			[sectionKey]: {
				...(prev[sectionKey] || {}),
				[fieldKey]: value,
			},
		}));
	};

	const handleNestedFieldChange = (
		sectionKey: string,
		itemKey: string,
		fieldKey: string,
		value: any,
	) => {
		setData((prev) => {
			const updated = { ...prev };
			const section = updated[sectionKey] || {};

			if (Array.isArray(section[itemKey])) {
				// Handle array items
				section[itemKey] = section[itemKey].map((item, idx) => {
					if (typeof item === "object" && item !== null) {
						return { ...item, [fieldKey]: value };
					}
					return item;
				});
			} else if (typeof section[itemKey] === "object") {
				// Handle object items
				section[itemKey] = {
					...section[itemKey],
					[fieldKey]: value,
				};
			}

			updated[sectionKey] = section;
			return updated;
		});
	};

	const handleFileUpload = async (
		e: React.ChangeEvent<HTMLInputElement>,
		sectionKey: string,
		fieldKey: string,
		nestedFieldKey?: string,
	) => {
		const file = e.target.files?.[0];
		if (!file) return;

		try {
			setUploading(true);
			const formData = new FormData();
			formData.append("file", file);

			// Create abort controller for timeout
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minutes

			const response = await apiFetch("/api/upload", {
				method: "POST",
				body: formData,
				signal: controller.signal,
			});

			clearTimeout(timeoutId);

			if (!response.ok) {
				throw new Error("Upload failed");
			}

			const { url } = await response.json();

			if (nestedFieldKey) {
				handleNestedFieldChange(sectionKey, fieldKey, nestedFieldKey, url);
			} else {
				handleFieldChange(sectionKey, fieldKey, url);
			}
		} catch (err) {
			console.error("Error uploading file:", err);
			if (err instanceof Error && err.name === "AbortError") {
				setError(
					"Upload timed out. File may be too large or connection too slow. Please try again.",
				);
			} else {
				setError("Failed to upload file. Please try again.");
			}
		} finally {
			setUploading(false);
		}
	};

	const handleSave = async () => {
		try {
			setSaving(true);
			setError(null);

			const response = await apiFetch(`/api/page-sections/${section.id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					pageData: JSON.stringify(data),
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to save section");
			}

			setSuccess(true);
			await onSave();
			setTimeout(() => setSuccess(false), 3000);
		} catch (err) {
			console.error("Error saving section:", err);
			setError("Failed to save changes. Please try again.");
		} finally {
			setSaving(false);
		}
	};

	const isImageUrl = (value: string): boolean => {
		return (
			typeof value === "string" &&
			(value.includes("http") || value.startsWith("/")) &&
			/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(value)
		);
	};

	const isVideoUrl = (value: string): boolean => {
		return (
			typeof value === "string" &&
			(value.includes("http") || value.startsWith("/")) &&
			/\.(mp4|webm|ogg|mov|avi|flv|wmv|mkv|3gp|m3u8)$/i.test(value)
		);
	};

	const isMediaUrl = (value: string): boolean => {
		return isImageUrl(value) || isVideoUrl(value);
	};

	const renderField = (
		sectionKey: string,
		fieldKey: string,
		value: any,
	): React.ReactNode => {
		if (value === null || value === undefined) {
			return null;
		}

		if (typeof value === "string") {
			if (isImageUrl(value)) {
				return (
					<div className="space-y-2">
						<div className="relative w-full h-48 bg-gray-100 dark:bg-[#222222] rounded-lg overflow-hidden border border-gray-300 dark:border-[#525252]">
							<img
								src={value}
								alt={fieldKey}
								className="w-full h-full object-cover"
								onError={(e) => {
									(e.target as HTMLImageElement).src =
										"/images/placeholder.png";
								}}
							/>
						</div>
						<div className="space-y-2">
							<input
								type="text"
								value={value}
								onChange={(e) =>
									handleFieldChange(sectionKey, fieldKey, e.target.value)
								}
								className="w-full px-3 py-2 border border-gray-300 dark:border-[#525252] rounded-lg bg-white dark:bg-[#222222] text-gray-900 dark:text-[#e5e5e5] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
								placeholder="Image URL"
							/>
							<label className="flex items-center justify-center gap-2 px-3 py-2 border border-dashed border-gray-300 dark:border-[#525252] rounded-lg bg-gray-50 dark:bg-[#222222] cursor-pointer hover:bg-gray-100 dark:hover:bg-[#323232] transition-colors">
								<Upload
									size={16}
									className="text-gray-600 dark:text-[#929292]"
								/>
								<span className="text-sm text-gray-600 dark:text-[#929292]">
									{uploading ? "Uploading..." : "Upload Image"}
								</span>
								<input
									type="file"
									accept="image/*"
									onChange={(e) => handleFileUpload(e, sectionKey, fieldKey)}
									disabled={uploading}
									className="hidden"
								/>
							</label>
						</div>
					</div>
				);
			}

			if (isVideoUrl(value)) {
				return (
					<div className="space-y-2">
						<div className="relative w-full h-48 bg-gray-100 dark:bg-[#222222] rounded-lg overflow-hidden border border-gray-300 dark:border-[#525252]">
							<video
								src={value}
								controls
								className="w-full h-full"
								style={{ objectFit: "cover" }}
							>
								Your browser does not support the video tag.
							</video>
						</div>
						<div className="space-y-2">
							<input
								type="text"
								value={value}
								onChange={(e) =>
									handleFieldChange(sectionKey, fieldKey, e.target.value)
								}
								className="w-full px-3 py-2 border border-gray-300 dark:border-[#525252] rounded-lg bg-white dark:bg-[#222222] text-gray-900 dark:text-[#e5e5e5] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
								placeholder="Video URL"
							/>
							<label className="flex items-center justify-center gap-2 px-3 py-2 border border-dashed border-gray-300 dark:border-[#525252] rounded-lg bg-gray-50 dark:bg-[#222222] cursor-pointer hover:bg-gray-100 dark:hover:bg-[#323232] transition-colors">
								<Upload
									size={16}
									className="text-gray-600 dark:text-[#929292]"
								/>
								<span className="text-sm text-gray-600 dark:text-[#929292]">
									{uploading ? "Uploading..." : "Upload Video"}
								</span>
								<input
									type="file"
									accept="video/*"
									onChange={(e) => handleFileUpload(e, sectionKey, fieldKey)}
									disabled={uploading}
									className="hidden"
								/>
							</label>
						</div>
					</div>
				);
			}

			// Handle image/video combined type
			if (isImageUrl(value) || isVideoUrl(value)) {
				const isImage = isImageUrl(value);
				return (
					<div className="space-y-2">
						<div className="relative w-full h-48 bg-gray-100 dark:bg-[#222222] rounded-lg overflow-hidden border border-gray-300 dark:border-[#525252]">
							{isImage ? (
								<img
									src={value}
									alt={fieldKey}
									className="w-full h-full object-cover"
									onError={(e) => {
										(e.target as HTMLImageElement).src =
											"/images/placeholder.png";
									}}
								/>
							) : (
								<video
									src={value}
									controls
									className="w-full h-full"
									style={{ objectFit: "cover" }}
								>
									Your browser does not support the video tag.
								</video>
							)}
						</div>
						<div className="space-y-2">
							<input
								type="text"
								value={value}
								onChange={(e) =>
									handleFieldChange(sectionKey, fieldKey, e.target.value)
								}
								className="w-full px-3 py-2 border border-gray-300 dark:border-[#525252] rounded-lg bg-white dark:bg-[#222222] text-gray-900 dark:text-[#e5e5e5] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
								placeholder="Image or Video URL"
							/>
							<label className="flex items-center justify-center gap-2 px-3 py-2 border border-dashed border-gray-300 dark:border-[#525252] rounded-lg bg-gray-50 dark:bg-[#222222] cursor-pointer hover:bg-gray-100 dark:hover:bg-[#323232] transition-colors">
								<Upload
									size={16}
									className="text-gray-600 dark:text-[#929292]"
								/>
								<span className="text-sm text-gray-600 dark:text-[#929292]">
									{uploading ? "Uploading..." : "Upload Media"}
								</span>
								<input
									type="file"
									accept="image/*,video/*"
									onChange={(e) => handleFileUpload(e, sectionKey, fieldKey)}
									disabled={uploading}
									className="hidden"
								/>
							</label>
						</div>
					</div>
				);
			}

			return (
				<textarea
					value={value}
					onChange={(e) =>
						handleFieldChange(sectionKey, fieldKey, e.target.value)
					}
					className="w-full px-3 py-2 border border-gray-300 dark:border-[#525252] rounded-lg bg-white dark:bg-[#222222] text-gray-900 dark:text-[#e5e5e5] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					rows={value.length > 100 ? 4 : 2}
				/>
			);
		}

		if (typeof value === "number") {
			return (
				<input
					type="number"
					value={value}
					onChange={(e) =>
						handleFieldChange(sectionKey, fieldKey, Number(e.target.value))
					}
					className="w-full px-3 py-2 border border-gray-300 dark:border-[#525252] rounded-lg bg-white dark:bg-[#222222] text-gray-900 dark:text-[#e5e5e5] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
				/>
			);
		}

		if (typeof value === "boolean") {
			return (
				<label className="flex items-center gap-2 cursor-pointer">
					<input
						type="checkbox"
						checked={value}
						onChange={(e) =>
							handleFieldChange(sectionKey, fieldKey, e.target.checked)
						}
						className="w-4 h-4 rounded"
					/>
					<span className="text-gray-600 dark:text-[#929292]">Enabled</span>
				</label>
			);
		}

		if (Array.isArray(value)) {
			return (
				<div className="space-y-2">
					{value.map((item, idx) => (
						<div
							key={idx}
							className="bg-gray-50 dark:bg-[#222222] p-3 rounded-lg border border-gray-200 dark:border-[#424242]"
						>
							{typeof item === "object" && item !== null ? (
								<div className="space-y-2">
									{Object.entries(item).map(([key, val]) => (
										<div key={key} className="text-sm">
											<label className="block text-gray-700 dark:text-[#929292] font-medium mb-1">
												{key}
											</label>
											{isImageUrl(String(val)) ? (
												<div className="space-y-2">
													<div className="relative w-full h-32 bg-gray-100 dark:bg-[#121212] rounded border border-gray-300 dark:border-[#525252] overflow-hidden">
														<img
															src={String(val)}
															alt={key}
															className="w-full h-full object-cover"
															onError={(e) => {
																(e.target as HTMLImageElement).src =
																	"/images/placeholder.png";
															}}
														/>
													</div>
													<input
														type="text"
														value={String(val)}
														onChange={(e) =>
															handleNestedFieldChange(
																sectionKey,
																fieldKey,
																key,
																e.target.value,
															)
														}
														className="w-full px-2 py-1 border border-gray-300 dark:border-[#525252] rounded bg-white dark:bg-[#323232] text-gray-900 dark:text-[#e5e5e5] text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
														placeholder="Image URL"
													/>
													<label className="flex items-center justify-center gap-2 px-2 py-1.5 border border-dashed border-gray-300 dark:border-[#525252] rounded bg-white dark:bg-[#222222] cursor-pointer hover:bg-gray-50 dark:hover:bg-[#323232] transition-colors text-xs">
														<Upload
															size={12}
															className="text-gray-600 dark:text-[#929292]"
														/>
														<span className="text-gray-600 dark:text-[#929292]">
															{uploading ? "Uploading..." : "Change Image"}
														</span>
														<input
															type="file"
															accept="image/*"
															onChange={(e) =>
																handleFileUpload(e, sectionKey, fieldKey, key)
															}
															disabled={uploading}
															className="hidden"
														/>
													</label>
												</div>
											) : isVideoUrl(String(val)) ? (
												<div className="space-y-2">
													<div className="relative w-full h-32 bg-gray-100 dark:bg-[#121212] rounded border border-gray-300 dark:border-[#525252] overflow-hidden">
														<video
															src={String(val)}
															controls
															className="w-full h-full"
															style={{ objectFit: "cover" }}
														>
															Your browser does not support the video tag.
														</video>
													</div>
													<input
														type="text"
														value={String(val)}
														onChange={(e) =>
															handleNestedFieldChange(
																sectionKey,
																fieldKey,
																key,
																e.target.value,
															)
														}
														className="w-full px-2 py-1 border border-gray-300 dark:border-[#525252] rounded bg-white dark:bg-[#323232] text-gray-900 dark:text-[#e5e5e5] text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
														placeholder="Video URL"
													/>
													<label className="flex items-center justify-center gap-2 px-2 py-1.5 border border-dashed border-gray-300 dark:border-[#525252] rounded bg-white dark:bg-[#222222] cursor-pointer hover:bg-gray-50 dark:hover:bg-[#323232] transition-colors text-xs">
														<Upload
															size={12}
															className="text-gray-600 dark:text-[#929292]"
														/>
														<span className="text-gray-600 dark:text-[#929292]">
															{uploading ? "Uploading..." : "Change Video"}
														</span>
														<input
															type="file"
															accept="video/*"
															onChange={(e) =>
																handleFileUpload(e, sectionKey, fieldKey, key)
															}
															disabled={uploading}
															className="hidden"
														/>
													</label>
												</div>
											) : (
												<input
													type="text"
													value={String(val)}
													onChange={(e) =>
														handleNestedFieldChange(
															sectionKey,
															fieldKey,
															key,
															e.target.value,
														)
													}
													className="w-full px-2 py-1 border border-gray-300 dark:border-[#525252] rounded bg-white dark:bg-[#323232] text-gray-900 dark:text-[#e5e5e5] text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
												/>
											)}
										</div>
									))}
								</div>
							) : (
								<input
									type="text"
									value={String(item)}
									className="w-full px-2 py-1 border border-gray-300 dark:border-[#525252] rounded bg-white dark:bg-[#323232] text-gray-900 dark:text-[#e5e5e5] text-xs"
									disabled
								/>
							)}
						</div>
					))}
				</div>
			);
		}

		return null;
	};

	return (
		<div className="space-y-4">
			{error && (
				<div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
					<AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
					<div>
						<p className="text-red-900 dark:text-red-200 font-medium">Error</p>
						<p className="text-red-800 dark:text-red-300 text-sm">{error}</p>
					</div>
				</div>
			)}

			{success && (
				<div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
					<p className="text-green-900 dark:text-green-200 font-medium">
						✓ Changes saved successfully
					</p>
				</div>
			)}

			{/* Sections List */}
			<div className="space-y-3">
				{Object.entries(data).map(([sectionKey, sectionValue]) => (
					<div
						key={sectionKey}
						className="bg-white dark:bg-[#323232] border border-gray-200 dark:border-[#424242] rounded-lg overflow-hidden"
					>
						<button
							onClick={() => toggleExpanded(sectionKey)}
							className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-[#424242] transition-colors"
						>
							<div className="text-left">
								<h3 className="font-semibold text-gray-900 dark:text-[#e5e5e5]">
									{sectionKey}
								</h3>
								{typeof sectionValue === "object" && sectionValue !== null && (
									<p className="text-xs text-gray-600 dark:text-[#929292] mt-1">
										{Array.isArray(sectionValue)
											? `${sectionValue.length} items`
											: `${Object.keys(sectionValue).length} fields`}
									</p>
								)}
							</div>
							{expanded[sectionKey] ? (
								<ChevronUp className="text-gray-400 dark:text-[#828282]" />
							) : (
								<ChevronDown className="text-gray-400 dark:text-[#828282]" />
							)}
						</button>

						{expanded[sectionKey] && (
							<div className="border-t border-gray-200 dark:border-[#424242] p-4 bg-gray-50 dark:bg-[#222222] space-y-4">
								{typeof sectionValue === "object" &&
									sectionValue !== null &&
									Object.entries(sectionValue).map(([fieldKey, fieldValue]) => (
										<div key={fieldKey}>
											<label className="block text-sm font-medium text-gray-700 dark:text-[#929292] mb-2">
												{fieldKey}
											</label>
											{renderField(sectionKey, fieldKey, fieldValue)}
										</div>
									))}
							</div>
						)}
					</div>
				))}
			</div>

			{/* Save Button */}
			<div className="flex justify-end pt-4 border-t border-gray-200 dark:border-[#424242]">
				<button
					onClick={handleSave}
					disabled={saving}
					className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
				>
					{saving ? (
						<Loader size={18} className="animate-spin" />
					) : (
						<Save size={18} />
					)}
					Save All Changes
				</button>
			</div>
		</div>
	);
}
