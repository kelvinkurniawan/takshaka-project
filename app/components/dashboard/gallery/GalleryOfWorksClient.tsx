"use client";

import { useState } from "react";
import { Plus, Trash2, AlertCircle, Edit2 } from "lucide-react";
import type { InferSelectModel } from "drizzle-orm";
import { galleryCategories, galleryOfWorks } from "@/lib/schema";
import FileUploadInput from "@/app/components/FileUploadInput";

type Category = InferSelectModel<typeof galleryCategories>;
type GalleryItem = InferSelectModel<typeof galleryOfWorks>;

interface GalleryOfWorksClientProps {
	initialCategories: Category[];
	initialItems: GalleryItem[];
}

export default function GalleryOfWorksClient({
	initialCategories,
	initialItems,
}: GalleryOfWorksClientProps) {
	const [categories, setCategories] = useState(initialCategories);
	const [items, setItems] = useState(initialItems);
	const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [showCategoryForm, setShowCategoryForm] = useState(false);
	const [showItemForm, setShowItemForm] = useState(false);
	const [editingCategory, setEditingCategory] = useState<Category | null>(null);

	const filteredItems = selectedCategory
		? items.filter((item) => item.categoryId === selectedCategory)
		: [];

	return (
		<div className="space-y-6">
			{/* Error Alert */}
			{error && (
				<div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg flex items-start gap-3">
					<AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
					<div>
						<p className="font-medium">{error}</p>
					</div>
				</div>
			)}

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Categories Panel */}
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<h2 className="text-lg font-semibold text-gray-900 dark:text-[#e5e5e5]">
							Categories
						</h2>
						<button
							onClick={() => setShowCategoryForm(!showCategoryForm)}
							className="inline-flex items-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white text-sm font-medium rounded-lg transition-colors"
						>
							<Plus className="w-4 h-4" />
						</button>
					</div>

					{showCategoryForm && (
						<CategoryForm
							initialData={editingCategory}
							onClose={() => {
								setShowCategoryForm(false);
								setEditingCategory(null);
							}}
							onSuccess={(cat) => {
								if (editingCategory) {
									setCategories(
										categories.map((c) => (c.id === cat.id ? cat : c))
									);
								} else {
									setCategories([...categories, cat]);
								}
								setShowCategoryForm(false);
								setEditingCategory(null);
								setError(null);
							}}
							setError={setError}
						/>
					)}

					{/* Categories List */}
					{categories.length === 0 ? (
						<div className="card-modern p-6 text-center bg-surface dark:bg-[#323232]">
							<p className="text-secondary dark:text-[#929292]">
								No categories yet
							</p>
						</div>
					) : (
						<div className="space-y-2">
							{categories.map((cat) => (
								<div
									key={cat.id}
									className={`p-4 card-modern transition-all flex items-center justify-between gap-2 ${
										selectedCategory === cat.id
											? "bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 dark:border-blue-500"
											: "bg-surface dark:bg-[#323232] hover:shadow-md"
									}`}
								>
									<button
										onClick={() => setSelectedCategory(cat.id)}
										className="flex-1 text-left"
									>
										<h3 className="font-semibold text-gray-900 dark:text-[#e5e5e5]">
											{cat.name}
										</h3>
										<p className="text-xs text-secondary dark:text-[#929292] mt-1">
											{cat.slug}
										</p>
										<p className="text-xs text-muted dark:text-[#727272] mt-2">
											{items.filter((i) => i.categoryId === cat.id).length} items
										</p>
									</button>
									<div className="flex items-center gap-1 flex-shrink-0">
										<button
											onClick={() => {
												setEditingCategory(cat);
												setShowCategoryForm(true);
											}}
											className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg transition-colors"
											title="Edit category"
										>
											<Edit2 className="w-4 h-4" />
										</button>
										<button
											onClick={() => {
												if (
													confirm(
														"Delete this category? Its items will be kept as orphaned items."
													)
												) {
													(async () => {
														try {
															const res = await fetch(
																"/api/admin/gallery/categories",
																{
																	method: "DELETE",
																	headers: {
																		"Content-Type": "application/json",
																	},
																	body: JSON.stringify({ id: cat.id }),
																}
															);
															if (!res.ok) throw new Error("Failed to delete");
															setCategories(
																categories.filter((c) => c.id !== cat.id)
															);
															if (selectedCategory === cat.id) {
																setSelectedCategory(null);
															}
														} catch (err) {
															setError(
																err instanceof Error
																	? err.message
																	: "An error occurred"
															);
														}
													})();
												}
											}}
											className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg transition-colors"
											title="Delete category"
										>
											<Trash2 className="w-4 h-4" />
										</button>
									</div>
								</div>
							))}
						</div>
					)}
				</div>

				{/* Items Panel */}
				<div className="lg:col-span-2 space-y-4">
					{selectedCategory ? (
						<>
							<div className="flex items-center justify-between">
								<h2 className="text-lg font-semibold text-gray-900 dark:text-[#e5e5e5]">
									Gallery Items
									<span className="text-secondary dark:text-[#929292] text-sm font-normal ml-2">
										({filteredItems.length})
									</span>
								</h2>
								<button
									onClick={() => setShowItemForm(!showItemForm)}
									className="inline-flex items-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white text-sm font-medium rounded-lg transition-colors"
								>
									<Plus className="w-4 h-4" />
									Add Item
								</button>
							</div>

							{showItemForm && (
								<ItemForm
									categoryId={selectedCategory}
									onClose={() => setShowItemForm(false)}
									onSuccess={(item) => {
										setItems([...items, item]);
										setShowItemForm(false);
										setError(null);
									}}
									setError={setError}
								/>
							)}

							{filteredItems.length === 0 ? (
								<div className="card-modern p-8 text-center bg-surface dark:bg-[#323232]">
									<p className="text-secondary dark:text-[#929292]">
										No items in this category yet
									</p>
								</div>
							) : (
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{filteredItems.map((item) => (
										<ItemCard
											key={item.id}
											item={item}
											onDelete={() => {
												setItems(items.filter((i) => i.id !== item.id));
											}}
										/>
									))}
								</div>
							)}
						</>
					) : (
						<div className="card-modern p-12 text-center bg-surface dark:bg-[#323232]">
							<p className="text-secondary dark:text-[#929292] mb-2">
								Select a category first
							</p>
							<p className="text-sm text-muted dark:text-[#727272]">
								Choose a category from the left panel to view and manage its
								items
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

function CategoryForm({
	initialData,
	onClose,
	onSuccess,
	setError,
}: {
	initialData?: Category | null;
	onClose: () => void;
	onSuccess: (cat: Category) => void;
	setError: (error: string | null) => void;
}) {
	const [formData, setFormData] = useState({
		name: initialData?.name || "",
		slug: initialData?.slug || "",
		displayOrder: initialData?.displayOrder || 0,
	});
	const [loading, setLoading] = useState(false);

	const generateSlug = (name: string) => {
		return name
			.toLowerCase()
			.trim()
			.replace(/[^\w\s-]/g, "")
			.replace(/\s+/g, "-")
			.replace(/-+/g, "-");
	};

	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const name = e.target.value;
		setFormData({
			...formData,
			name,
			slug: generateSlug(name),
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const method = initialData ? "PUT" : "POST";
			const url = "/api/admin/gallery/categories";
			const body = initialData
				? { id: initialData.id, ...formData }
				: formData;

			const res = await fetch(url, {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});

			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(errorData.error || "Failed to save category");
			}

			const newCategory = await res.json();
			onSuccess(newCategory);
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
		} finally {
			setLoading(false);
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="card-modern p-4 space-y-3 bg-surface dark:bg-[#323232] border-2 border-blue-500 dark:border-blue-500"
		>
			<h3 className="text-sm font-semibold text-gray-900 dark:text-[#e5e5e5]">
				{initialData ? "Edit Category" : "Add New Category"}
			</h3>

			<div>
				<label className="block text-xs font-semibold text-gray-900 dark:text-[#e5e5e5] mb-1">
					Name
				</label>
				<input
					type="text"
					value={formData.name}
					onChange={handleNameChange}
					className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-[#424242] bg-white dark:bg-[#424242] text-gray-900 dark:text-[#e5e5e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					placeholder="Meeting"
					required
				/>
			</div>

			<div>
				<label className="block text-xs font-semibold text-gray-900 dark:text-[#e5e5e5] mb-1">
					Slug (auto-filled)
				</label>
				<input
					type="text"
					value={formData.slug}
					onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
					className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-[#424242] bg-white dark:bg-[#424242] text-gray-900 dark:text-[#e5e5e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					required
				/>
			</div>

			<div className="flex gap-2">
				<button
					type="submit"
					disabled={loading}
					className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
				>
					{loading ? "Saving..." : initialData ? "Update" : "Create"}
				</button>
				<button
					type="button"
					onClick={onClose}
					className="flex-1 px-3 py-2 bg-gray-200 dark:bg-[#424242] text-gray-900 dark:text-[#e5e5e5] text-sm font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-[#525252] transition-colors"
				>
					Cancel
				</button>
			</div>
		</form>
	);
}

function ItemForm({
	categoryId,
	onClose,
	onSuccess,
	setError,
}: {
	categoryId: number;
	onClose: () => void;
	onSuccess: (item: GalleryItem) => void;
	setError: (error: string | null) => void;
}) {
	const [formData, setFormData] = useState({
		categoryId,
		title: "",
		subtitle: "",
		description: "",
		imageUrl: "",
		slug: "",
		displayOrder: 0,
	});
	const [loading, setLoading] = useState(false);

	const generateSlug = (title: string) => {
		return title
			.toLowerCase()
			.trim()
			.replace(/[^\w\s-]/g, "")
			.replace(/\s+/g, "-")
			.replace(/-+/g, "-");
	};

	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const title = e.target.value;
		setFormData({
			...formData,
			title,
			slug: generateSlug(title),
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const res = await fetch("/api/admin/gallery/items", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});

			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(errorData.error || "Failed to create item");
			}

			const newItem = await res.json();
			onSuccess(newItem);
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
		} finally {
			setLoading(false);
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="card-modern p-4 space-y-3 bg-surface dark:bg-[#323232] border-2 border-blue-500 dark:border-blue-500"
		>
			<div>
				<label className="block text-xs font-semibold text-gray-900 dark:text-[#e5e5e5] mb-1">
					Title
				</label>
				<input
					type="text"
					value={formData.title}
					onChange={handleTitleChange}
					className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-[#424242] bg-white dark:bg-[#424242] text-gray-900 dark:text-[#e5e5e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					placeholder="Our Ocean Conference"
					required
				/>
			</div>

			<div>
				<label className="block text-xs font-semibold text-gray-900 dark:text-[#e5e5e5] mb-1">
					Subtitle
				</label>
				<input
					type="text"
					value={formData.subtitle}
					onChange={(e) =>
						setFormData({ ...formData, subtitle: e.target.value })
					}
					className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-[#424242] bg-white dark:bg-[#424242] text-gray-900 dark:text-[#e5e5e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					placeholder="Meeting & Conference"
				/>
			</div>

			<div>
				<label className="block text-xs font-semibold text-gray-900 dark:text-[#e5e5e5] mb-2">
					Image (JPG, PNG, WebP)
				</label>
				<FileUploadInput
					type="image"
					value={formData.imageUrl}
					onChange={(url) => setFormData({ ...formData, imageUrl: url })}
				/>
			</div>

			<div>
				<label className="block text-xs font-semibold text-gray-900 dark:text-[#e5e5e5] mb-1">
					Slug (auto-filled)
				</label>
				<input
					type="text"
					value={formData.slug}
					onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
					className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-[#424242] bg-white dark:bg-[#424242] text-gray-900 dark:text-[#e5e5e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					required
				/>
			</div>

			<div className="flex gap-2">
				<button
					type="submit"
					disabled={loading}
					className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
				>
					{loading ? "Saving..." : "Save"}
				</button>
				<button
					type="button"
					onClick={onClose}
					className="flex-1 px-3 py-2 bg-gray-200 dark:bg-[#424242] text-gray-900 dark:text-[#e5e5e5] text-sm font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-[#525252] transition-colors"
				>
					Cancel
				</button>
			</div>
		</form>
	);
}

function ItemCard({
	item,
	onDelete,
}: {
	item: GalleryItem;
	onDelete: () => void;
}) {
	const [deleteLoading, setDeleteLoading] = useState(false);

	const handleDelete = async () => {
		if (!confirm("Delete this item?")) return;

		setDeleteLoading(true);
		try {
			const res = await fetch("/api/admin/gallery/items", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id: item.id }),
			});

			if (!res.ok) throw new Error("Failed to delete");
			onDelete();
		} catch (err) {
			alert(err instanceof Error ? err.message : "An error occurred");
		} finally {
			setDeleteLoading(false);
		}
	};

	return (
		<div className="card-modern overflow-hidden bg-surface dark:bg-[#323232] hover:shadow-lg transition-shadow">
			<div className="aspect-square bg-gray-200 dark:bg-[#424242] overflow-hidden">
				{item.imageUrl && (
					<img
						src={item.imageUrl}
						alt={item.title}
						className="w-full h-full object-cover"
					/>
				)}
			</div>
			<div className="p-4 space-y-2">
				<h3 className="font-semibold text-gray-900 dark:text-[#e5e5e5] truncate">
					{item.title}
				</h3>
				{item.subtitle && (
					<p className="text-xs text-secondary dark:text-[#929292]">
						{item.subtitle}
					</p>
				)}
				<div className="flex justify-end pt-2 border-t border-gray-200 dark:border-[#424242]">
					<button
						onClick={handleDelete}
						disabled={deleteLoading}
						className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
					>
						<Trash2 className="w-4 h-4" />
					</button>
				</div>
			</div>
		</div>
	);
}
