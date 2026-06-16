"use client";
import { apiFetch } from "@/lib/api-fetch";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader, AlertCircle, Save, Code } from "lucide-react";
import SectionDataEditor from "./SectionDataEditorNew";

interface PageSection {
	id: number;
	pageName: string;
	pageSlug: string;
	pageData: string;
	created_by: number;
	created_at: string;
	updated_at: string;
}

interface SectionEditorProps {
	sectionId: string;
}

export default function SectionEditor({ sectionId }: SectionEditorProps) {
	const router = useRouter();
	const [section, setSection] = useState<PageSection | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [showRawJson, setShowRawJson] = useState(false);
	const [jsonEditMode, setJsonEditMode] = useState(false);
	const [rawJson, setRawJson] = useState("");
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		fetchSection();
	}, [sectionId]);

	const fetchSection = async () => {
		try {
			setLoading(true);
			const response = await apiFetch(`/api/page-sections/${sectionId}`);

			if (!response.ok) {
				throw new Error("Failed to fetch section");
			}

			const data = await response.json();
			setSection(data);
			setRawJson(JSON.stringify(JSON.parse(data.pageData), null, 2));
			setError(null);
		} catch (err) {
			console.error("Error fetching section:", err);
			setError("Failed to load page section. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const handleSaveRawJson = async () => {
		try {
			// Validate JSON
			let parsedJson;
			try {
				parsedJson = JSON.parse(rawJson);
			} catch (err) {
				setError("Invalid JSON format. Please check your syntax.");
				return;
			}

			setSaving(true);
			const response = await apiFetch(`/api/page-sections/${sectionId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					pageData: JSON.stringify(parsedJson),
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to save section");
			}

			// Refresh section data
			await fetchSection();
			setJsonEditMode(false);
			setShowRawJson(false);
		} catch (err) {
			console.error("Error saving section:", err);
			setError("Failed to save section. Please try again.");
		} finally {
			setSaving(false);
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-96">
				<Loader className="animate-spin text-blue-500" size={40} />
			</div>
		);
	}

	if (!section) {
		return (
			<div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
				<p className="text-red-900 dark:text-red-200 font-semibold">
					Section not found
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<button
						onClick={() => router.back()}
						className="p-2 hover:bg-gray-100 dark:hover:bg-[#323232] rounded-lg transition-colors"
						title="Go back"
					>
						<ArrowLeft
							size={20}
							className="text-gray-600 dark:text-[#929292]"
						/>
					</button>
					<div>
						<h1 className="dashboard-header-title">{section.pageName}</h1>
						<p className="dashboard-header-subtitle text-sm">
							Slug:{" "}
							<code className="bg-gray-100 dark:bg-[#222222] px-2 py-1 rounded">
								{section.pageSlug}
							</code>
						</p>
					</div>
				</div>

				<button
					onClick={() => setShowRawJson(!showRawJson)}
					className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-[#323232] text-gray-900 dark:text-[#e5e5e5] rounded-lg hover:bg-gray-300 dark:hover:bg-[#424242] transition-colors"
				>
					<Code size={18} />
					{showRawJson ? "Hide" : "View"} Raw JSON
				</button>
			</div>

			{error && (
				<div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
					<AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
					<div>
						<p className="text-red-900 dark:text-red-200 font-medium">Error</p>
						<p className="text-red-800 dark:text-red-300 text-sm">{error}</p>
					</div>
				</div>
			)}

			{/* Raw JSON Editor */}
			{showRawJson && (
				<div className="bg-white dark:bg-[#323232] border border-gray-200 dark:border-[#424242] rounded-lg p-6 space-y-4">
					<div className="flex items-center justify-between">
						<h3 className="font-semibold text-gray-900 dark:text-[#e5e5e5]">
							Raw JSON Editor
						</h3>
						{!jsonEditMode && (
							<button
								onClick={() => setJsonEditMode(true)}
								className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
							>
								Edit
							</button>
						)}
					</div>

					{jsonEditMode ? (
						<div className="space-y-4">
							<textarea
								value={rawJson}
								onChange={(e) => setRawJson(e.target.value)}
								className="w-full h-96 p-4 bg-gray-50 dark:bg-[#222222] border border-gray-300 dark:border-[#525252] rounded-lg font-mono text-sm text-gray-900 dark:text-[#e5e5e5] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
								spellCheck="false"
							/>
							<div className="flex gap-2">
								<button
									onClick={handleSaveRawJson}
									disabled={saving}
									className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
								>
									{saving ? (
										<Loader size={18} className="animate-spin" />
									) : (
										<Save size={18} />
									)}
									Save Changes
								</button>
								<button
									onClick={() => {
										setJsonEditMode(false);
										setRawJson(
											JSON.stringify(JSON.parse(section.pageData), null, 2),
										);
									}}
									disabled={saving}
									className="px-4 py-2 bg-gray-200 dark:bg-[#424242] text-gray-900 dark:text-[#e5e5e5] rounded-lg hover:bg-gray-300 dark:hover:bg-[#525252] transition-colors disabled:opacity-50"
								>
									Cancel
								</button>
							</div>
						</div>
					) : (
						<pre className="bg-gray-50 dark:bg-[#222222] p-4 rounded-lg overflow-auto max-h-96">
							<code className="text-gray-900 dark:text-[#e5e5e5] text-xs">
								{rawJson}
							</code>
						</pre>
					)}
				</div>
			)}

			{/* Section Data Editor */}
			{!showRawJson && (
				<SectionDataEditor section={section} onSave={fetchSection} />
			)}
		</div>
	);
}
