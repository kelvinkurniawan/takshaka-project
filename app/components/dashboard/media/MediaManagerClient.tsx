"use client";

import { useState } from "react";
import { Trash2, Download, Copy, X, Zap } from "lucide-react";

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
	const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
	const [copiedId, setCopiedId] = useState<number | null>(null);
	const [compressingId, setCompressingId] = useState<number | null>(null);
	const [compressionSuccess, setCompressionSuccess] = useState<{
		id: number;
		ratio: number;
	} | null>(null);

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
			if (selectedMedia?.id === id) {
				setSelectedMedia(null);
			}
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

	const copyToClipboard = (url: string, id: number) => {
		navigator.clipboard.writeText(url).then(() => {
			setCopiedId(id);
			setTimeout(() => setCopiedId(null), 2000);
		});
	};

	const handleCompress = async (id: number) => {
		if (
			!confirm(
				"Compress image ini? File akan di-replace dengan ukuran lebih kecil.",
			)
		) {
			return;
		}

		setCompressingId(id);
		setError(null);

		try {
			const response = await fetch(`/api/media-gallery/compress`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ mediaId: id }),
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || "Failed to compress image");
			}

			const data = await response.json();

			// Update media item with new file size
			setMedia(
				media.map((item) =>
					item.id === id ? { ...item, fileSize: data.newFileSize } : item,
				),
			);

			// Update selected media if viewing it
			if (selectedMedia?.id === id) {
				setSelectedMedia({
					...selectedMedia,
					fileSize: data.newFileSize,
				});
			}

			// Show success message
			setCompressionSuccess({
				id,
				ratio: data.compressionRatio,
			});
			setTimeout(() => setCompressionSuccess(null), 3000);
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
		} finally {
			setCompressingId(null);
		}
	};

	return (
		<div>
			{/* Error Message */}
			{error && (
				<div className="mb-6 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-800 dark:text-red-200 px-4 py-3 rounded">
					{error}
				</div>
			)}

			{/* Compression Success Message */}
			{compressionSuccess && (
				<div className="mb-6 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-700 text-green-800 dark:text-green-200 px-4 py-3 rounded">
					Image berhasil dikompres! Ukuran berkurang{" "}
					<strong>{compressionSuccess.ratio}%</strong>
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
				<div className="space-y-6">
					{/* Grid View */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
						{media.map((item) => (
							<div
								key={item.id}
								className="group cursor-pointer"
								onClick={() => setSelectedMedia(item)}
							>
								<div className="card-modern p-0 overflow-hidden flex flex-col h-full hover:shadow-lg transition-all">
									{/* Media Preview */}
									<div className="relative w-full aspect-square bg-gray-100 dark:bg-[#323232] flex items-center justify-center overflow-hidden">
										{item.type === "image" ? (
											<img
												src={item.url}
												alt={item.originalName}
												className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
												onError={(e) => {
													(e.target as HTMLImageElement).style.display = "none";
													const fallback = document.createElement("div");
													fallback.className =
														"w-full h-full flex items-center justify-center bg-gray-200 dark:bg-[#424242]";
													fallback.innerHTML =
														"<div class='text-center'><div class='text-gray-500 dark:text-gray-400 text-sm'>Image Error</div></div>";
													(
														e.target as HTMLImageElement
													).parentNode?.appendChild(fallback);
												}}
											/>
										) : (
											<div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
												<div className="text-center text-white">
													<div className="text-3xl mb-2">▶</div>
													<div className="text-xs font-semibold">VIDEO</div>
												</div>
											</div>
										)}
									</div>

									{/* Media Info */}
									<div className="p-3 flex-1 flex flex-col">
										<h3 className="font-medium text-gray-900 dark:text-[#e5e5e5] truncate text-sm mb-1">
											{item.originalName}
										</h3>
										<p className="text-xs text-secondary dark:text-[#929292] mb-auto">
											{formatFileSize(item.fileSize)}
										</p>
										<p className="text-xs text-muted dark:text-[#727272]">
											{formatDate(item.createdAt)}
										</p>
									</div>

									{/* Quick Actions */}
									<div className="border-t border-gray-200 dark:border-[#424242] p-2 flex gap-2">
										{item.type === "image" && (
											<button
												onClick={(e) => {
													e.stopPropagation();
													handleCompress(item.id);
												}}
												disabled={compressingId === item.id}
												className="flex-1 px-2 py-2 bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white text-xs font-medium rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1"
												title="Compress image"
											>
												<Zap className="w-3 h-3" />
												{compressingId === item.id
													? "Compressing..."
													: "Compress"}
											</button>
										)}
										<button
											onClick={(e) => {
												e.stopPropagation();
												copyToClipboard(item.url, item.id);
											}}
											className="flex-1 px-2 py-2 bg-gray-200 dark:bg-[#424242] hover:bg-gray-300 dark:hover:bg-[#525252] text-dark dark:text-[#e5e5e5] text-xs font-medium rounded transition-colors flex items-center justify-center gap-1"
											title="Copy URL"
										>
											<Copy className="w-3 h-3" />
											{copiedId === item.id ? "Copied" : "Copy"}
										</button>
										<button
											onClick={(e) => {
												e.stopPropagation();
												handleDelete(item.id);
											}}
											disabled={loading}
											className="px-2 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
											title="Delete media"
										>
											<Trash2 className="w-3 h-3" />
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Detail Modal */}
			{selectedMedia && (
				<div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
					<div className="bg-white dark:bg-[#222222] rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
						{/* Modal Header */}
						<div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 dark:border-[#424242] bg-white dark:bg-[#222222]">
							<h2 className="text-xl font-semibold text-gray-900 dark:text-[#e5e5e5] truncate">
								{selectedMedia.originalName}
							</h2>
							<button
								onClick={() => setSelectedMedia(null)}
								className="p-2 hover:bg-gray-100 dark:hover:bg-[#323232] rounded-lg transition-colors"
							>
								<X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
							</button>
						</div>

						{/* Modal Body */}
						<div className="p-6 space-y-6">
							{/* Preview */}
							<div className="bg-gray-100 dark:bg-[#323232] rounded-lg p-4 flex items-center justify-center min-h-[300px]">
								{selectedMedia.type === "image" ? (
									<img
										src={selectedMedia.url}
										alt={selectedMedia.originalName}
										className="max-w-full max-h-[500px] rounded object-cover"
										onError={(e) => {
											(e.target as HTMLImageElement).style.display = "none";
											const fallback = document.createElement("div");
											fallback.className =
												"w-full h-full flex items-center justify-center bg-gray-200 dark:bg-[#424242]";
											fallback.innerHTML =
												"<div class='text-center'><div class='text-gray-500 dark:text-gray-400'>Image tidak bisa ditampilkan</div></div>";
											(e.target as HTMLImageElement).parentNode?.appendChild(
												fallback,
											);
										}}
									/>
								) : (
									<video
										src={selectedMedia.url}
										controls
										className="max-w-full max-h-[500px] rounded"
									/>
								)}
							</div>

							{/* Details */}
							<div className="space-y-4 border-t border-gray-200 dark:border-[#424242] pt-6">
								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className="block text-xs font-semibold text-secondary dark:text-[#929292] mb-1">
											Type
										</label>
										<p className="text-sm text-gray-900 dark:text-[#e5e5e5] capitalize">
											{selectedMedia.type}
										</p>
									</div>
									<div>
										<label className="block text-xs font-semibold text-secondary dark:text-[#929292] mb-1">
											Size
										</label>
										<p className="text-sm text-gray-900 dark:text-[#e5e5e5]">
											{formatFileSize(selectedMedia.fileSize)}
										</p>
									</div>
									<div>
										<label className="block text-xs font-semibold text-secondary dark:text-[#929292] mb-1">
											MIME Type
										</label>
										<p className="text-sm text-gray-900 dark:text-[#e5e5e5] font-mono">
											{selectedMedia.mimeType}
										</p>
									</div>
									<div>
										<label className="block text-xs font-semibold text-secondary dark:text-[#929292] mb-1">
											Uploaded
										</label>
										<p className="text-sm text-gray-900 dark:text-[#e5e5e5]">
											{formatDate(selectedMedia.createdAt)}
										</p>
									</div>
								</div>

								<div>
									<label className="block text-xs font-semibold text-secondary dark:text-[#929292] mb-2">
										Filename
									</label>
									<p className="text-sm text-gray-900 dark:text-[#e5e5e5] break-all font-mono bg-gray-50 dark:bg-[#323232] p-3 rounded">
										{selectedMedia.filename}
									</p>
								</div>

								<div>
									<label className="block text-xs font-semibold text-secondary dark:text-[#929292] mb-2">
										URL
									</label>
									<div className="flex gap-2">
										<input
											type="text"
											readOnly
											value={selectedMedia.url}
											className="flex-1 px-3 py-2 text-sm bg-gray-50 dark:bg-[#323232] border border-gray-300 dark:border-[#424242] rounded font-mono text-gray-900 dark:text-[#e5e5e5]"
										/>
										<button
											onClick={() =>
												copyToClipboard(selectedMedia.url, selectedMedia.id)
											}
											className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors flex items-center gap-2"
										>
											<Copy className="w-4 h-4" />
											{copiedId === selectedMedia.id ? "Copied" : "Copy"}
										</button>
									</div>
								</div>
							</div>

							{/* Actions */}
							<div className="border-t border-gray-200 dark:border-[#424242] pt-6 flex gap-3">
								{selectedMedia.type === "image" && (
									<button
										onClick={() => handleCompress(selectedMedia.id)}
										disabled={compressingId === selectedMedia.id}
										className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
									>
										<Zap className="w-4 h-4" />
										{compressingId === selectedMedia.id
											? "Compressing..."
											: "Compress"}
									</button>
								)}
								<button
									onClick={() =>
										downloadMedia(selectedMedia.url, selectedMedia.originalName)
									}
									className="flex-1 px-4 py-2 bg-gray-200 dark:bg-[#424242] text-gray-900 dark:text-[#e5e5e5] font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-[#525252] transition-colors flex items-center justify-center gap-2"
								>
									<Download className="w-4 h-4" />
									Download
								</button>
								<button
									onClick={() => {
										handleDelete(selectedMedia.id);
										setSelectedMedia(null);
									}}
									disabled={loading}
									className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
								>
									<Trash2 className="w-4 h-4" />
									Delete
								</button>
								<button
									onClick={() => setSelectedMedia(null)}
									className="px-4 py-2 bg-gray-300 dark:bg-[#525252] text-gray-900 dark:text-[#e5e5e5] font-medium rounded-lg hover:bg-gray-400 dark:hover:bg-[#626262] transition-colors"
								>
									Close
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
