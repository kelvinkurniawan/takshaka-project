"use client";
import { apiFetch } from "@/lib/api-fetch";

import { useState, useMemo, useEffect } from "react";
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
	const [uploadingFields, setUploadingFields] = useState<Set<string>>(
		new Set(),
	);
	const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
		{},
	);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const [imagePreviews, setImagePreviews] = useState<Record<string, string>>(
		{},
	);
	const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
	const [categories, setCategories] = useState<
		Array<{
			id: number;
			name: string;
			slug: string;
			description: string | null;
			contents: Array<{
				id: number;
				title: string;
				excerpt: string | null;
				featuredImage: string | null;
				slug: string;
			}>;
		}>
	>([]);
	const [categoriesLoading, setCategoriesLoading] = useState(false);

	// Fetch categories on mount
	useEffect(() => {
		const fetchCategories = async () => {
			try {
				setCategoriesLoading(true);
				const response = await apiFetch("/api/categories/with-contents");
				if (!response.ok) throw new Error("Failed to fetch categories");
				const data = await response.json();
				setCategories(data);
			} catch (err) {
				console.error("Error fetching categories:", err);
			} finally {
				setCategoriesLoading(false);
			}
		};

		fetchCategories();
	}, []);

	const config = useMemo(() => {
		const configMap = pageSectionsConfig as Record<string, any>;
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

		const previewKey = `${sectionKey}-${fieldKey}-${itemIndex ?? 0}`;

		try {
			// Clear previous error and add to uploading fields
			setImageErrors((prev) => {
				const updated = { ...prev };
				delete updated[previewKey];
				return updated;
			});
			setUploadingFields((prev) => new Set(prev).add(previewKey));
			setUploadProgress((prev) => ({ ...prev, [previewKey]: 0 }));

			// Show preview
			const reader = new FileReader();
			reader.onload = (event) => {
				setImagePreviews((prev) => ({
					...prev,
					[previewKey]: event.target?.result as string,
				}));
			};
			reader.readAsDataURL(file);

			setUploading(true);

			// Simulate progress for better UX
			const progressInterval = setInterval(() => {
				setUploadProgress((prev) => {
					const current = prev[previewKey] || 0;
					return {
						...prev,
						[previewKey]: Math.min(current + Math.random() * 30, 90),
					};
				});
			}, 200);

			// Create abort controller for timeout
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minutes

			// Step 1: Request presigned URL from API
			const presignedResponse = await apiFetch(
				`/api/upload?fileName=${encodeURIComponent(file.name)}&fileSize=${file.size}&fileType=${encodeURIComponent(file.type)}`,
				{
					method: "GET",
					signal: controller.signal,
				},
			);

			if (!presignedResponse.ok) {
				clearInterval(progressInterval);
				const errorData = await presignedResponse.json();
				throw new Error(errorData.error || "Failed to get upload URL");
			}

			const { presignedUrl, publicUrl, s3Key, type } =
				await presignedResponse.json();

			setUploadProgress((prev) => ({ ...prev, [previewKey]: 50 }));

			// Step 2: Upload file directly to R2 using presigned URL
			// Convert File to ArrayBuffer for proper cross-origin handling
			const fileBuffer = await file.arrayBuffer();
			const uploadResponse = await apiFetch(presignedUrl, {
				method: "PUT",
				body: new Uint8Array(fileBuffer),
			});

			if (!uploadResponse.ok) {
				clearInterval(progressInterval);
				throw new Error(`R2 upload failed: ${uploadResponse.status}`);
			}

			setUploadProgress((prev) => ({ ...prev, [previewKey]: 80 }));

			// Step 3: Save metadata to database
			const metadataResponse = await apiFetch("/api/upload", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					publicUrl,
					s3Key,
					type,
					fileName: file.name,
					fileSize: file.size,
					fileType: file.type,
				}),
				signal: controller.signal,
			});

			clearInterval(progressInterval);
			clearTimeout(timeoutId);

			if (!metadataResponse.ok) {
				const errorData = await metadataResponse.json();
				throw new Error(errorData.error || "Failed to save file metadata");
			}

			setUploadProgress((prev) => ({ ...prev, [previewKey]: 100 }));

			const { url } = await metadataResponse.json();

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

			// Clear preview and uploading state after successful upload
			setTimeout(() => {
				setImagePreviews((prev) => {
					const updated = { ...prev };
					delete updated[previewKey];
					return updated;
				});
				setUploadingFields((prev) => {
					const updated = new Set(prev);
					updated.delete(previewKey);
					return updated;
				});
				setUploadProgress((prev) => {
					const updated = { ...prev };
					delete updated[previewKey];
					return updated;
				});
			}, 500);
		} catch (err) {
			console.error("Error uploading file:", err);

			// Clear progress and mark as finished uploading
			setUploadingFields((prev) => {
				const updated = new Set(prev);
				updated.delete(previewKey);
				return updated;
			});
			setUploadProgress((prev) => {
				const updated = { ...prev };
				delete updated[previewKey];
				return updated;
			});

			// Handle abort/timeout
			if (err instanceof Error && err.name === "AbortError") {
				setError(
					"Upload timed out. File may be too large or connection too slow. Please try again.",
				);
			} else {
				setError(
					err instanceof Error
						? err.message
						: "Failed to upload file. Please try again.",
				);
			}
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
			const isUploading = uploadingFields.has(previewKey);
			const progress = uploadProgress[previewKey] || 0;

			return (
				<div className="space-y-2">
					{hasValue && !hasError && !isUploading && (
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
					{isUploading && (
						<div className="w-full bg-blue-50 dark:bg-blue-900/20 rounded-md overflow-hidden border border-blue-200 dark:border-blue-800 p-4 min-h-[150px] flex flex-col items-center justify-center gap-3">
							<div className="w-8 h-8 border-4 border-blue-200 dark:border-blue-900 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin" />
							<div className="w-full">
								<p className="text-blue-600 dark:text-blue-400 text-sm font-medium mb-2 text-center">
									Uploading...
								</p>
								<div className="w-full bg-blue-200 dark:bg-blue-900 rounded-full h-2 overflow-hidden">
									<div
										className="bg-blue-600 dark:bg-blue-400 h-full transition-all duration-200"
										style={{ width: `${Math.min(progress, 100)}%` }}
									/>
								</div>
								<p className="text-blue-600 dark:text-blue-400 text-xs mt-1 text-center">
									{Math.round(progress)}%
								</p>
							</div>
						</div>
					)}
					{hasError && !isUploading && (
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

		if (fieldConfig.type === "image/video") {
			const previewKey = `${sectionKey}-${fieldKey}-${itemIndex ?? 0}`;
			const preview = imagePreviews[previewKey];
			const hasValue = preview || (value && typeof value === "string");
			const hasError = imageErrors[previewKey];
			const isUploading = uploadingFields.has(previewKey);
			const progress = uploadProgress[previewKey] || 0;
			const isImage = hasValue && isImageUrl(value);
			const isVideo = hasValue && isVideoUrl(value);

			return (
				<div className="space-y-2">
					{hasValue && !hasError && !isUploading && (
						<div className="relative w-full bg-gray-100 dark:bg-[#222222] rounded-md overflow-hidden border border-gray-300 dark:border-[#525252]">
							<div
								className="relative w-full"
								style={{ paddingBottom: isImage ? "66.666%" : "56.25%" }}
							>
								{isImage ? (
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
								) : (
									<video
										className="absolute inset-0 w-full h-full object-cover"
										controls
									>
										<source src={preview || value} type="video/mp4" />
									</video>
								)}
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
					{isUploading && (
						<div className="w-full bg-blue-50 dark:bg-blue-900/20 rounded-md overflow-hidden border border-blue-200 dark:border-blue-800 p-4 min-h-[150px] flex flex-col items-center justify-center gap-3">
							<div className="w-8 h-8 border-4 border-blue-200 dark:border-blue-900 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin" />
							<div className="w-full">
								<p className="text-blue-600 dark:text-blue-400 text-sm font-medium mb-2 text-center">
									Uploading...
								</p>
								<div className="w-full bg-blue-200 dark:bg-blue-900 rounded-full h-2 overflow-hidden">
									<div
										className="bg-blue-600 dark:bg-blue-400 h-full transition-all duration-200"
										style={{ width: `${Math.min(progress, 100)}%` }}
									/>
								</div>
								<p className="text-blue-600 dark:text-blue-400 text-xs mt-1 text-center">
									{Math.round(progress)}%
								</p>
							</div>
						</div>
					)}
					{hasError && !isUploading && (
						<div className="w-full bg-red-50 dark:bg-red-900/20 rounded-md overflow-hidden border border-red-200 dark:border-red-800 p-4 flex items-center justify-center min-h-[150px]">
							<div className="text-center">
								<p className="text-red-600 dark:text-red-400 text-sm font-medium mb-1">
									Failed to load media
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
								accept="image/*,video/*"
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

		if (fieldConfig.type === "categoriesSelect") {
			const selectedIds = value || [];

			const handleCategoryToggle = (categoryId: number) => {
				const newIds = selectedIds.includes(categoryId)
					? selectedIds.filter((id: number) => id !== categoryId)
					: [...selectedIds, categoryId];

				// Only save the category IDs, tabs will be generated on the server
				handleFieldChange(sectionKey, "selectedCategoryIds", newIds);
			};

			return (
				<div className="space-y-3">
					{categoriesLoading ? (
						<div className="flex items-center justify-center p-4">
							<div className="w-5 h-5 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
							<p className="ml-2 text-sm text-gray-600 dark:text-[#929292]">
								Loading categories...
							</p>
						</div>
					) : categories.length === 0 ? (
						<div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
							<p className="text-sm text-yellow-800 dark:text-yellow-200">
								No categories available. Create some categories first.
							</p>
						</div>
					) : (
						<div className="space-y-2">
							{categories.map((category) => (
								<div
									key={category.id}
									className="flex items-start gap-3 p-3 border border-gray-200 dark:border-[#525252] rounded-md hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
								>
									<input
										type="checkbox"
										id={`category-${category.id}`}
										checked={selectedIds.includes(category.id)}
										onChange={() => handleCategoryToggle(category.id)}
										className="mt-1 w-4 h-4 accent-blue-600 cursor-pointer"
									/>
									<label
										htmlFor={`category-${category.id}`}
										className="flex-1 cursor-pointer"
									>
										<div className="font-medium text-sm text-gray-900 dark:text-[#e5e5e5]">
											{category.name}
										</div>
										<div className="text-xs text-gray-600 dark:text-[#929292] mt-1">
											{category.contents.length} content
											{category.contents.length !== 1 ? "s" : ""}
										</div>
										{category.description && (
											<div className="text-xs text-gray-500 dark:text-[#767676] mt-1">
												{category.description}
											</div>
										)}
									</label>
								</div>
							))}
						</div>
					)}

					{selectedIds.length > 0 && (
						<div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
							<p className="text-xs font-medium text-blue-900 dark:text-blue-200">
								✓ {selectedIds.length} categor
								{selectedIds.length > 1 ? "ies" : "y"} selected
							</p>
							<p className="text-xs text-blue-800 dark:text-blue-300 mt-1">
								{selectedIds.reduce((total: number, id: number) => {
									const cat = categories.find((c) => c.id === id);
									return total + (cat?.contents.length || 0);
								}, 0)}{" "}
								total items will be displayed
							</p>
						</div>
					)}
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
