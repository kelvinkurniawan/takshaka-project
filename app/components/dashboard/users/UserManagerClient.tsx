"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, X, AlertCircle } from "lucide-react";

interface User {
	id: number;
	name: string;
	email: string;
	role: string;
	createdAt: string;
}

interface UserSession {
	id: number;
	role: string;
}

interface UserManagerClientProps {
	initialUsers: User[];
	user: UserSession;
}

export default function UserManagerClient({
	initialUsers,
	user,
}: UserManagerClientProps) {
	const [users, setUsers] = useState<User[]>(initialUsers);
	const [showModal, setShowModal] = useState(false);
	const [isModalFading, setIsModalFading] = useState(false);
	const [editingId, setEditingId] = useState<number | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		role: "editor" as "admin" | "editor" | "viewer",
	});

	// Handle form input change
	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	// Handle form submission (Create or Update)
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError(null);

		try {
			const url = editingId ? `/api/users/${editingId}` : "/api/users";
			const method = editingId ? "PUT" : "POST";

			const submitData = editingId
				? { name: formData.name, email: formData.email, role: formData.role }
				: formData;

			const response = await fetch(url, {
				method,
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(submitData),
			});

			if (response.status === 401) {
				window.location.href = "/access-denied";
				return;
			}

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Failed to save user");
			}

			// Refresh users list
			const refreshResponse = await fetch("/api/users", {
				method: "GET",
				credentials: "include",
			});

			if (refreshResponse.ok) {
				const data = await refreshResponse.json();
				setUsers(data);
			}

			closeModal();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Error saving user");
		} finally {
			setIsSubmitting(false);
		}
	};

	// Open modal for creating new user
	const openNewModal = () => {
		setEditingId(null);
		setFormData({ name: "", email: "", password: "", role: "editor" });
		setShowModal(true);
		setError(null);
	};

	// Open modal for editing user
	const openEditModal = (user: User) => {
		setEditingId(user.id);
		setFormData({
			name: user.name,
			email: user.email,
			password: "",
			role: user.role as "admin" | "editor" | "viewer",
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
			setFormData({ name: "", email: "", password: "", role: "editor" });
			setError(null);
		}, 200);
	};

	// Handle delete user
	const handleDelete = async (id: number) => {
		setIsSubmitting(true);
		setError(null);

		try {
			const response = await fetch(`/api/users/${id}`, {
				method: "DELETE",
				credentials: "include",
			});

			if (response.status === 401) {
				window.location.href = "/access-denied";
				return;
			}

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Failed to delete user");
			}

			// Refresh users list
			const refreshResponse = await fetch("/api/users", {
				method: "GET",
				credentials: "include",
			});

			if (refreshResponse.ok) {
				const data = await refreshResponse.json();
				setUsers(data);
			}

			setDeleteConfirm(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Error deleting user");
		} finally {
			setIsSubmitting(false);
		}
	};

	// Check if user can edit
	const canEdit = user && (user.role === "admin" || user.role === "editor");

	return (
		<div className="space-y-6">
			{/* Header Section */}
			<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Users</h1>
					<p className="text-secondary text-sm font-medium mt-1">
						Manage your users here
					</p>
				</div>
				{canEdit && (
					<button
						onClick={openNewModal}
						className="btn-solid flex items-center gap-2 w-fit"
					>
						<Plus className="w-5 h-5" />
						New User
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

			{/* Users Table */}
			<div className="card-modern">
				{users.length === 0 ? (
					<div className="text-center py-16 px-6">
						<div className="inline-flex items-center justify-center w-12 h-12 bg-secondary rounded-lg mb-4">
							<Plus className="w-6 h-6 text-secondary" />
						</div>
						<p className="text-secondary font-medium mb-4">
							No users found. Get started by creating your first user
						</p>
						{canEdit && (
							<button onClick={openNewModal} className="btn-solid text-sm">
								Create User
							</button>
						)}
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="table-modern">
							<thead>
								<tr>
									<th>Name</th>
									<th>Email</th>
									<th>Role</th>
									<th>Created</th>
									<th className="text-right">Actions</th>
								</tr>
							</thead>
							<tbody>
								{users.map((userItem) => (
									<tr key={userItem.id}>
										<td className="font-medium text-gray-900">
											{userItem.name}
										</td>
										<td className="text-secondary">{userItem.email}</td>
										<td>
											<span
												className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
													userItem.role === "admin"
														? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
														: userItem.role === "editor"
															? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
															: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
												}`}
											>
												{userItem.role}
											</span>
										</td>
										<td className="text-secondary text-sm">
											{new Date(userItem.createdAt).toLocaleDateString("id-ID")}
										</td>
										<td className="text-right">
											<div className="flex items-center justify-end gap-1">
												{canEdit && (
													<button
														onClick={() => openEditModal(userItem)}
														className="btn-icon btn-icon-primary"
														title="Edit"
													>
														<Edit2 className="w-4 h-4" />
													</button>
												)}
												<button
													onClick={() => setDeleteConfirm(userItem.id)}
													className="btn-icon btn-icon-danger"
													title="Delete"
												>
													<Trash2 className="w-4 h-4" />
												</button>
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
							<h2 className="text-xl font-bold text-gray-900">
								{editingId ? "Edit User" : "User Baru"}
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
								<label className="block text-sm font-medium text-gray-900 mb-2">
									Name *
								</label>
								<input
									type="text"
									name="name"
									value={formData.name}
									onChange={handleInputChange}
									placeholder="John Doe"
									className="input-modern w-full"
									required
									disabled={isSubmitting}
								/>
							</div>

							{/* Email Field */}
							<div>
								<label className="block text-sm font-medium text-gray-900 mb-2">
									Email *
								</label>
								<input
									type="email"
									name="email"
									value={formData.email}
									onChange={handleInputChange}
									placeholder="john@example.com"
									className="input-modern w-full"
									required
									disabled={isSubmitting}
								/>
							</div>

							{/* Password Field (only for create) */}
							{!editingId && (
								<div>
									<label className="block text-sm font-medium text-gray-900 mb-2">
										Password *
									</label>
									<input
										type="password"
										name="password"
										value={formData.password}
										onChange={handleInputChange}
										placeholder="Minimum 6 characters"
										className="input-modern w-full"
										required
										disabled={isSubmitting}
									/>
								</div>
							)}

							{/* Role Field */}
							<div>
								<label className="block text-sm font-medium text-gray-900 mb-2">
									Role *
								</label>
								<select
									name="role"
									value={formData.role}
									onChange={handleInputChange}
									className="input-modern w-full"
									disabled={isSubmitting}
								>
									<option value="viewer">Viewer</option>
									<option value="editor">Editor</option>
									<option value="admin">Admin</option>
								</select>
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
								Delete User?
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
								Are you sure you want to delete this user? This action cannot be
								undone.
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
