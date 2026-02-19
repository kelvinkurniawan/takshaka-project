"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { Upload, X, CheckCircle, AlertCircle } from "lucide-react";

interface FileUploadInputProps {
	type: "image" | "video";
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	imageProps?: {
		width: string;
		height: string;
		objectFit: "cover" | "contain" | "fill" | "scale-down";
		placement: "left" | "center" | "right";
		alt: string;
		borderRadius: string;
	};
	videoProps?: {
		width: string;
		height: string;
		autoplay: boolean;
		loop: boolean;
		muted: boolean;
	};
}

export default function FileUploadInput({
	type,
	value,
	onChange,
	placeholder = "Click or drag files here",
	imageProps,
	videoProps,
}: FileUploadInputProps) {
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileSelect = async (
		e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>,
	) => {
		let files: FileList | null = null;

		if ("dataTransfer" in e) {
			// Drag and drop
			files = e.dataTransfer.files;
		} else {
			// File input
			files = e.currentTarget.files;
		}

		if (!files || files.length === 0) return;

		const file = files[0];

		// Validate file type
		const allowedTypes = {
			image: ["image/jpeg", "image/png", "image/webp", "image/gif"],
			video: ["video/mp4", "video/webm", "video/quicktime"],
		};

		if (!allowedTypes[type].includes(file.type)) {
			setError(`Invalid ${type} format`);
			return;
		}

		// Validate file size
		const maxSize = type === "image" ? 10 * 1024 * 1024 : 100 * 1024 * 1024;
		if (file.size > maxSize) {
			const maxMB = maxSize / (1024 * 1024);
			setError(`File size must be less than ${maxMB}MB`);
			return;
		}

		setError(null);
		setUploading(true);

		try {
			const formData = new FormData();
			formData.append("file", file);
			formData.append("type", type);

			const response = await fetch("/api/upload", {
				method: "POST",
				body: formData,
				credentials: "include",
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Upload failed");
			}

			const data = await response.json();
			onChange(data.url);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Upload failed");
		} finally {
			setUploading(false);
		}
	};

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
	};

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		handleFileSelect(e);
	};

	const clearFile = () => {
		onChange("");
		setError(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	return (
		<div className="file-upload-container">
			{value ? (
				<div className="file-upload-preview">
					<div className="preview-item">
						{type === "image" ? (
							<div
								className="preview-image-wrapper"
								style={{ position: "relative", width: "100%", height: "200px" }}
							>
								<Image
									src={value}
									alt={imageProps?.alt || "Upload preview"}
									fill
									className="preview-image"
									style={{
										objectFit: "cover",
									}}
								/>
							</div>
						) : (
							<video
								src={value}
								controls
								className="preview-video"
								style={
									videoProps
										? ({
												width: videoProps.width,
												height: videoProps.height,
												display: "block",
											} as React.CSSProperties)
										: undefined
								}
								autoPlay={videoProps?.autoplay}
								loop={videoProps?.loop}
								muted={videoProps?.muted}
							/>
						)}
					</div>
					<div className="preview-info">
						<div className="preview-url flex-1 items-center">
							<CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
							<input
								type="text"
								value={value}
								readOnly
								className="column-input"
							/>
							<button
								onClick={clearFile}
								className="btn-icon btn-icon-danger"
								title="Remove file"
							>
								<X className="w-4 h-4" /> Remove
							</button>
						</div>
					</div>
				</div>
			) : (
				<div
					className="file-upload-area"
					onDragOver={handleDragOver}
					onDrop={handleDrop}
					onClick={() => fileInputRef.current?.click()}
				>
					<input
						ref={fileInputRef}
						type="file"
						accept={
							type === "image"
								? "image/jpeg,image/png,image/webp,image/gif"
								: "video/mp4,video/webm,video/quicktime"
						}
						onChange={handleFileSelect}
						disabled={uploading}
						className="file-input"
					/>

					<div className="upload-icon">
						{uploading ? (
							<div className="spinner" />
						) : (
							<Upload className="w-8 h-8" />
						)}
					</div>

					<p className="upload-placeholder">
						{uploading ? "Uploading..." : placeholder}
					</p>
					<p className="upload-hint">
						{type === "image"
							? "Max 10MB • JPEG, PNG, WebP, GIF"
							: "Max 100MB • MP4, WebM, MOV"}
					</p>
				</div>
			)}

			{error && (
				<div className="upload-error">
					<AlertCircle className="w-5 h-5" />
					<span>{error}</span>
				</div>
			)}
		</div>
	);
}
