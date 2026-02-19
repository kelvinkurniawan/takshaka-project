"use client";

import Image from "next/image";
import { useState } from "react";
import { Trash2, Download } from "lucide-react";

interface Media {
	id: number;
	filename: string;
	url: string;
	type: string;
	originalName: string;
	fileSize: number;
	mimeType: string;
	createdBy: number;
	createdAt: Date | number;
	deletedAt?: Date | number | null;
}

interface MediaManagerClientProps {
	initialMedia: Media[];
}

export default function MediaManagerClient({
	initialMedia,
}: MediaManagerClientProps) {
	const [media, setMedia] = useState(initialMedia);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [selectedMedia, setSelectedMedia] = useState<number | null>(null);

	const formatFileSize = (bytes: number) => {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
	};

	const formatDate = (date: Date | number) => {
		const d = new Date(date);
		return d.toLocaleDateString("id-ID", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const handleDelete = async (id: number) => {
		if (!confirm("Apakah Anda yakin ingin menghapus media ini?")) {
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const response = await fetch(`/api/media-gallery?id=${id}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || "Failed to delete media");
			}

			setMedia(media.filter((item) => item.id !== id));
			setSelectedMedia(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
		} finally {
			setLoading(false);
		}
	};

	const downloadMedia = (url: string, filename: string) => {
		const a = document.createElement("a");
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	};

	return (
		<div>
			{/* Error Message */}
			{error && (
				<div className="mb-6 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-800 dark:text-red-200 px-4 py-3 rounded">
					{error}
				</div>
			)}

			{media.length === 0 ? (
				<div className="bg-surface dark:bg-[#323232] p-12 rounded-lg border border-gray-200 dark:border-[#424242] text-center">
					<p className="text-secondary dark:text-[#929292] mb-2">
						No media uploaded yet
					</p>
					<p className="text-tertiary dark:text-[#828282] text-sm">
						Start uploading images and videos to build your media library
					</p>
				</div>
			) : (
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Media Grid */}
					<div className="space-y-4">
						{media.map((item) => (
							<div
								key={item.id}
								onClick={() => setSelectedMedia(item.id)}
								className={`
                  p-4 border rounded-lg cursor-pointer transition-all
                  ${
										selectedMedia === item.id
											? "bg-blue-50 dark:bg-blue-900/20 border-blue-500 dark:border-blue-600"
											: "bg-white dark:bg-[#222222] border-gray-300 dark:border-[#424242] hover:border-gray-400 dark:hover:border-[#525252]"
									}
                `}
							>
								<div className="flex gap-4">
									{/* Thumbnail */}
									{item.type === "image" ? (
										<Image
											src={item.url}
											alt={item.originalName}
											width={64}
											height={64}
											className="w-16 h-16 rounded object-cover flex-shrink-0"
										/>
									) : (
										<div className="w-16 h-16 rounded bg-gray-200 dark:bg-[#424242] flex items-center justify-center flex-shrink-0">
											<span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
												VIDEO
											</span>
										</div>
									)}

									{/* Info */}
									<div className="flex-1 min-w-0">
										<h3 className="font-medium text-primary dark:text-[#e5e5e5] truncate">
											{item.originalName}
										</h3>
										<p className="text-xs text-secondary dark:text-[#929292]">
											{formatFileSize(item.fileSize)}
										</p>
										<p className="text-xs text-muted dark:text-[#727272]">
											{formatDate(item.createdAt)}
										</p>
									</div>
								</div>
							</div>
						))}
					</div>

					{/* Preview & Details */}
					{selectedMedia !== null && (
						<div className="bg-surface dark:bg-[#323232] p-6 rounded-lg border border-gray-200 dark:border-[#424242] sticky top-6 h-fit">
							{(() => {
								const selected = media.find(
									(item) => item.id === selectedMedia,
								);
								if (!selected) return null;

								return (
									<div className="space-y-4">
										{/* Preview */}
										<div className="bg-gray-100 dark:bg-[#222222] rounded-lg p-3 flex items-center justify-center aspect-video">
											{selected.type === "image" ? (
												<Image
													src={selected.url}
													alt={selected.originalName}
													width={500}
													height={400}
													className="max-w-full max-h-full rounded object-cover"
												/>
											) : (
												<video
													src={selected.url}
													controls
													className="max-w-full max-h-full rounded"
												/>
											)}
										</div>

										{/* Details */}
										<div className="space-y-3 border-t border-gray-200 dark:border-[#424242] pt-4">
											<div>
												<label className="block text-xs font-semibold text-secondary dark:text-[#929292] mb-1">
													Filename
												</label>
												<p className="text-sm text-primary dark:text-[#e5e5e5] break-all font-mono">
													{selected.filename}
												</p>
											</div>

											<div>
												<label className="block text-xs font-semibold text-secondary dark:text-[#929292] mb-1">
													Original Name
												</label>
												<p className="text-sm text-primary dark:text-[#e5e5e5] break-all">
													{selected.originalName}
												</p>
											</div>

											<div className="grid grid-cols-2 gap-4">
												<div>
													<label className="block text-xs font-semibold text-secondary dark:text-[#929292] mb-1">
														Type
													</label>
													<p className="text-sm text-primary dark:text-[#e5e5e5] capitalize">
														{selected.type}
													</p>
												</div>
												<div>
													<label className="block text-xs font-semibold text-secondary dark:text-[#929292] mb-1">
														Size
													</label>
													<p className="text-sm text-primary dark:text-[#e5e5e5]">
														{formatFileSize(selected.fileSize)}
													</p>
												</div>
											</div>

											<div>
												<label className="block text-xs font-semibold text-secondary dark:text-[#929292] mb-1">
													MIME Type
												</label>
												<p className="text-sm text-primary dark:text-[#e5e5e5] font-mono">
													{selected.mimeType}
												</p>
											</div>

											<div>
												<label className="block text-xs font-semibold text-secondary dark:text-[#929292] mb-1">
													Uploaded
												</label>
												<p className="text-sm text-primary dark:text-[#e5e5e5]">
													{formatDate(selected.createdAt)}
												</p>
											</div>

											<div>
												<label className="block text-xs font-semibold text-secondary dark:text-[#929292] mb-1">
													URL
												</label>
												<textarea
													readOnly
													value={selected.url}
													className="w-full px-2 py-1 text-xs bg-gray-100 dark:bg-[#222222] border border-gray-300 dark:border-[#424242] rounded text-primary dark:text-[#e5e5e5] font-mono resize-none"
													rows={2}
												/>
											</div>

											{/* Actions */}
											<div className="flex gap-2 pt-2">
												<button
													onClick={() => {
														navigator.clipboard.writeText(selected.url);
													}}
													className="flex-1 px-3 py-2 bg-blue-600 dark:bg-blue-700 text-white text-sm font-medium rounded hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
												>
													Copy URL
												</button>
												<button
													onClick={() =>
														downloadMedia(selected.url, selected.originalName)
													}
													className="px-3 py-2 bg-gray-300 dark:bg-[#424242] text-gray-900 dark:text-[#e5e5e5] rounded hover:bg-gray-400 dark:hover:bg-[#525252] transition-colors flex items-center gap-2"
													title="Download media"
												>
													<Download className="w-4 h-4" />
												</button>
												<button
													onClick={() => handleDelete(selectedMedia)}
													disabled={loading}
													className="px-3 py-2 bg-red-600 dark:bg-red-700 text-white rounded hover:bg-red-700 dark:hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
													title="Delete media"
												>
													<Trash2 className="w-4 h-4" />
												</button>
											</div>
										</div>
									</div>
								);
							})()}
						</div>
					)}
				</div>
			)}
		</div>
	);
}
