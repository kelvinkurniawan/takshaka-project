"use client";

import { useState, forwardRef, useImperativeHandle } from "react";
import {
	Plus,
	Trash2,
	GripVertical,
	Type,
	Image as ImageIcon,
	Video,
	Code,
	ChevronUp,
	ChevronDown,
	Settings,
	Images,
} from "lucide-react";
import { useRouter } from "next/navigation";
import RichTextEditor from "@/app/components/RichTextEditor";
import FileUploadInput from "@/app/components/FileUploadInput";
import CodeEditor from "@/app/components/dashboard/pages/CodeEditor";

// Block content types
type ContentType = "text" | "image" | "video" | "embed" | "carousel";

// Carousel item structure
interface CarouselItem {
	id: string;
	media: string; // URL to image/video
	title?: string;
	subtitle?: string;
	link?: string;
}

// Column content structure
interface ColumnContent {
	id: string;
	type: ContentType;
	content: string;
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
	carouselProps?: {
		itemsVisible: number;
		containerWidth: string;
		items: CarouselItem[];
	};
}

// Block structure
interface Block {
	id: string;
	columns: number;
	content: ColumnContent[];
	customCSS?: string;
}

// Page data structure
interface PageData {
	title: string;
	slug: string;
	status: "draft" | "published";
	metaTitle: string;
	metaDescription: string;
	blocks: Block[];
}

interface PageBuilderProps {
	initialData?: PageData;
	pageId?: number;
}

export interface PageBuilderHandle {
	savePage: (status: "draft" | "published") => Promise<void>;
	isSaving: boolean;
	error: string | null;
	success: string | null;
}

// HTML snippets for embed code
const HTML_SNIPPETS = {
	button: `<button style="background-color: #3b82f6; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">
  Klik di sini
</button>`,

	buttonPrimary: `<a href="#" style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; border: none; border-radius: 6px; text-decoration: none; font-weight: bold; cursor: pointer;">
  Tombol Utama
</a>`,

	buttonSecondary: `<a href="#" style="display: inline-block; background-color: #6b7280; color: white; padding: 12px 24px; border: none; border-radius: 6px; text-decoration: none; font-weight: bold; cursor: pointer;">
  Tombol Sekunder
</a>`,

	row: `<div style="display: flex; gap: 16px; padding: 16px; background-color: #f3f4f6; border-radius: 8px;">
  <div style="flex: 1;">
    <h3>Kolom 1</h3>
    <p>Konten di sini</p>
  </div>
  <div style="flex: 1;">
    <h3>Kolom 2</h3>
    <p>Konten di sini</p>
  </div>
</div>`,

	card: `<div style="background-color: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
  <h3 style="margin-top: 0; margin-bottom: 10px; color: #1f2937;">Judul Kartu</h3>
  <p style="color: #6b7280; margin-bottom: 0;">Deskripsi kartu di sini</p>
</div>`,

	cardWithImage: `<div style="background-color: white; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
  <img src="https://via.placeholder.com/400x250" alt="Gambar" style="width: 100%; height: 250px; object-fit: cover;">
  <div style="padding: 20px;">
    <h3 style="margin-top: 0; margin-bottom: 10px; color: #1f2937;">Judul Kartu</h3>
    <p style="color: #6b7280; margin-bottom: 0;">Deskripsi kartu di sini</p>
  </div>
</div>`,

	twoColumnLayout: `<div style="display: flex; gap: 24px; padding: 20px;">
  <div style="flex: 1; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px;">
    <h3>Kolom Kiri</h3>
    <p>Konten kolom kiri</p>
  </div>
  <div style="flex: 1; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px;">
    <h3>Kolom Kanan</h3>
    <p>Konten kolom kanan</p>
  </div>
</div>`,

	threeColumnLayout: `<div style="display: flex; gap: 24px; padding: 20px;">
  <div style="flex: 1; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px;">
    <h3>Kolom 1</h3>
    <p>Konten 1</p>
  </div>
  <div style="flex: 1; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px;">
    <h3>Kolom 2</h3>
    <p>Konten 2</p>
  </div>
  <div style="flex: 1; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px;">
    <h3>Kolom 3</h3>
    <p>Konten 3</p>
  </div>
</div>`,

	hero: `<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 60px 20px; text-align: center; border-radius: 8px;">
  <h1 style="margin: 0 0 10px 0; font-size: 36px;">Judul Hero</h1>
  <p style="margin: 0 0 20px 0; font-size: 18px;">Subjudul atau deskripsi singkat</p>
  <a href="#" style="display: inline-block; background-color: white; color: #667eea; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-weight: bold;">
    Tombol CTA
  </a>
</div>`,

	alert: `<div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 4px; margin-bottom: 16px;">
  <strong style="color: #92400e;">Perhatian:</strong> <span style="color: #b45309;">Pesan penting di sini</span>
</div>`,

	form: `<form style="max-width: 500px; margin: 0 auto;">
  <div style="margin-bottom: 16px;">
    <label style="display: block; margin-bottom: 4px; font-weight: bold; color: #374151;">Nama</label>
    <input type="text" placeholder="Nama Anda" style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 14px;">
  </div>
  <div style="margin-bottom: 16px;">
    <label style="display: block; margin-bottom: 4px; font-weight: bold; color: #374151;">Email</label>
    <input type="email" placeholder="Email Anda" style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 14px;">
  </div>
  <div style="margin-bottom: 16px;">
    <label style="display: block; margin-bottom: 4px; font-weight: bold; color: #374151;">Pesan</label>
    <textarea placeholder="Pesan Anda" style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 14px; min-height: 120px;"></textarea>
  </div>
  <button type="submit" style="background-color: #3b82f6; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; width: 100%;">
    Kirim
  </button>
</form>`,

	codeBlock: `<pre style="background-color: #1f2937; color: #e5e7eb; padding: 16px; border-radius: 6px; overflow-x: auto; font-family: 'Courier New', monospace;">
<code>
// Contoh kode
function hello() {
  console.log("Hello, World!");
}
</code>
</pre>`,
};

const PageBuilder = forwardRef<PageBuilderHandle, PageBuilderProps>(
	function PageBuilder({ initialData, pageId }: PageBuilderProps, ref) {
		const router = useRouter();

		// Helper function to get block columns classname
		const getBlockColumnsClass = (columns: number): string => {
			switch (columns) {
				case 1:
					return "block-columns-1";
				case 2:
					return "block-columns-2";
				case 3:
					return "block-columns-3";
				case 4:
					return "block-columns-4";
				default:
					return "block-columns-1";
			}
		};
		const [isSaving, setIsSaving] = useState(false);
		const [error, setError] = useState<string | null>(null);
		const [success, setSuccess] = useState<string | null>(null);
		const [expandedCSSBlock, setExpandedCSSBlock] = useState<string | null>(
			null,
		);
		const [expandedImageProps, setExpandedImageProps] = useState<string | null>(
			null,
		);
		const [expandedVideoProps, setExpandedVideoProps] = useState<string | null>(
			null,
		);
		const [expandedCarouselProps, setExpandedCarouselProps] = useState<
			string | null
		>(null);
		const [expandedCarouselItems, setExpandedCarouselItems] = useState<
			Set<string>
		>(new Set());
		const [expandedShortcuts, setExpandedShortcuts] = useState<Set<string>>(
			new Set(),
		);

		// Page metadata
		const [title, setTitle] = useState(initialData?.title || "");
		const [slug, setSlug] = useState(initialData?.slug || "");
		const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle || "");
		const [metaDescription, setMetaDescription] = useState(
			initialData?.metaDescription || "",
		);

		// Blocks state
		const [blocks, setBlocks] = useState<Block[]>(initialData?.blocks || []);

		// Generate slug from title
		const generateSlug = (text: string) => {
			return text
				.toLowerCase()
				.replace(/[^\w\s-]/g, "")
				.replace(/\s+/g, "-")
				.replace(/--+/g, "-");
		};

		// Handle title change
		const handleTitleChange = (value: string) => {
			setTitle(value);
			if (!pageId) {
				setSlug(generateSlug(value));
			}
		};

		// Add new block
		const addBlock = (columns: number) => {
			const newBlock: Block = {
				id: `block-${Date.now()}`,
				columns,
				content: Array.from({ length: columns }, (_, i) => ({
					id: `col-${Date.now()}-${i}`,
					type: "text",
					content: "",
				})),
			};
			setBlocks([...blocks, newBlock]);
		};

		// Delete block
		const deleteBlock = (blockId: string) => {
			setBlocks(blocks.filter((block) => block.id !== blockId));
		};

		// Move block up
		const moveBlockUp = (index: number) => {
			if (index === 0) return;
			const newBlocks = [...blocks];
			[newBlocks[index - 1], newBlocks[index]] = [
				newBlocks[index],
				newBlocks[index - 1],
			];
			setBlocks(newBlocks);
		};

		// Move block down
		const moveBlockDown = (index: number) => {
			if (index === blocks.length - 1) return;
			const newBlocks = [...blocks];
			[newBlocks[index], newBlocks[index + 1]] = [
				newBlocks[index + 1],
				newBlocks[index],
			];
			setBlocks(newBlocks);
		};

		// Update column content
		const updateColumnContent = (
			blockId: string,
			columnId: string,
			content: string,
		) => {
			setBlocks(
				blocks.map((block) =>
					block.id === blockId
						? {
								...block,
								content: block.content.map((col) =>
									col.id === columnId ? { ...col, content } : col,
								),
							}
						: block,
				),
			);
		};

		// Update column type
		const updateColumnType = (
			blockId: string,
			columnId: string,
			type: ContentType,
		) => {
			setBlocks(
				blocks.map((block) =>
					block.id === blockId
						? {
								...block,
								content: block.content.map((col) =>
									col.id === columnId
										? {
												...col,
												type,
												content: "",
												imageProps:
													type === "image"
														? {
																width: "100%",
																height: "auto",
																objectFit: "cover",
																placement: "center",
																alt: "",
																borderRadius: "0px",
															}
														: undefined,
												videoProps:
													type === "video"
														? {
																width: "100%",
																height: "auto",
																autoplay: false,
																loop: false,
																muted: false,
															}
														: undefined,
												carouselProps:
													type === "carousel"
														? {
																itemsVisible: 1,
																containerWidth: "100%",
																items: [],
															}
														: undefined,
											}
										: col,
								),
							}
						: block,
				),
			);
		};

		// Update image properties
		const updateImageProps = (
			blockId: string,
			columnId: string,
			props: Partial<ColumnContent["imageProps"]>,
		) => {
			setBlocks(
				blocks.map((block) =>
					block.id === blockId
						? {
								...block,
								content: block.content.map((col) =>
									col.id === columnId
										? {
												...col,
												imageProps: {
													...col.imageProps,
													...props,
												} as ColumnContent["imageProps"],
											}
										: col,
								),
							}
						: block,
				),
			);
		};

		// Update video properties
		const updateVideoProps = (
			blockId: string,
			columnId: string,
			props: Partial<ColumnContent["videoProps"]>,
		) => {
			setBlocks(
				blocks.map((block) =>
					block.id === blockId
						? {
								...block,
								content: block.content.map((col) =>
									col.id === columnId
										? {
												...col,
												videoProps: {
													...col.videoProps,
													...props,
												} as ColumnContent["videoProps"],
											}
										: col,
								),
							}
						: block,
				),
			);
		};

		// Update carousel properties
		const updateCarouselProps = (
			blockId: string,
			columnId: string,
			props: Partial<ColumnContent["carouselProps"]>,
		) => {
			setBlocks(
				blocks.map((block) =>
					block.id === blockId
						? {
								...block,
								content: block.content.map((col) =>
									col.id === columnId
										? {
												...col,
												carouselProps: {
													...col.carouselProps,
													...props,
												} as ColumnContent["carouselProps"],
											}
										: col,
								),
							}
						: block,
				),
			);
		};

		// Update block custom CSS
		const updateBlockCustomCSS = (blockId: string, customCSS: string) => {
			setBlocks(
				blocks.map((block) =>
					block.id === blockId ? { ...block, customCSS } : block,
				),
			);
		};

		// Update block columns
		const updateBlockColumns = (blockId: string, newColumns: number) => {
			setBlocks(
				blocks.map((block) => {
					if (block.id !== blockId) return block;

					const currentColumns = block.content.length;

					if (newColumns > currentColumns) {
						// Add new empty columns
						const newContent = [
							...block.content,
							...Array.from(
								{ length: newColumns - currentColumns },
								(_, i) => ({
									id: `col-${Date.now()}-${currentColumns + i}`,
									type: "text" as ContentType,
									content: "",
								}),
							),
						];
						return { ...block, columns: newColumns, content: newContent };
					} else if (newColumns < currentColumns) {
						// Keep only first N columns
						return {
							...block,
							columns: newColumns,
							content: block.content.slice(0, newColumns),
						};
					}

					return block;
				}),
			);
		};

		// Save page
		const savePage = async (publishStatus: "draft" | "published") => {
			try {
				setIsSaving(true);
				setError(null);
				setSuccess(null);

				if (!title.trim()) {
					throw new Error("Title is required");
				}

				if (!slug.trim()) {
					throw new Error("Slug is required");
				}

				const pageData = {
					title,
					slug,
					status: publishStatus,
					metaTitle,
					metaDescription,
					content: JSON.stringify({ blocks }),
					createdBy: 1, // TODO: Get from session
				};

				const url = pageId ? `/api/pages/${pageId}` : "/api/pages";
				const method = pageId ? "PUT" : "POST";

				const response = await fetch(url, {
					method,
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(pageData),
				});

				if (response.status === 401) {
					window.location.href = "/access-denied";
					return;
				}

				if (!response.ok) {
					const errorData = await response.json();
					throw new Error(errorData.error || "Failed to save page");
				}

				setSuccess("Page saved successfully!");
			} catch (err) {
				setError(err instanceof Error ? err.message : "Failed to save page");
			} finally {
				setIsSaving(false);
			}
		};

		// Get current expanded image column data
		const getExpandedImageColumn = () => {
			if (!expandedImageProps) return null;
			for (const block of blocks) {
				for (const column of block.content) {
					if (`${block.id}-${column.id}` === expandedImageProps) {
						return { block, column };
					}
				}
			}
			return null;
		};

		// Get current expanded video column data
		const getExpandedVideoColumn = () => {
			if (!expandedVideoProps) return null;
			for (const block of blocks) {
				for (const column of block.content) {
					if (`${block.id}-${column.id}` === expandedVideoProps) {
						return { block, column };
					}
				}
			}
			return null;
		};

		// Get current expanded carousel column data
		const getExpandedCarouselColumn = () => {
			if (!expandedCarouselProps) return null;
			for (const block of blocks) {
				for (const column of block.content) {
					if (`${block.id}-${column.id}` === expandedCarouselProps) {
						return { block, column };
					}
				}
			}
			return null;
		};

		const expandedImageData = getExpandedImageColumn();
		const expandedVideoData = getExpandedVideoColumn();
		const expandedCarouselData = getExpandedCarouselColumn();

		// Expose save function to parent
		useImperativeHandle(ref, () => ({
			savePage,
			isSaving,
			error,
			success,
		}));

		return (
			<div className="page-builder">
				{error && (
					<div className="alert-error">
						<span>{error}</span>
					</div>
				)}

				{success && (
					<div className="alert-success">
						<span>{success}</span>
					</div>
				)}

				<div className="page-builder-content">
					{/* Page Metadata */}
					<div className="page-meta-section">
						<div className="form-group">
							<label htmlFor="title" className="form-label">
								Page Title *
							</label>
							<input
								id="title"
								type="text"
								value={title}
								onChange={(e) => handleTitleChange(e.target.value)}
								className="form-input"
								placeholder="Enter page title"
								required
							/>
						</div>

						<div className="form-group">
							<label htmlFor="slug" className="form-label">
								Slug *
							</label>
							<input
								id="slug"
								type="text"
								value={slug}
								onChange={(e) => setSlug(e.target.value)}
								className="form-input"
								placeholder="page-slug"
								required
							/>
						</div>

						<div className="form-row">
							<div className="form-group">
								<label htmlFor="metaTitle" className="form-label">
									Meta Title
								</label>
								<input
									id="metaTitle"
									type="text"
									value={metaTitle}
									onChange={(e) => setMetaTitle(e.target.value)}
									className="form-input"
									placeholder="SEO title"
								/>
							</div>

							<div className="form-group">
								<label htmlFor="metaDescription" className="form-label">
									Meta Description
								</label>
								<input
									id="metaDescription"
									type="text"
									value={metaDescription}
									onChange={(e) => setMetaDescription(e.target.value)}
									className="form-input"
									placeholder="SEO description"
								/>
							</div>
						</div>
					</div>

					{/* Block Controls */}
					<div className="block-controls">
						<h3 className="block-controls-title">Add Block</h3>
						<div className="block-controls-buttons">
							<button onClick={() => addBlock(1)} className="block-control-btn">
								<div className="block-preview block-preview-1col"></div>1 Column
							</button>
							<button onClick={() => addBlock(2)} className="block-control-btn">
								<div className="block-preview block-preview-2col">
									<div></div>
									<div></div>
								</div>
								2 Columns
							</button>
							<button onClick={() => addBlock(3)} className="block-control-btn">
								<div className="block-preview block-preview-3col">
									<div></div>
									<div></div>
									<div></div>
								</div>
								3 Columns
							</button>
							<button onClick={() => addBlock(4)} className="block-control-btn">
								<div className="block-preview block-preview-4col">
									<div></div>
									<div></div>
									<div></div>
									<div></div>
								</div>
								4 Columns
							</button>
						</div>
					</div>

					{/* Blocks */}
					<div className="blocks-container">
						{blocks.length === 0 ? (
							<div className="empty-blocks">
								<Plus className="icon-lg" />
								<p>No blocks yet. Add your first block above!</p>
							</div>
						) : (
							blocks.map((block, blockIndex) => (
								<div key={block.id} className="block">
									<div className="block-header">
										<div className="block-handle">
											<GripVertical className="icon-sm" />
											<span>
												Block {blockIndex + 1} ({block.columns} columns)
											</span>
										</div>
										<div className="block-actions">
											<div className="block-column-selector">
												<span className="text-xs text-gray-600 dark:text-gray-400 mr-2">
													Columns:
												</span>
												{[1, 2, 3, 4].map((cols) => (
													<button
														key={cols}
														onClick={() => updateBlockColumns(block.id, cols)}
														className={`block-column-btn ${
															block.columns === cols ? "active" : ""
														}`}
														title={`Change to ${cols} column${cols > 1 ? "s" : ""}`}
														type="button"
													>
														{cols}
													</button>
												))}
											</div>
											<button
												onClick={() =>
													setExpandedCSSBlock(
														expandedCSSBlock === block.id ? null : block.id,
													)
												}
												className="btn-icon btn-icon-primary"
												title="Custom CSS"
												type="button"
											>
												<Code className="icon-sm" />
											</button>
											<button
												onClick={() => moveBlockUp(blockIndex)}
												className="btn-icon"
												disabled={blockIndex === 0}
												title="Move up"
												type="button"
											>
												<ChevronUp className="icon-sm" />
											</button>
											<button
												onClick={() => moveBlockDown(blockIndex)}
												className="btn-icon"
												disabled={blockIndex === blocks.length - 1}
												title="Move down"
												type="button"
											>
												<ChevronDown className="icon-sm" />
											</button>
											<button
												onClick={() => deleteBlock(block.id)}
												className="btn-icon btn-icon-danger"
												title="Delete block"
												type="button"
											>
												<Trash2 className="icon-sm" />
											</button>
										</div>
									</div>

									{expandedCSSBlock === block.id && (
										<div className="block-css-editor">
											<div className="block-css-header">
												<h4 className="block-css-title">Custom CSS</h4>
												<p className="block-css-hint">
													Add custom CSS for this block. Use .block-column to
													target columns.
												</p>
											</div>
											<textarea
												value={block.customCSS || ""}
												onChange={(e) =>
													updateBlockCustomCSS(block.id, e.target.value)
												}
												className="block-css-textarea"
												placeholder=".block-column {
  /* Your custom CSS here */
}
.block-column:not(:last-child) {
  margin-right: 16px;
}"
												spellCheck="false"
												rows={8}
											/>
										</div>
									)}

									<div
										className={`block-columns ${getBlockColumnsClass(block.columns)}`}
										style={{
											...(() => {
												if (!block.customCSS) return {};
												try {
													const style: React.CSSProperties = {};
													// Parse simple CSS properties from textarea
													const lines = block.customCSS.split("\n");
													for (const line of lines) {
														const match = line.match(
															/^\s*([a-zA-Z-]+)\s*:\s*(.+);/,
														);
														if (match) {
															const [, prop, value] = match;
															const camelCase = prop.replace(/-([a-z])/g, (g) =>
																g[1].toUpperCase(),
															);
															// eslint-disable-next-line @typescript-eslint/no-explicit-any
															(style as any)[camelCase] = value.trim();
														}
													}
													return style;
												} catch {
													return {};
												}
											})(),
										}}
									>
										{block.content.map((column, columnIndex) => (
											<div key={column.id} className="block-column">
												<div className="column-type-selector">
													<button
														onClick={() =>
															updateColumnType(block.id, column.id, "text")
														}
														className={`type-btn ${column.type === "text" ? "active" : ""}`}
														title="Text"
													>
														<Type className="icon-sm" />
													</button>
													<button
														onClick={() =>
															updateColumnType(block.id, column.id, "image")
														}
														className={`type-btn ${column.type === "image" ? "active" : ""}`}
														title="Image"
													>
														<ImageIcon className="icon-sm" />
													</button>
													<button
														onClick={() =>
															updateColumnType(block.id, column.id, "video")
														}
														className={`type-btn ${column.type === "video" ? "active" : ""}`}
														title="Video"
													>
														<Video className="icon-sm" />
													</button>
													<button
														onClick={() =>
															updateColumnType(block.id, column.id, "embed")
														}
														className={`type-btn ${column.type === "embed" ? "active" : ""}`}
														title="Embed"
													>
														<Code className="icon-sm" />
													</button>
													<button
														onClick={() =>
															updateColumnType(block.id, column.id, "carousel")
														}
														className={`type-btn ${column.type === "carousel" ? "active" : ""}`}
														title="Carousel"
													>
														<Images className="icon-sm" />
													</button>
												</div>

												<div className="column-content">
													{column.type === "text" && (
														<RichTextEditor
															content={column.content}
															onChange={(content) =>
																updateColumnContent(
																	block.id,
																	column.id,
																	content,
																)
															}
															placeholder="Enter text content..."
														/>
													)}

													{column.type === "image" && (
														<div className="space-y-4">
															<FileUploadInput
																type="image"
																value={column.content}
																onChange={(url) =>
																	updateColumnContent(block.id, column.id, url)
																}
																placeholder="Click or drag image here"
																imageProps={column.imageProps}
															/>

															{column.content && (
																<button
																	type="button"
																	onClick={() => {
																		const key = `${block.id}-${column.id}`;

																		// Initialize imageProps if not exists and toggle expanded state
																		if (!column.imageProps) {
																			setBlocks(
																				blocks.map((b) =>
																					b.id === block.id
																						? {
																								...b,
																								content: b.content.map((c) =>
																									c.id === column.id
																										? {
																												...c,
																												imageProps: {
																													width: "100%",
																													height: "auto",
																													objectFit:
																														"cover" as const,
																													placement:
																														"center" as const,
																													alt: "",
																													borderRadius: "0px",
																												},
																											}
																										: c,
																								),
																							}
																						: b,
																				),
																			);
																		}

																		setExpandedImageProps(
																			expandedImageProps === key ? null : key,
																		);
																	}}
																	className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-2 rounded flex items-center gap-2"
																	title="Toggle Image Properties"
																>
																	<Settings className="w-4 h-4" />
																	<span>Image Properties</span>
																</button>
															)}

															{column.content &&
															column.imageProps &&
															expandedImageProps === `${block.id}-${column.id}`
																? null
																: null}
														</div>
													)}

													{column.type === "video" && (
														<div className="space-y-4">
															<FileUploadInput
																type="video"
																value={column.content}
																onChange={(url) =>
																	updateColumnContent(block.id, column.id, url)
																}
																placeholder="Click or drag video here"
																videoProps={column.videoProps}
															/>

															{column.content && (
																<button
																	type="button"
																	onClick={() => {
																		const key = `${block.id}-${column.id}`;

																		// Initialize videoProps if not exists and toggle expanded state
																		if (!column.videoProps) {
																			setBlocks(
																				blocks.map((b) =>
																					b.id === block.id
																						? {
																								...b,
																								content: b.content.map((c) =>
																									c.id === column.id
																										? {
																												...c,
																												videoProps: {
																													width: "100%",
																													height: "auto",
																													autoplay: false,
																													loop: false,
																													muted: false,
																												},
																											}
																										: c,
																								),
																							}
																						: b,
																				),
																			);
																		}

																		setExpandedVideoProps(
																			expandedVideoProps === key ? null : key,
																		);
																	}}
																	className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-2 rounded flex items-center gap-2"
																	title="Toggle Video Properties"
																>
																	<Settings className="w-4 h-4" />
																	<span>Video Properties</span>
																</button>
															)}
														</div>
													)}

													{column.type === "embed" && (
														<div className="space-y-3">
															<div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-gray-50 dark:bg-[#1a1a1a]">
																<button
																	type="button"
																	onClick={() => {
																		const key = `${block.id}-${column.id}`;
																		const newExpanded = new Set(
																			expandedShortcuts,
																		);
																		if (newExpanded.has(key)) {
																			newExpanded.delete(key);
																		} else {
																			newExpanded.add(key);
																		}
																		setExpandedShortcuts(newExpanded);
																	}}
																	className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-[#252525] transition-colors"
																>
																	<label className="text-xs font-medium text-gray-700 dark:text-gray-300 cursor-pointer flex items-center gap-2">
																		<ChevronDown
																			className={`w-4 h-4 transition-transform ${
																				expandedShortcuts.has(
																					`${block.id}-${column.id}`,
																				)
																					? "rotate-180"
																					: ""
																			}`}
																		/>
																		Quick Shortcuts
																	</label>
																</button>

																{expandedShortcuts.has(
																	`${block.id}-${column.id}`,
																) && (
																	<div className="border-t border-gray-300 dark:border-gray-600 p-4">
																		<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
																			<button
																				type="button"
																				onClick={() =>
																					updateColumnContent(
																						block.id,
																						column.id,
																						column.content +
																							"\n" +
																							HTML_SNIPPETS.button +
																							"\n",
																					)
																				}
																				className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-3 py-2 rounded text-xs font-medium transition-colors"
																				title="Insert basic button"
																			>
																				Button
																			</button>
																			<button
																				type="button"
																				onClick={() =>
																					updateColumnContent(
																						block.id,
																						column.id,
																						column.content +
																							"\n" +
																							HTML_SNIPPETS.buttonPrimary +
																							"\n",
																					)
																				}
																				className="bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white px-3 py-2 rounded text-xs font-medium transition-colors"
																				title="Insert primary button"
																			>
																				Btn Primary
																			</button>
																			<button
																				type="button"
																				onClick={() =>
																					updateColumnContent(
																						block.id,
																						column.id,
																						column.content +
																							"\n" +
																							HTML_SNIPPETS.buttonSecondary +
																							"\n",
																					)
																				}
																				className="bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 text-white px-3 py-2 rounded text-xs font-medium transition-colors"
																				title="Insert secondary button"
																			>
																				Btn Secondary
																			</button>
																			<button
																				type="button"
																				onClick={() =>
																					updateColumnContent(
																						block.id,
																						column.id,
																						column.content +
																							"\n" +
																							HTML_SNIPPETS.row +
																							"\n",
																					)
																				}
																				className="bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 text-white px-3 py-2 rounded text-xs font-medium transition-colors"
																				title="Insert 2-column row"
																			>
																				Row
																			</button>
																			<button
																				type="button"
																				onClick={() =>
																					updateColumnContent(
																						block.id,
																						column.id,
																						column.content +
																							"\n" +
																							HTML_SNIPPETS.card +
																							"\n",
																					)
																				}
																				className="bg-pink-500 hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-700 text-white px-3 py-2 rounded text-xs font-medium transition-colors"
																				title="Insert card"
																			>
																				Card
																			</button>
																			<button
																				type="button"
																				onClick={() =>
																					updateColumnContent(
																						block.id,
																						column.id,
																						column.content +
																							"\n" +
																							HTML_SNIPPETS.cardWithImage +
																							"\n",
																					)
																				}
																				className="bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white px-3 py-2 rounded text-xs font-medium transition-colors"
																				title="Insert card with image"
																			>
																				Card + Img
																			</button>
																			<button
																				type="button"
																				onClick={() =>
																					updateColumnContent(
																						block.id,
																						column.id,
																						column.content +
																							"\n" +
																							HTML_SNIPPETS.twoColumnLayout +
																							"\n",
																					)
																				}
																				className="bg-teal-500 hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700 text-white px-3 py-2 rounded text-xs font-medium transition-colors"
																				title="Insert 2-column layout"
																			>
																				2-Col Layout
																			</button>
																			<button
																				type="button"
																				onClick={() =>
																					updateColumnContent(
																						block.id,
																						column.id,
																						column.content +
																							"\n" +
																							HTML_SNIPPETS.threeColumnLayout +
																							"\n",
																					)
																				}
																				className="bg-cyan-500 hover:bg-cyan-600 dark:bg-cyan-600 dark:hover:bg-cyan-700 text-white px-3 py-2 rounded text-xs font-medium transition-colors"
																				title="Insert 3-column layout"
																			>
																				3-Col Layout
																			</button>
																			<button
																				type="button"
																				onClick={() =>
																					updateColumnContent(
																						block.id,
																						column.id,
																						column.content +
																							"\n" +
																							HTML_SNIPPETS.hero +
																							"\n",
																					)
																				}
																				className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white px-3 py-2 rounded text-xs font-medium transition-colors"
																				title="Insert hero section"
																			>
																				Hero
																			</button>
																			<button
																				type="button"
																				onClick={() =>
																					updateColumnContent(
																						block.id,
																						column.id,
																						column.content +
																							"\n" +
																							HTML_SNIPPETS.alert +
																							"\n",
																					)
																				}
																				className="bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white px-3 py-2 rounded text-xs font-medium transition-colors"
																				title="Insert alert box"
																			>
																				Alert
																			</button>
																			<button
																				type="button"
																				onClick={() =>
																					updateColumnContent(
																						block.id,
																						column.id,
																						column.content +
																							"\n" +
																							HTML_SNIPPETS.form +
																							"\n",
																					)
																				}
																				className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white px-3 py-2 rounded text-xs font-medium transition-colors"
																				title="Insert contact form"
																			>
																				Form
																			</button>
																			<button
																				type="button"
																				onClick={() =>
																					updateColumnContent(
																						block.id,
																						column.id,
																						column.content +
																							"\n" +
																							HTML_SNIPPETS.codeBlock +
																							"\n",
																					)
																				}
																				className="bg-slate-500 hover:bg-slate-600 dark:bg-slate-600 dark:hover:bg-slate-700 text-white px-3 py-2 rounded text-xs font-medium transition-colors"
																				title="Insert code block"
																			>
																				Code
																			</button>
																		</div>
																	</div>
																)}
															</div>
															<CodeEditor
																id={`embed-${block.id}-${column.id}`}
																value={column.content}
																onChange={(content) =>
																	updateColumnContent(
																		block.id,
																		column.id,
																		content,
																	)
																}
																placeholder="Embed code (HTML/iframe)"
															/>
														</div>
													)}

													{column.type === "carousel" && (
														<div className="carousel-container">
															{column.carouselProps &&
																column.carouselProps.items.length > 0 && (
																	<div
																		className="carousel-preview"
																		style={{
																			width:
																				column.carouselProps.containerWidth,
																		}}
																	>
																		<div className="carousel-items-display">
																			{column.carouselProps.items.map(
																				(item, idx) => (
																					<div
																						key={item.id}
																						className="carousel-item-preview"
																					>
																						{item.media &&
																							(item.media.match(
																								/\.(mp4|webm|ogg)$/,
																							) ? (
																								<video
																									src={item.media}
																									controls
																									className="carousel-media"
																								/>
																							) : (
																								<img
																									src={item.media}
																									alt={
																										item.title ||
																										`Item ${idx + 1}`
																									}
																									className="carousel-media"
																								/>
																							))}
																						{item.title && (
																							<div className="carousel-title">
																								{item.title}
																							</div>
																						)}
																						{item.subtitle && (
																							<div className="carousel-subtitle">
																								{item.subtitle}
																							</div>
																						)}
																					</div>
																				),
																			)}
																		</div>
																	</div>
																)}

															<div className="flex gap-2 mb-4">
																<button
																	type="button"
																	onClick={() =>
																		setExpandedCarouselProps(
																			expandedCarouselProps ===
																				`${block.id}-${column.id}`
																				? null
																				: `${block.id}-${column.id}`,
																		)
																	}
																	className="bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white px-3 py-2 rounded flex items-center gap-2"
																	title="Toggle Carousel Properties"
																>
																	<Settings className="w-4 h-4" />
																	<span>Settings</span>
																</button>
																<button
																	type="button"
																	onClick={() => {
																		const newItem: CarouselItem = {
																			id: Date.now().toString(),
																			media: "",
																		};
																		updateCarouselProps(block.id, column.id, {
																			items: [
																				...(column.carouselProps?.items || []),
																				newItem,
																			],
																		});
																	}}
																	className="bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700 text-white px-3 py-2 rounded flex items-center gap-2"
																	title="Add carousel item"
																>
																	<Plus className="w-4 h-4" />
																	<span>Add Item</span>
																</button>
															</div>

															{column.carouselProps && (
																<div className="space-y-2 border-t pt-4">
																	{column.carouselProps.items.map(
																		(item, idx) => {
																			const isExpanded =
																				expandedCarouselItems.has(
																					`${block.id}-${column.id}-${item.id}`,
																				);
																			return (
																				<div
																					key={item.id}
																					className="border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-[#1e1e1e] overflow-hidden"
																				>
																					<button
																						type="button"
																						onClick={() => {
																							const key = `${block.id}-${column.id}-${item.id}`;
																							const newExpanded = new Set(
																								expandedCarouselItems,
																							);
																							if (isExpanded) {
																								newExpanded.delete(key);
																							} else {
																								newExpanded.add(key);
																							}
																							setExpandedCarouselItems(
																								newExpanded,
																							);
																						}}
																						className="w-full px-3 py-2 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition-colors"
																					>
																						<div className="flex items-center gap-2 flex-1 text-left">
																							<ChevronDown
																								className={`w-4 h-4 transition-transform ${
																									isExpanded ? "rotate-180" : ""
																								}`}
																							/>
																							<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
																								Item {idx + 1}
																								{item.title &&
																									` - ${item.title}`}
																							</span>
																						</div>
																						<button
																							type="button"
																							onClick={(e) => {
																								e.stopPropagation();
																								updateCarouselProps(
																									block.id,
																									column.id,
																									{
																										items:
																											column?.carouselProps?.items.filter(
																												(i) => i.id !== item.id,
																											),
																									},
																								);
																							}}
																							className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1"
																						>
																							<Trash2 className="w-3 h-3" />
																							Delete
																						</button>
																					</button>

																					{isExpanded && (
																						<div className="px-3 pb-3 pt-0 border-t border-gray-300 dark:border-gray-600 space-y-3">
																							<div>
																								<label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
																									Media (Photo/Video)
																								</label>
																								<FileUploadInput
																									type={
																										item.media.match(
																											/\.(mp4|webm|ogg)$/,
																										)
																											? "video"
																											: "image"
																									}
																									value={item.media}
																									onChange={(url) => {
																										const updatedItems =
																											column?.carouselProps?.items.map(
																												(i) =>
																													i.id === item.id
																														? {
																																...i,
																																media: url,
																															}
																														: i,
																											);
																										updateCarouselProps(
																											block.id,
																											column.id,
																											{ items: updatedItems },
																										);
																									}}
																									placeholder="Click or drag file here"
																								/>
																								{item.media && (
																									<div className="mt-2">
																										{item.media.match(
																											/\.(mp4|webm|ogg)$/,
																										) ? (
																											<video
																												src={item.media}
																												controls
																												className="w-full max-w-xs rounded max-h-32"
																											/>
																										) : (
																											<img
																												src={item.media}
																												alt={
																													item.title || "Item"
																												}
																												className="w-auto max-w-xs rounded max-h-32 object-cover"
																											/>
																										)}
																									</div>
																								)}
																							</div>

																							<div>
																								<label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
																									Title
																								</label>
																								<input
																									type="text"
																									value={item.title || ""}
																									onChange={(e) => {
																										const updatedItems =
																											column?.carouselProps?.items.map(
																												(i) =>
																													i.id === item.id
																														? {
																																...i,
																																title:
																																	e.target
																																		.value,
																															}
																														: i,
																											);
																										updateCarouselProps(
																											block.id,
																											column.id,
																											{ items: updatedItems },
																										);
																									}}
																									placeholder="Item title"
																									className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-[#2a2a2a] text-gray-900 dark:text-white"
																								/>
																							</div>

																							<div>
																								<label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
																									Subtitle
																								</label>
																								<input
																									type="text"
																									value={item.subtitle || ""}
																									onChange={(e) => {
																										const updatedItems =
																											column?.carouselProps?.items.map(
																												(i) =>
																													i.id === item.id
																														? {
																																...i,
																																subtitle:
																																	e.target
																																		.value,
																															}
																														: i,
																											);
																										updateCarouselProps(
																											block.id,
																											column.id,
																											{ items: updatedItems },
																										);
																									}}
																									placeholder="Item subtitle"
																									className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-[#2a2a2a] text-gray-900 dark:text-white"
																								/>
																							</div>

																							<div>
																								<label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
																									Click Link
																								</label>
																								<input
																									type="url"
																									value={item.link || ""}
																									onChange={(e) => {
																										const updatedItems =
																											column?.carouselProps?.items.map(
																												(i) =>
																													i.id === item.id
																														? {
																																...i,
																																link: e.target
																																	.value,
																															}
																														: i,
																											);
																										updateCarouselProps(
																											block.id,
																											column.id,
																											{ items: updatedItems },
																										);
																									}}
																									placeholder="https://example.com"
																									className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-[#2a2a2a] text-gray-900 dark:text-white"
																								/>
																							</div>
																						</div>
																					)}
																				</div>
																			);
																		},
																	)}
																</div>
															)}
														</div>
													)}
												</div>
											</div>
										))}
									</div>
								</div>
							))
						)}
					</div>
				</div>

				{/* Image Properties Modal */}
				{expandedImageData && expandedImageData.column.imageProps && (
					<div
						className="modal-overlay"
						onClick={() => setExpandedImageProps(null)}
					>
						<div className="modal-content" onClick={(e) => e.stopPropagation()}>
							<div className="modal-header">
								<h3 className="modal-title">Image Properties</h3>
								<button
									onClick={() => setExpandedImageProps(null)}
									className="modal-close-btn"
									title="Close"
								>
									<svg
										className="w-6 h-6"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								</button>
							</div>

							<div className="modal-body space-y-4">
								<div className="form-row">
									<div className="form-group flex-1">
										<label className="form-label">Width</label>
										<input
											type="text"
											value={expandedImageData.column.imageProps.width}
											onChange={(e) =>
												updateImageProps(
													expandedImageData.block.id,
													expandedImageData.column.id,
													{
														width: e.target.value,
													},
												)
											}
											className="form-input"
											placeholder="100% or 300px"
										/>
									</div>

									<div className="form-group flex-1">
										<label className="form-label">Height</label>
										<input
											type="text"
											value={expandedImageData.column.imageProps.height}
											onChange={(e) =>
												updateImageProps(
													expandedImageData.block.id,
													expandedImageData.column.id,
													{
														height: e.target.value,
													},
												)
											}
											className="form-input"
											placeholder="auto or 300px"
										/>
									</div>
								</div>

								<div className="form-group">
									<label className="form-label">Object Fit</label>
									<select
										value={expandedImageData.column.imageProps.objectFit}
										onChange={(e) =>
											updateImageProps(
												expandedImageData.block.id,
												expandedImageData.column.id,
												{
													objectFit: e.target.value as
														| "cover"
														| "contain"
														| "fill"
														| "scale-down",
												},
											)
										}
										className="form-input"
									>
										<option value="cover">Cover</option>
										<option value="contain">Contain</option>
										<option value="fill">Fill</option>
										<option value="scale-down">Scale Down</option>
									</select>
								</div>

								<div className="form-group">
									<label className="form-label">Placement</label>
									<div className="flex gap-2">
										{["left", "center", "right"].map((placement) => (
											<button
												key={placement}
												onClick={() =>
													updateImageProps(
														expandedImageData.block.id,
														expandedImageData.column.id,
														{
															placement: placement as
																| "left"
																| "center"
																| "right",
														},
													)
												}
												className={`flex-1 py-2 px-3 rounded border transition-colors ${
													expandedImageData.column.imageProps?.placement ===
													placement
														? "bg-blue-500 text-white border-blue-600"
														: "bg-white dark:bg-[#121212] text-gray-900 dark:text-white border-gray-300 dark:border-[#525252]"
												}`}
											>
												{placement.charAt(0).toUpperCase() + placement.slice(1)}
											</button>
										))}
									</div>
								</div>

								<div className="form-group">
									<label className="form-label">Alt Text</label>
									<input
										type="text"
										value={expandedImageData.column.imageProps.alt}
										onChange={(e) =>
											updateImageProps(
												expandedImageData.block.id,
												expandedImageData.column.id,
												{
													alt: e.target.value,
												},
											)
										}
										className="form-input"
										placeholder="Describe the image"
									/>
								</div>

								<div className="form-group">
									<label className="form-label">Border Radius</label>
									<input
										type="text"
										value={expandedImageData.column.imageProps.borderRadius}
										onChange={(e) =>
											updateImageProps(
												expandedImageData.block.id,
												expandedImageData.column.id,
												{
													borderRadius: e.target.value,
												},
											)
										}
										className="form-input"
										placeholder="0px or 8px"
									/>
								</div>

								{expandedImageData.column.content && (
									<div className="image-preview p-3 border border-gray-200 dark:border-[#525252] rounded bg-gray-50 dark:bg-[#121212]">
										<p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
											Preview:
										</p>
										<img
											src={expandedImageData.column.content}
											alt={expandedImageData.column.imageProps.alt}
											style={
												{
													width: expandedImageData.column.imageProps.width,
													height: expandedImageData.column.imageProps.height,
													objectFit:
														expandedImageData.column.imageProps.objectFit,
													borderRadius:
														expandedImageData.column.imageProps.borderRadius,
													display: "block",
													margin:
														expandedImageData.column.imageProps.placement ===
														"left"
															? "0"
															: expandedImageData.column.imageProps
																		.placement === "right"
																? "0 0 0 auto"
																: "0 auto",
												} as React.CSSProperties
											}
										/>
									</div>
								)}
							</div>

							<div className="modal-footer">
								<button
									onClick={() => setExpandedImageProps(null)}
									className="flex-1 py-2 px-4 bg-gray-200 dark:bg-[#2a2a2a] text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-[#3a3a3a] transition-colors font-medium"
								>
									Close
								</button>
							</div>
						</div>
					</div>
				)}

				{/* Video Properties Modal */}
				{expandedVideoData && expandedVideoData.column.videoProps && (
					<div
						className="modal-overlay"
						onClick={() => setExpandedVideoProps(null)}
					>
						<div className="modal-content" onClick={(e) => e.stopPropagation()}>
							<div className="modal-header">
								<h3 className="modal-title">Video Properties</h3>
								<button
									onClick={() => setExpandedVideoProps(null)}
									className="modal-close-btn"
									title="Close"
								>
									<svg
										className="w-6 h-6"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								</button>
							</div>

							<div className="modal-body space-y-4">
								<div className="form-row">
									<div className="form-group flex-1">
										<label className="form-label">Width</label>
										<input
											type="text"
											value={expandedVideoData.column.videoProps.width}
											onChange={(e) =>
												updateVideoProps(
													expandedVideoData.block.id,
													expandedVideoData.column.id,
													{
														width: e.target.value,
													},
												)
											}
											className="form-input"
											placeholder="100% or 640px"
										/>
									</div>

									<div className="form-group flex-1">
										<label className="form-label">Height</label>
										<input
											type="text"
											value={expandedVideoData.column.videoProps.height}
											onChange={(e) =>
												updateVideoProps(
													expandedVideoData.block.id,
													expandedVideoData.column.id,
													{
														height: e.target.value,
													},
												)
											}
											className="form-input"
											placeholder="auto or 360px"
										/>
									</div>
								</div>

								<div className="form-group">
									<label className="flex items-center gap-2 cursor-pointer">
										<input
											type="checkbox"
											checked={expandedVideoData.column.videoProps.autoplay}
											onChange={(e) =>
												updateVideoProps(
													expandedVideoData.block.id,
													expandedVideoData.column.id,
													{
														autoplay: e.target.checked,
													},
												)
											}
											className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
										/>
										<span className="text-gray-900 dark:text-white">
											Autoplay
										</span>
									</label>
								</div>

								<div className="form-group">
									<label className="flex items-center gap-2 cursor-pointer">
										<input
											type="checkbox"
											checked={expandedVideoData.column.videoProps.loop}
											onChange={(e) =>
												updateVideoProps(
													expandedVideoData.block.id,
													expandedVideoData.column.id,
													{
														loop: e.target.checked,
													},
												)
											}
											className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
										/>
										<span className="text-gray-900 dark:text-white">Loop</span>
									</label>
								</div>

								<div className="form-group">
									<label className="flex items-center gap-2 cursor-pointer">
										<input
											type="checkbox"
											checked={expandedVideoData.column.videoProps.muted}
											onChange={(e) =>
												updateVideoProps(
													expandedVideoData.block.id,
													expandedVideoData.column.id,
													{
														muted: e.target.checked,
													},
												)
											}
											className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
										/>
										<span className="text-gray-900 dark:text-white">Muted</span>
									</label>
								</div>
							</div>

							<div className="modal-footer">
								<button
									onClick={() => setExpandedVideoProps(null)}
									className="flex-1 py-2 px-4 bg-gray-200 dark:bg-[#2a2a2a] text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-[#3a3a3a] transition-colors font-medium"
								>
									Close
								</button>
							</div>
						</div>
					</div>
				)}

				{/* Carousel Properties Modal */}
				{expandedCarouselData && expandedCarouselData.column.carouselProps && (
					<div
						className="modal-overlay"
						onClick={() => setExpandedCarouselProps(null)}
					>
						<div
							className="modal-content modal-lg"
							onClick={(e) => e.stopPropagation()}
						>
							<div className="modal-header">
								<h3 className="modal-title">Carousel Settings</h3>
								<button
									onClick={() => setExpandedCarouselProps(null)}
									className="modal-close-btn"
									title="Close"
								>
									<svg
										className="w-6 h-6"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								</button>
							</div>

							<div className="modal-body">
								<div className="space-y-4">
									{/* Items Visible */}
									<div>
										<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
											Items Visible (how many items shown at once)
										</label>
										<input
											type="number"
											min="1"
											value={
												expandedCarouselData.column.carouselProps.itemsVisible
											}
											onChange={(e) =>
												updateCarouselProps(
													expandedCarouselData.block.id,
													expandedCarouselData.column.id,
													{
														itemsVisible: Math.max(
															1,
															parseInt(e.target.value) || 1,
														),
													},
												)
											}
											className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
										/>
									</div>

									{/* Container Width */}
									<div>
										<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
											Container Width
										</label>
										<input
											type="text"
											value={
												expandedCarouselData.column.carouselProps.containerWidth
											}
											onChange={(e) =>
												updateCarouselProps(
													expandedCarouselData.block.id,
													expandedCarouselData.column.id,
													{
														containerWidth: e.target.value,
													},
												)
											}
											placeholder="e.g., 100%, 500px, 800px"
											className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
										/>
									</div>
								</div>
							</div>

							<div className="modal-footer">
								<button
									onClick={() => setExpandedCarouselProps(null)}
									className="flex-1 py-2 px-4 bg-gray-200 dark:bg-[#2a2a2a] text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-[#3a3a3a] transition-colors font-medium"
								>
									Close
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		);
	},
);

PageBuilder.displayName = "PageBuilder";

export default PageBuilder;
