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
	Search,
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

// Utility function to format section titles (camelCase/snake_case to Title Case)
const formatSectionTitle = (str: string): string => {
	return str
		.replace(/([a-z])([A-Z])/g, "$1 $2") // camelCase to spaces
		.replace(/_/g, " ") // snake_case to spaces
		.replace(/\b\w/g, (char) => char.toUpperCase()) // Title Case
		.trim();
};

export default function SectionDataEditor({
	section,
	onSave,
}: SectionDataEditorProps) {
	const [data, setData] = useState<Record<string, any>>(
		JSON.parse(section.pageData),
	);
	const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
	const [searchQuery, setSearchQuery] = useState("");
	const [saving, setSaving] = useState(false);
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const [imagePreviews, setImagePreviews] = useState<Record<string, string>>(
		{},
	);
	const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

	const config = useMemo(() => {
		const configMap = pageSectionsConfig as Record<string, any>;
		console.log("Loaded config for page sections:", Object.keys(configMap));
		return configMap[section.pageSlug as keyof typeof pageSectionsConfig] || {};
	}, [section.pageSlug]);

	const filteredSections = useMemo(() => {
		const filteredConfig: Record<string, any> = {};
		Object.entries(config).forEach(([key, value]) => {
			if (
				searchQuery === "" ||
				key.toLowerCase().includes(searchQuery.toLowerCase()) ||
				formatSectionTitle(key)
					.toLowerCase()
					.includes(searchQuery.toLowerCase())
			) {
				filteredConfig[key] = value;
			}
		});
		return filteredConfig;
	}, [config, searchQuery]);

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
		fieldConfig: FormField,
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
			formData.append("type", fieldConfig.type);

			const response = await fetch("/api/upload", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Upload failed");
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

			// Clear error state for this key
			setImageErrors((prev) => {
				const updated = { ...prev };
				delete updated[previewKey];
				return updated;
			});
		} catch (err) {
			console.error("Error uploading file:", err);
			setError(
				err instanceof Error
					? err.message
					: "Failed to upload file. Please try again.",
			);
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
			return (
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
					className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-[#525252] rounded-md bg-white dark:bg-[#222222] text-gray-900 dark:text-[#e5e5e5] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
					rows={fieldConfig.multiline ? 4 : 2}
				/>
			);
		}

		if (fieldConfig.type === "image") {
			const previewKey = `${sectionKey}-${fieldKey}-${itemIndex ?? 0}`;
			const preview = imagePreviews[previewKey];
			const hasValue = preview || (value && typeof value === "string");
			const hasError = imageErrors[previewKey];

			return (
				<div className="space-y-2">
					{hasValue && !hasError && (
						<div className="relative w-full bg-gray-100 dark:bg-[#222222] rounded-md overflow-hidden border border-gray-300 dark:border-[#525252]">
							<div className="relative w-full pb-[66.666%]">
								<img
									src={preview || value}
									alt={fieldConfig.label}
									className="absolute inset-0 w-full h-full object-cover"
									onError={(e) => {
										const key = `${sectionKey}-${fieldKey}-${itemIndex ?? 0}`;
										setImageErrors((prev) => ({
											...prev,
											[key]: true,
										}));
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
						</div>
					)}
					{hasError && (
						<div className="w-full bg-red-50 dark:bg-red-900/20 rounded-md overflow-hidden border border-red-200 dark:border-red-800 p-4 flex items-center justify-center min-h-[150px]">
							<div className="text-center">
								<p className="text-red-600 dark:text-red-400 text-sm font-medium mb-1">
									Failed to load image
								</p>
								<p className="text-red-600 dark:text-red-400 text-xs break-all">
									{value}
								</p>
							</div>
						</div>
					)}
					<div className="flex gap-2">
						<input
							type="text"
							value={value || ""}
							onChange={(e) => {
								const newValue = e.target.value;
								if (itemIndex !== undefined) {
									handleNestedFieldChange(
										sectionKey,
										fieldKey,
										itemIndex,
										fieldConfig.target!,
										newValue,
									);
								} else {
									handleFieldChange(
										sectionKey,
										fieldConfig.target || fieldKey,
										newValue,
									);
								}
								// Reset error state when URL changes
								const key = `${sectionKey}-${fieldKey}-${itemIndex ?? 0}`;
								setImageErrors((prev) => {
									const updated = { ...prev };
									delete updated[key];
									return updated;
								});
							}}
							className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-[#525252] rounded-md bg-white dark:bg-[#222222] text-gray-900 dark:text-[#e5e5e5] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							placeholder="URL atau upload"
						/>
						<label className="flex items-center justify-center gap-1.5 px-3 py-2 border border-dashed border-gray-300 dark:border-[#525252] rounded-md bg-gray-50 dark:bg-[#222222] cursor-pointer hover:bg-gray-100 dark:hover:bg-[#323232] transition-colors whitespace-nowrap">
							<Upload size={14} className="text-gray-600 dark:text-[#929292]" />
							<span className="text-xs font-medium text-gray-600 dark:text-[#929292]">
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
												fieldConfig,
												itemIndex,
												fieldConfig.target,
											)
										: handleFileUpload(e, sectionKey, fieldKey, fieldConfig)
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
				<div className="space-y-2">
					{isVideoUrl(value) && (
						<div className="relative w-full bg-gray-100 dark:bg-[#222222] rounded-md overflow-hidden border border-gray-300 dark:border-[#525252]">
							<div className="relative w-full pb-[56.25%]">
								<video
									className="absolute inset-0 w-full h-full object-cover"
									controls
								>
									<source src={value} type="video/mp4" />
								</video>
							</div>
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
							className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-[#525252] rounded-md bg-white dark:bg-[#222222] text-gray-900 dark:text-[#e5e5e5] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							placeholder="URL atau upload"
						/>
						<label className="flex items-center justify-center gap-1.5 px-3 py-2 border border-dashed border-gray-300 dark:border-[#525252] rounded-md bg-gray-50 dark:bg-[#222222] cursor-pointer hover:bg-gray-100 dark:hover:bg-[#323232] transition-colors whitespace-nowrap">
							<Upload size={14} className="text-gray-600 dark:text-[#929292]" />
							<span className="text-xs font-medium text-gray-600 dark:text-[#929292]">
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
												fieldConfig,
												itemIndex,
												fieldConfig.target,
											)
										: handleFileUpload(e, sectionKey, fieldKey, fieldConfig)
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
			<div className="space-y-2">
				{arrayValue.map((item, idx) => (
					<div
						key={idx}
						className="bg-white dark:bg-[#323232] p-3.5 rounded-md border border-gray-200 dark:border-[#525252] hover:border-gray-300 dark:hover:border-[#626262] transition-colors"
					>
						<div className="flex items-center justify-between mb-3">
							<span className="text-xs font-semibold text-gray-600 dark:text-[#a0a0a0] uppercase tracking-wide">
								Item {idx + 1}
							</span>
							<button
								onClick={() => handleRemoveArrayItem(sectionKey, fieldKey, idx)}
								className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-md transition-colors"
								title="Delete item"
							>
								<Trash2 size={16} />
							</button>
						</div>

						<div className="grid grid-cols-2 gap-3">
							{fieldConfig.fields?.map((field) => (
								<div key={field.target}>
									<label className="block text-xs font-medium text-gray-700 dark:text-[#929292] mb-1.5">
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
					className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium border-2 border-dashed border-gray-300 dark:border-[#525252] rounded-md bg-white dark:bg-[#222222] text-gray-600 dark:text-[#929292] hover:bg-gray-50 dark:hover:bg-[#323232] hover:border-gray-400 dark:hover:border-[#626262] transition-all"
				>
					<Plus size={16} />
					Add {fieldConfig.label}
				</button>
			</div>
		);
	};

	return (
		<div className="space-y-3">
			{error && (
				<div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3.5 flex items-start gap-3">
					<AlertCircle
						className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
						size={18}
					/>
					<div className="flex-1">
						<p className="text-red-900 dark:text-red-200 font-semibold text-sm">
							Error
						</p>
						<p className="text-red-800 dark:text-red-300 text-xs mt-0.5">
							{error}
						</p>
					</div>
				</div>
			)}

			{success && (
				<div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3.5">
					<p className="text-green-900 dark:text-green-200 font-semibold text-sm">
						✓ Saved successfully
					</p>
				</div>
			)}

			{/* Search Bar */}
			<div className="flex-1 relative">
				<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary dark:text-[#929292]" />
				<input
					type="text"
					placeholder="Search sections by name..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-[#e5e5e5] placeholder-secondary dark:placeholder-[#929292] focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>

			{/* Search Results Info */}
			{searchQuery && (
				<div className="text-sm text-secondary dark:text-[#929292]">
					Found {Object.entries(filteredSections).length} of{" "}
					{Object.entries(config).length} sections
				</div>
			)}

			{/* Sections */}
			<div className="space-y-3">
				{Object.entries(filteredSections).length === 0 && searchQuery ? (
					<div className="text-center py-8">
						<p className="text-secondary dark:text-[#929292]">
							No sections match "{searchQuery}"
						</p>
					</div>
				) : (
					Object.entries(filteredSections).map(
						([sectionKey, sectionFields]: [string, any]) => (
							<div
								key={sectionKey}
								className="group bg-white dark:bg-[#323232] border border-gray-200 dark:border-[#525252] rounded-lg overflow-hidden shadow-sm hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200"
							>
								<button
									onClick={() => toggleExpanded(sectionKey)}
									className="w-full flex items-center justify-between px-5 py-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent dark:hover:from-blue-950/20 dark:hover:to-transparent transition-all duration-200 group/button"
								>
									<div className="flex items-center gap-3">
										<div className="w-1 h-6 bg-blue-500 dark:bg-blue-400 rounded-full opacity-0 group-hover/button:opacity-100 transition-opacity duration-200" />
										<h3 className="font-semibold text-sm text-gray-900 dark:text-[#e5e5e5] group-hover/button:text-blue-600 dark:group-hover/button:text-blue-400 transition-colors duration-200">
											{formatSectionTitle(sectionKey)}
										</h3>
									</div>
									<div className="relative">
										{expanded[sectionKey] ? (
											<ChevronUp
												size={20}
												className="text-gray-500 dark:text-[#929292] group-hover/button:text-blue-600 dark:group-hover/button:text-blue-400 transition-all duration-300 transform"
											/>
										) : (
											<ChevronDown
												size={20}
												className="text-gray-500 dark:text-[#929292] group-hover/button:text-blue-600 dark:group-hover/button:text-blue-400 transition-all duration-300 transform"
											/>
										)}
									</div>
								</button>

								{expanded[sectionKey] && (
									<div className="border-t border-gray-200 dark:border-[#525252] p-6 bg-gradient-to-br from-gray-50 to-white dark:from-[#222222] dark:to-[#323232] animate-in fade-in duration-200">
										<div className="grid grid-cols-1 w-3/4 gap-5">
											{Array.isArray(sectionFields) &&
												sectionFields.map(
													(field: FormField, fieldIndex: number) => {
														const sectionData = data[sectionKey] || {};
														const fieldValue = sectionData[field.target || ""];

														return (
															<div
																key={`${sectionKey}-${fieldIndex}`}
																className="bg-white dark:bg-[#222222] rounded-lg p-4 border border-gray-200 dark:border-[#424242] hover:border-gray-300 dark:hover:border-[#525252] transition-colors duration-200"
															>
																<label className="block text-xs font-semibold text-gray-700 dark:text-[#929292] mb-2.5 uppercase tracking-wide">
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
									</div>
								)}
							</div>
						),
					)
				)}
			</div>

			{/* Save Button */}
			<div className="flex justify-end pt-3 border-t border-gray-200 dark:border-[#424242]">
				<button
					onClick={handleSave}
					disabled={saving}
					className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
				>
					{saving ? (
						<Loader size={18} className="animate-spin" />
					) : (
						<Save size={18} />
					)}
					{saving ? "Saving..." : "Save Changes"}
				</button>
			</div>
		</div>
	);
}
