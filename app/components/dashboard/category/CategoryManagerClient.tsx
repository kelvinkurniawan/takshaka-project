"use client";
import { apiFetch } from "@/lib/api-fetch";

import { useState } from "react";
import { Plus, Edit2, Trash2, X, AlertCircle } from "lucide-react";

interface Category {
	id: number;
	name: string;
	slug: string;
	description: string | null;
	created_at: string;
	updated_at: string;
}

interface UserSession {
	id: number;
	role: string;
}

interface CategoryManagerClientProps {
	initialCategories: Category[];
	user: UserSession;
}

export default function CategoryManagerClient({
	initialCategories,
	user,
}: CategoryManagerClientProps) {
	const [categories, setCategories] = useState<Category[]>(initialCategories);
	const [showModal, setShowModal] = useState(false);
	const [isModalFading, setIsModalFading] = useState(false);
	const [editingId, setEditingId] = useState<number | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

	const [formData, setFormData] = useState({
		name: "",
		slug: "",
		description: "",
	});

	// Generate slug from name
	const generateSlug = (name: string) => {
		return name
			.toLowerCase()
			.replace(/[^\w\s-]/g, "")
			.replace(/\s+/g, "-")
			.replace(/--+/g, "-");
	};

	// Handle form input change
	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		// Auto-generate slug when name changes
		if (name === "name") {
			setFormData((prev) => ({
				...prev,
				slug: generateSlug(value),
			}));
		}
	};

	// Handle form submission (Create or Update)
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError(null);

		try {
			const url = editingId
				? `/api/categories/${editingId}`
				: "/api/categories";
			const method = editingId ? "PUT" : "POST";

			const response = await apiFetch(url, {
				method,
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			if (response.status === 401) {
				window.location.href = "/access-denied";
				return;
			}

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Failed to save category");
			}

			// Refresh categories list
			const refreshResponse = await apiFetch("/api/categories", {
				method: "GET",
				credentials: "include",
			});

			if (refreshResponse.ok) {
				const data = await refreshResponse.json();
				setCategories(data);
			}

			closeModal();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Error saving category");
		} finally {
			setIsSubmitting(false);
		}
	};

	// Open modal for creating new category
	const openNewModal = () => {
		setEditingId(null);
		setFormData({ name: "", slug: "", description: "" });
		setShowModal(true);
		setError(null);
	};

	// Open modal for editing category
	const openEditModal = (category: Category) => {
		setEditingId(category.id);
		setFormData({
			name: category.name,
			slug: category.slug,
			description: category.description || "",
		});
		setShowModal(true);
		setError(null);
	};

	// Close modal
	const closeModal = () => {
		setIsModalFading(true);
		setTimeout(() => {
			setShowModal(false);
			setIsModalFading(false);
			setEditingId(null);
			setFormData({ name: "", slug: "", description: "" });
			setError(null);
		}, 200);
	};

	// Handle delete category
	const handleDelete = async (id: number) => {
		setIsSubmitting(true);
		setError(null);

		try {
			const response = await apiFetch(`/api/categories/${id}`, {
				method: "DELETE",
				credentials: "include",
			});

			if (response.status === 401) {
				window.location.href = "/access-denied";
				return;
			}

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Failed to delete category");
			}

			// Refresh categories list
			const refreshResponse = await apiFetch("/api/categories", {
				method: "GET",
				credentials: "include",
			});

			if (refreshResponse.ok) {
				const data = await refreshResponse.json();
				setCategories(data);
			}

			setDeleteConfirm(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Error deleting category");
		} finally {
			setIsSubmitting(false);
		}
	};

	// Check if user can edit
	const canEdit = user && (user.role === "admin" || user.role === "editor");

	// Check if user can delete
	const canDelete = user && user.role === "admin";

	return (
		<div className="space-y-6">
			{/* Header Section */}
			<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold text-gray-900 dark:text-[#e5e5e5]">
						Categories
					</h1>
					<p className="text-secondary text-sm font-medium mt-1">
						Manage your content categories here
					</p>
				</div>
				{canEdit && (
					<button
						onClick={openNewModal}
						className="btn-solid flex items-center gap-2 w-fit"
					>
						<Plus className="w-5 h-5" />
						New Category
					</button>
				)}
			</div>

			{/* Error Alert */}
			{error && (
				<div className="alert-error">
					<AlertCircle className="w-5 h-5 flex-shrink-0" />
					<span>{error}</span>
				</div>
			)}

			{/* Categories Table */}
			<div className="card-modern">
				{categories.length === 0 ? (
					<div className="text-center py-16 px-6">
						<div className="inline-flex items-center justify-center w-12 h-12 bg-secondary rounded-lg mb-4">
							<Plus className="w-6 h-6 text-secondary" />
						</div>
						<p className="text-secondary font-medium mb-4">
							No categories found. Get started by creating your first
						</p>
						{canEdit && (
							<button onClick={openNewModal} className="btn-solid text-sm">
								Create Category
							</button>
						)}
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="table-modern">
							<thead>
								<tr>
									<th>Name</th>
									<th>Slug</th>
									<th>Description</th>
									<th>Created</th>
									<th className="text-right">Actions</th>
								</tr>
							</thead>
							<tbody>
								{categories.map((category) => (
									<tr key={category.id}>
										<td className="font-medium text-gray-900 dark:text-[#e5e5e5]">
											{category.name}
										</td>
										<td>
											<code className="bg-secondary px-2 py-1 rounded text-xs text-gray-900 dark:text-[#e5e5e5]">
												{category.slug}
											</code>
										</td>
										<td className="text-secondary">
											{category.description || "-"}
										</td>
										<td className="text-secondary text-sm">
											{new Date(category.created_at).toLocaleDateString(
												"id-ID",
											)}
										</td>
										<td className="text-right">
											<div className="flex items-center justify-end gap-1">
												{canEdit && (
													<button
														onClick={() => openEditModal(category)}
														className="btn-icon btn-icon-primary"
														title="Edit"
													>
														<Edit2 className="w-4 h-4" />
													</button>
												)}
												{canDelete && (
													<button
														onClick={() => setDeleteConfirm(category.id)}
														className="btn-icon btn-icon-danger"
														title="Delete"
													>
														<Trash2 className="w-4 h-4" />
													</button>
												)}
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>

			{/* Add/Edit Modal */}
			{showModal && (
				<div
					className={`modal-overlay ${isModalFading ? "modal-fade-out" : ""}`}
				>
					<div className="modal-content card-modern max-w-md">
						{/* Modal Header */}
						<div className="flex items-center justify-between p-6 border-b border-primary">
							<h2 className="text-xl font-bold text-gray-900 dark:text-[#e5e5e5]">
								{editingId ? "Edit Kategori" : "Kategori Baru"}
							</h2>
							<button
								onClick={closeModal}
								className="btn-icon hover:bg-secondary"
								disabled={isSubmitting}
							>
								<X className="w-5 h-5 text-secondary" />
							</button>
						</div>

						{/* Modal Error Alert */}
						{error && (
							<div className="alert-error mx-6 mt-6">
								<AlertCircle className="w-5 h-5 flex-shrink-0" />
								<span className="text-sm">{error}</span>
							</div>
						)}

						{/* Form */}
						<form onSubmit={handleSubmit} className="space-y-4 p-6">
							{/* Name Field */}
							<div>
								<label className="block text-sm font-medium text-gray-900 dark:text-[#e5e5e5] mb-2">
									Category Name *
								</label>
								<input
									type="text"
									name="name"
									value={formData.name}
									onChange={handleInputChange}
									placeholder="Example: Technology"
									className="input-modern w-full"
									required
									disabled={isSubmitting}
								/>
							</div>

							{/* Slug Field */}
							<div>
								<label className="block text-sm font-medium text-gray-900 dark:text-[#e5e5e5] mb-2">
									Slug *
								</label>
								<input
									type="text"
									name="slug"
									value={formData.slug}
									onChange={handleInputChange}
									placeholder="Automatically generated"
									className="input-modern w-full"
									required
									disabled={isSubmitting}
								/>
								<p className="text-xs text-secondary mt-1">
									URL-friendly identifier
								</p>
							</div>

							{/* Description Field */}
							<div>
								<label className="block text-sm font-medium text-gray-900 dark:text-[#e5e5e5] mb-2">
									Description
								</label>
								<textarea
									name="description"
									value={formData.description}
									onChange={handleInputChange}
									placeholder="Short description..."
									className="textarea-modern w-full"
									rows={3}
									disabled={isSubmitting}
								/>
							</div>

							{/* Modal Footer */}
							<div className="flex gap-3 justify-end pt-4 border-t border-primary">
								<button
									type="button"
									onClick={closeModal}
									className="btn-ghost"
									disabled={isSubmitting}
								>
									Cancel
								</button>
								<button
									type="submit"
									className="btn-solid"
									disabled={isSubmitting}
								>
									{isSubmitting
										? editingId
											? "Updating..."
											: "Creating..."
										: editingId
											? "Update"
											: "Create"}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* Delete Confirmation Modal */}
			{deleteConfirm !== null && (
				<div className="modal-overlay">
					<div className="modal-content card-modern max-w-sm">
						{/* Modal Header */}
						<div className="flex items-center justify-between p-6 border-b border-red-200 dark:border-red-900/30">
							<h2 className="text-lg font-bold text-red-600 dark:text-red-400">
								Delete Category?
							</h2>
							<button
								onClick={() => setDeleteConfirm(null)}
								className="btn-icon hover:bg-secondary"
								disabled={isSubmitting}
							>
								<X className="w-5 h-5 text-secondary" />
							</button>
						</div>

						{/* Content */}
						<div className="p-6">
							<p className="text-secondary font-medium">
								Are you sure you want to delete this category? This action
								cannot be undone.
							</p>
						</div>

						{/* Footer */}
						<div className="flex gap-3 justify-end p-6 border-t border-primary">
							<button
								onClick={() => setDeleteConfirm(null)}
								className="btn-ghost"
								disabled={isSubmitting}
							>
								Cancel
							</button>
							<button
								onClick={() => handleDelete(deleteConfirm)}
								className="btn-danger"
								disabled={isSubmitting}
							>
								{isSubmitting ? "Deleting..." : "Delete"}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
