"use client";

import { useState, useMemo } from "react";
import {
	Save,
	Loader,
	AlertCircle,
	ChevronDown,
	ChevronUp,
	Upload,
	Plus,
	Trash2,
} from "lucide-react";
import { pageSectionsConfig } from "@/lib/page-sections-config";

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

interface FormField {
	type: string;
	label: string;
	target?: string;
	multiline?: boolean;
	fields?: FormField[];
	tabFields?: FormField[];
}

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
	const [imagePreviews, setImagePreviews] = useState<Record<string, string>>(
		{},
	);

	const config = useMemo(() => {
		const configMap = pageSectionsConfig as Record<string, any>;
		return configMap[section.pageSlug as keyof typeof pageSectionsConfig] || {};
	}, [section.pageSlug]);

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
		itemIndex: number,
		fieldTarget: string,
		value: any,
	) => {
		setData((prev) => {
			const updated = { ...prev };
			const section = updated[sectionKey] || {};

			if (Array.isArray(section[itemKey])) {
				section[itemKey] = section[itemKey].map((item, idx) => {
					if (idx === itemIndex && typeof item === "object") {
						return { ...item, [fieldTarget]: value };
					}
					return item;
				});
			}

			updated[sectionKey] = section;
			return updated;
		});
	};

	const handleAddArrayItem = (
		sectionKey: string,
		fieldKey: string,
		templateFields: FormField[],
	) => {
		setData((prev) => {
			const updated = { ...prev };
			const section = updated[sectionKey] || {};
			const array = Array.isArray(section[fieldKey]) ? section[fieldKey] : [];

			const newItem: Record<string, any> = {};
			templateFields.forEach((field) => {
				if (field.target) {
					newItem[field.target] =
						field.type === "string"
							? ""
							: field.type === "image" || field.type === "video"
								? ""
								: [];
				}
			});

			array.push(newItem);
			section[fieldKey] = array;
			updated[sectionKey] = section;
			return updated;
		});
	};

	const handleRemoveArrayItem = (
		sectionKey: string,
		fieldKey: string,
		itemIndex: number,
	) => {
		setData((prev) => {
			const updated = { ...prev };
			const section = updated[sectionKey] || {};

			if (Array.isArray(section[fieldKey])) {
				section[fieldKey] = section[fieldKey].filter(
					(_, idx) => idx !== itemIndex,
				);
			}

			updated[sectionKey] = section;
			return updated;
		});
	};

	const handleFileUpload = async (
		e: React.ChangeEvent<HTMLInputElement>,
		sectionKey: string,
		fieldKey: string,
		itemIndex?: number,
		fieldTarget?: string,
	) => {
		const file = e.target.files?.[0];
		if (!file) return;

		try {
			// Show preview
			const reader = new FileReader();
			const previewKey = `${sectionKey}-${fieldKey}-${itemIndex ?? 0}`;
			reader.onload = (event) => {
				setImagePreviews((prev) => ({
					...prev,
					[previewKey]: event.target?.result as string,
				}));
			};
			reader.readAsDataURL(file);

			setUploading(true);
			const formData = new FormData();
			formData.append("file", file);

			const response = await fetch("/api/upload", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				throw new Error("Upload failed");
			}

			const { url } = await response.json();

			if (itemIndex !== undefined && fieldTarget) {
				handleNestedFieldChange(
					sectionKey,
					fieldKey,
					itemIndex,
					fieldTarget,
					url,
				);
			} else {
				handleFieldChange(sectionKey, fieldTarget || fieldKey, url);
			}

			// Clear preview after successful upload
			setImagePreviews((prev) => {
				const updated = { ...prev };
				delete updated[previewKey];
				return updated;
			});
		} catch (err) {
			console.error("Error uploading file:", err);
			setError("Failed to upload file. Please try again.");
		} finally {
			setUploading(false);
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

	const handleSave = async () => {
		try {
			setSaving(true);
			setError(null);

			const response = await fetch(`/api/page-sections/${section.id}`, {
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

	const renderField = (
		sectionKey: string,
		fieldKey: string,
		fieldConfig: FormField,
		value: any,
		itemIndex?: number,
	): React.ReactNode => {
		if (fieldConfig.type === "string") {
			return fieldConfig.multiline ? (
				<textarea
					value={value || ""}
					onChange={(e) =>
						itemIndex !== undefined
							? handleNestedFieldChange(
									sectionKey,
									fieldKey,
									itemIndex,
									fieldConfig.target!,
									e.target.value,
								)
							: handleFieldChange(
									sectionKey,
									fieldConfig.target || fieldKey,
									e.target.value,
								)
					}
					className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-[#525252] rounded bg-white dark:bg-[#222222] text-gray-900 dark:text-[#e5e5e5] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					rows={3}
				/>
			) : (
				<input
					type="text"
					value={value || ""}
					onChange={(e) =>
						itemIndex !== undefined
							? handleNestedFieldChange(
									sectionKey,
									fieldKey,
									itemIndex,
									fieldConfig.target!,
									e.target.value,
								)
							: handleFieldChange(
									sectionKey,
									fieldConfig.target || fieldKey,
									e.target.value,
								)
					}
					className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-[#525252] rounded bg-white dark:bg-[#222222] text-gray-900 dark:text-[#e5e5e5] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
				/>
			);
		}

		if (fieldConfig.type === "image") {
			const previewKey = `${sectionKey}-${fieldKey}-${itemIndex ?? 0}`;
			const preview = imagePreviews[previewKey];

			return (
				<div className="space-y-1.5">
					{(preview || isImageUrl(value)) && (
						<div className="relative w-full h-24 bg-gray-100 dark:bg-[#222222] rounded overflow-hidden border border-gray-300 dark:border-[#525252]">
							<img
								src={preview || value}
								alt={fieldConfig.label}
								className="w-full h-full object-cover"
								onError={(e) => {
									(e.target as HTMLImageElement).src =
										"/images/placeholder.png";
								}}
							/>
							{preview && (
								<div className="absolute inset-0 bg-green-500/20 border-2 border-green-500 flex items-center justify-center">
									<span className="text-white text-xs font-medium">
										Preview
									</span>
								</div>
							)}
						</div>
					)}
					<div className="flex gap-2">
						<input
							type="text"
							value={value || ""}
							onChange={(e) =>
								itemIndex !== undefined
									? handleNestedFieldChange(
											sectionKey,
											fieldKey,
											itemIndex,
											fieldConfig.target!,
											e.target.value,
										)
									: handleFieldChange(
											sectionKey,
											fieldConfig.target || fieldKey,
											e.target.value,
										)
							}
							className="flex-1 px-2 py-1.5 text-sm border border-gray-300 dark:border-[#525252] rounded bg-white dark:bg-[#222222] text-gray-900 dark:text-[#e5e5e5] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							placeholder="URL atau upload"
						/>
						<label className="flex items-center justify-center gap-1 px-2.5 py-1.5 border border-dashed border-gray-300 dark:border-[#525252] rounded bg-gray-50 dark:bg-[#222222] cursor-pointer hover:bg-gray-100 dark:hover:bg-[#323232] transition-colors whitespace-nowrap">
							<Upload size={14} className="text-gray-600 dark:text-[#929292]" />
							<span className="text-xs text-gray-600 dark:text-[#929292]">
								{uploading ? "..." : "Upload"}
							</span>
							<input
								type="file"
								accept="image/*"
								onChange={(e) =>
									itemIndex !== undefined
										? handleFileUpload(
												e,
												sectionKey,
												fieldKey,
												itemIndex,
												fieldConfig.target,
											)
										: handleFileUpload(e, sectionKey, fieldKey)
								}
								className="hidden"
							/>
						</label>
					</div>
				</div>
			);
		}

		if (fieldConfig.type === "video") {
			return (
				<div className="space-y-1.5">
					{isVideoUrl(value) && (
						<div className="relative w-full h-24 bg-gray-100 dark:bg-[#222222] rounded overflow-hidden border border-gray-300 dark:border-[#525252]">
							<video
								width="100%"
								height="100%"
								controls
								className="w-full h-full object-cover"
							>
								<source src={value} type="video/mp4" />
							</video>
						</div>
					)}
					<div className="flex gap-2">
						<input
							type="text"
							value={value || ""}
							onChange={(e) =>
								itemIndex !== undefined
									? handleNestedFieldChange(
											sectionKey,
											fieldKey,
											itemIndex,
											fieldConfig.target!,
											e.target.value,
										)
									: handleFieldChange(
											sectionKey,
											fieldConfig.target || fieldKey,
											e.target.value,
										)
							}
							className="flex-1 px-2 py-1.5 text-sm border border-gray-300 dark:border-[#525252] rounded bg-white dark:bg-[#222222] text-gray-900 dark:text-[#e5e5e5] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							placeholder="URL atau upload"
						/>
						<label className="flex items-center justify-center gap-1 px-2.5 py-1.5 border border-dashed border-gray-300 dark:border-[#525252] rounded bg-gray-50 dark:bg-[#222222] cursor-pointer hover:bg-gray-100 dark:hover:bg-[#323232] transition-colors whitespace-nowrap">
							<Upload size={14} className="text-gray-600 dark:text-[#929292]" />
							<span className="text-xs text-gray-600 dark:text-[#929292]">
								{uploading ? "..." : "Upload"}
							</span>
							<input
								type="file"
								accept="video/*"
								onChange={(e) =>
									itemIndex !== undefined
										? handleFileUpload(
												e,
												sectionKey,
												fieldKey,
												itemIndex,
												fieldConfig.target,
											)
										: handleFileUpload(e, sectionKey, fieldKey)
								}
								className="hidden"
							/>
						</label>
					</div>
				</div>
			);
		}

		return null;
	};

	const renderArrayItems = (
		sectionKey: string,
		fieldKey: string,
		arrayValue: any[],
		fieldConfig: FormField,
	): React.ReactNode => {
		return (
			<div className="space-y-1.5">
				{arrayValue.map((item, idx) => (
					<div
						key={idx}
						className="bg-gray-50 dark:bg-[#222222] p-3 rounded border border-gray-200 dark:border-[#424242]"
					>
						<div className="flex items-center justify-between mb-2">
							<span className="text-xs font-medium text-gray-700 dark:text-[#929292]">
								Item {idx + 1}
							</span>
							<button
								onClick={() => handleRemoveArrayItem(sectionKey, fieldKey, idx)}
								className="p-1 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
								title="Delete item"
							>
								<Trash2 size={14} />
							</button>
						</div>

						<div className="space-y-2">
							{fieldConfig.fields?.map((field) => (
								<div key={field.target}>
									<label className="block text-xs font-medium text-gray-700 dark:text-[#929292] mb-0.5">
										{field.label}
									</label>
									{renderField(
										sectionKey,
										fieldKey,
										field,
										item[field.target!],
										idx,
									)}
								</div>
							))}
						</div>
					</div>
				))}

				<button
					onClick={() =>
						handleAddArrayItem(sectionKey, fieldKey, fieldConfig.fields || [])
					}
					className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm border border-dashed border-gray-300 dark:border-[#525252] rounded bg-gray-50 dark:bg-[#222222] text-gray-600 dark:text-[#929292] hover:bg-gray-100 dark:hover:bg-[#323232] transition-colors"
				>
					<Plus size={14} />
					Add {fieldConfig.label}
				</button>
			</div>
		);
	};

	return (
		<div className="space-y-2">
			{error && (
				<div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-2.5 flex items-start gap-2">
					<AlertCircle
						className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
						size={16}
					/>
					<div>
						<p className="text-red-900 dark:text-red-200 font-medium text-sm">
							Error
						</p>
						<p className="text-red-800 dark:text-red-300 text-xs">{error}</p>
					</div>
				</div>
			)}

			{success && (
				<div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded p-2.5">
					<p className="text-green-900 dark:text-green-200 font-medium text-sm">
						✓ Saved
					</p>
				</div>
			)}

			{/* Sections */}
			<div className="space-y-2">
				{Object.entries(config).map(
					([sectionKey, sectionFields]: [string, any]) => (
						<div
							key={sectionKey}
							className="bg-white dark:bg-[#323232] border border-gray-200 dark:border-[#424242] rounded overflow-hidden"
						>
							<button
								onClick={() => toggleExpanded(sectionKey)}
								className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50 dark:hover:bg-[#424242] transition-colors"
							>
								<h3 className="font-medium text-sm text-gray-900 dark:text-[#e5e5e5]">
									{sectionKey}
								</h3>
								{expanded[sectionKey] ? (
									<ChevronUp
										size={16}
										className="text-gray-400 dark:text-[#828282]"
									/>
								) : (
									<ChevronDown
										size={16}
										className="text-gray-400 dark:text-[#828282]"
									/>
								)}
							</button>

							{expanded[sectionKey] && (
								<div className="border-t border-gray-200 dark:border-[#424242] p-3 bg-gray-50 dark:bg-[#222222] space-y-2.5">
									{Array.isArray(sectionFields) &&
										sectionFields.map(
											(field: FormField, fieldIndex: number) => {
												const sectionData = data[sectionKey] || {};
												const fieldValue = sectionData[field.target || ""];

												return (
													<div key={`${sectionKey}-${fieldIndex}`}>
														<label className="block text-xs font-medium text-gray-700 dark:text-[#929292] mb-1">
															{field.label}
														</label>

														{field.type === "arrayItems" &&
															renderArrayItems(
																sectionKey,
																field.target!,
																Array.isArray(fieldValue) ? fieldValue : [],
																field,
															)}

														{field.type !== "arrayItems" &&
															field.type !== "tabs" &&
															renderField(
																sectionKey,
																field.target || "",
																field,
																fieldValue,
															)}
													</div>
												);
											},
										)}
								</div>
							)}
						</div>
					),
				)}
			</div>

			{/* Save Button */}
			<div className="flex justify-end pt-2 border-t border-gray-200 dark:border-[#424242]">
				<button
					onClick={handleSave}
					disabled={saving}
					className="flex items-center gap-1.5 px-4 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
				>
					{saving ? (
						<Loader size={16} className="animate-spin" />
					) : (
						<Save size={16} />
					)}
					Save
				</button>
			</div>
		</div>
	);
}
