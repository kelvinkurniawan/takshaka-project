"use client";

import { useState, useCallback, useMemo } from "react";
import { CheckCircle2, X, Pencil, Trash2 } from "lucide-react";

interface FAQ {
	id: number;
	question: string;
	answer: string;
	category?: string;
	order: number;
	status: "draft" | "published";
	created_by: number;
	created_at: string;
	updated_at: string;
}

interface FormData {
	question: string;
	answer: string;
	category?: string;
	order: number;
	status: "draft" | "published";
}

interface FAQManagerClientProps {
	initialFaqs: FAQ[];
}

export default function FAQManagerClient({
	initialFaqs,
}: FAQManagerClientProps) {
	const [faqs, setFaqs] = useState<FAQ[]>(initialFaqs);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [editingId, setEditingId] = useState<number | null>(null);
	const [formData, setFormData] = useState<FormData>({
		question: "",
		answer: "",
		category: "",
		order: 0,
		status: "published",
	});

	const handleAddNew = () => {
		setFormData({
			question: "",
			answer: "",
			category: "",
			order: 0,
			status: "published",
		});
		setEditingId(null);
		setIsFormOpen(true);
	};

	const refetchFAQs = async () => {
		try {
			const response = await fetch("/api/faqs");
			if (!response.ok) throw new Error("Failed to fetch FAQs");
			const data = await response.json();
			setFaqs(data);
		} catch (err) {
			console.error("Error refetching FAQs:", err);
		}
	};

	const handleEdit = (faq: FAQ) => {
		setFormData({
			question: faq.question,
			answer: faq.answer,
			category: faq.category || "",
			order: faq.order,
			status: faq.status,
		});
		setEditingId(faq.id);
		setIsFormOpen(true);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			setLoading(true);
			if (editingId) {
				// Update
				const response = await fetch(`/api/faqs/${editingId}`, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(formData),
				});
				if (!response.ok) throw new Error("Failed to update FAQ");
			} else {
				// Create
				const response = await fetch("/api/faqs", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(formData),
				});
				if (!response.ok) throw new Error("Failed to create FAQ");
			}
			setIsFormOpen(false);
			await refetchFAQs();
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (id: number) => {
		if (!window.confirm("Apakah Anda yakin ingin menghapus FAQ ini?")) return;
		try {
			setLoading(true);
			const response = await fetch(`/api/faqs/${id}`, {
				method: "DELETE",
			});
			if (!response.ok) throw new Error("Failed to delete FAQ");
			await refetchFAQs();
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="container mx-auto">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold text-foreground">Manajemen FAQ</h1>
				<button
					onClick={handleAddNew}
					className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 transition"
				>
					Tambah FAQ Baru
				</button>
			</div>

			{error && (
				<div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded">
					{error}
				</div>
			)}

			{isFormOpen && (
				<div className="mb-6 p-6 bg-gray-50 dark:bg-[#1e1e1e] rounded border border-gray-200 dark:border-[#333333]">
					<h2 className="text-xl font-semibold mb-4 text-foreground">
						{editingId ? "Edit FAQ" : "FAQ Baru"}
					</h2>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label className="block text-sm font-medium mb-2 text-foreground">
								Pertanyaan *
							</label>
							<input
								type="text"
								value={formData.question}
								onChange={(e) =>
									setFormData({ ...formData, question: e.target.value })
								}
								className="w-full px-3 py-2 border border-gray-300 dark:border-[#444444] rounded bg-white dark:bg-[#2d2d2d] text-foreground placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
								required
							/>
						</div>

						<div>
							<label className="block text-sm font-medium mb-2 text-foreground">
								Jawaban *
							</label>
							<textarea
								value={formData.answer}
								onChange={(e) =>
									setFormData({ ...formData, answer: e.target.value })
								}
								className="w-full px-3 py-2 border border-gray-300 dark:border-[#444444] rounded bg-white dark:bg-[#2d2d2d] text-foreground placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-32"
								required
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium mb-2 text-foreground">
									Kategori
								</label>
								<input
									type="text"
									value={formData.category || ""}
									onChange={(e) =>
										setFormData({ ...formData, category: e.target.value })
									}
									className="w-full px-3 py-2 border border-gray-300 dark:border-[#444444] rounded bg-white dark:bg-[#2d2d2d] text-foreground placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium mb-2 text-foreground">
									Urutan
								</label>
								<input
									type="number"
									value={formData.order}
									onChange={(e) =>
										setFormData({
											...formData,
											order: parseInt(e.target.value),
										})
									}
									className="w-full px-3 py-2 border border-gray-300 dark:border-[#444444] rounded bg-white dark:bg-[#2d2d2d] text-foreground placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium mb-2 text-foreground">
								Status
							</label>
							<select
								value={formData.status}
								onChange={(e) =>
									setFormData({
										...formData,
										status: e.target.value as "draft" | "published",
									})
								}
								className="w-full px-3 py-2 border border-gray-300 dark:border-[#444444] rounded bg-white dark:bg-[#2d2d2d] text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								<option value="published">Dipublikasikan</option>
								<option value="draft">Draft</option>
							</select>
						</div>

						<div className="flex gap-2 pt-2">
							<button
								type="submit"
								disabled={loading}
								className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
							>
								<CheckCircle2 size={18} />
								{loading ? "Menyimpan..." : "Simpan"}
							</button>
							<button
								type="button"
								onClick={() => setIsFormOpen(false)}
								className="flex items-center gap-2 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600 transition"
							>
								<X size={18} />
								Batal
							</button>
						</div>
					</form>
				</div>
			)}

			{faqs.length === 0 ? (
				<div className="text-center py-8 text-gray-500 dark:text-gray-400">
					Tidak ada FAQ. Mulai dengan menambahkan FAQ baru.
				</div>
			) : (
				<div className="space-y-4">
					{faqs.map((faq) => (
						<div
							key={faq.id}
							className="p-4 border border-gray-200 dark:border-[#333333] rounded hover:bg-gray-50 dark:hover:bg-[#1e1e1e] transition bg-white dark:bg-[#252525]"
						>
							<div className="flex justify-between items-start">
								<div className="flex-1">
									<h3 className="text-lg font-semibold text-foreground">
										{faq.question}
									</h3>
									<p className="text-gray-700 dark:text-gray-300 mt-2">
										{faq.answer}
									</p>
									<div className="flex gap-4 mt-3 text-sm text-gray-600 dark:text-gray-400">
										{faq.category && <span>Kategori: {faq.category}</span>}
										<span>Status: {faq.status}</span>
										<span>Urutan: {faq.order}</span>
									</div>
								</div>
								<div className="flex gap-2">
									<button
										onClick={() => handleEdit(faq)}
										className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 transition"
										title="Edit"
									>
										<Pencil size={18} />
									</button>
									<button
										onClick={() => handleDelete(faq.id)}
										disabled={loading}
										className="p-2 bg-red-600 text-white rounded hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
										title="Hapus"
									>
										<Trash2 size={18} />
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
