"use client";
import { apiFetch } from "@/lib/api-fetch";

import { useState } from "react";
import {
	Plus,
	Trash2,
	Edit2,
	ArrowUp,
	ArrowDown,
	AlertCircle,
} from "lucide-react";

interface NavigationItem {
	id: number;
	label: string;
	url: string;
	parentId: number | null;
	order: number;
	icon: string | null;
	target: string;
	isActive: boolean;
	platform: string;
	children?: NavigationItem[];
}

interface FormData {
	label: string;
	url: string;
	parentId: number | null;
	order: number;
	icon: string;
	target: "_self" | "_blank" | "_parent" | "_top";
	isActive: boolean;
	platform: "desktop" | "mobile";
}

interface NavigationClientProps {
	desktopItems: NavigationItem[];
	mobileItems: NavigationItem[];
	isNavEnabled?: boolean;
}

export default function NavigationClient({
	desktopItems,
	mobileItems,
	isNavEnabled = true,
}: NavigationClientProps) {
	const [currentTab, setCurrentTab] = useState<"desktop" | "mobile">("desktop");
	const [desktopNavItems, setDesktopNavItems] =
		useState<NavigationItem[]>(desktopItems);
	const [mobileNavItems, setMobileNavItems] =
		useState<NavigationItem[]>(mobileItems);
	const [editingId, setEditingId] = useState<number | null>(null);
	const [showForm, setShowForm] = useState(false);
	const [isReordering, setIsReordering] = useState(false);
	const [formData, setFormData] = useState<FormData>({
		label: "",
		url: "",
		parentId: null,
		order: 0,
		icon: "",
		target: "_self",
		isActive: true,
		platform: "desktop",
	});

	const items = currentTab === "desktop" ? desktopNavItems : mobileNavItems;
	const setItems =
		currentTab === "desktop" ? setDesktopNavItems : setMobileNavItems;

	const refreshNavigation = async () => {
		try {
			const response = await apiFetch(`/api/navigation?platform=${currentTab}`);
			if (!response.ok) {
				throw new Error(`API error: ${response.status}`);
			}
			const data = await response.json();
			if (Array.isArray(data)) {
				setItems(data);
			}
		} catch (error) {
			console.error("Error refreshing navigation:", error);
		}
	};

	const handleReorder = async (
		id: number,
		direction: "up" | "down",
		parentId: number | null,
	) => {
		setIsReordering(true);
		try {
			const response = await apiFetch("/api/navigation/reorder", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					id,
					direction,
					parentId,
					platform: currentTab,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to reorder");
			}

			await refreshNavigation();
		} catch (error) {
			console.error("Error reordering:", error);
			alert("Failed to move item");
		} finally {
			setIsReordering(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const url = editingId
				? `/api/navigation/${editingId}`
				: "/api/navigation";
			const method = editingId ? "PUT" : "POST";

			let submitData = {
				...formData,
				platform: currentTab,
			};

			// For new items, auto-calculate the next order value
			if (!editingId) {
				const siblingItems = formData.parentId
					? items
							.flatMap((item) => (item.id === formData.parentId ? item.children || [] : []))
					: items;

				const maxOrder =
					siblingItems.length > 0
						? Math.max(...siblingItems.map((item) => item.order))
						: -1;

				submitData = {
					...submitData,
					order: maxOrder + 1,
				};
			}

			const response = await apiFetch(url, {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(submitData),
			});

			if (!response.ok) {
				throw new Error("Failed to save navigation");
			}

			resetForm();
			await refreshNavigation();
		} catch (error) {
			console.error("Error saving navigation:", error);
			alert("Failed to save navigation");
		}
	};

	const handleEdit = (item: NavigationItem) => {
		setFormData({
			label: item.label,
			url: item.url,
			parentId: item.parentId,
			order: item.order,
			icon: item.icon || "",
			target:
				(item.target as "_self" | "_blank" | "_parent" | "_top") || "_self",
			isActive: item.isActive,
			platform: (item.platform as "desktop" | "mobile") || "desktop",
		});
		setEditingId(item.id);
		setShowForm(true);
	};

	const handleDelete = async (id: number) => {
		if (!confirm("Are you sure you want to delete this item?")) return;

		try {
			const response = await apiFetch(`/api/navigation/${id}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				throw new Error("Failed to delete navigation");
			}

			await refreshNavigation();
		} catch (error) {
			console.error("Error deleting navigation:", error);
			alert("Failed to delete navigation");
		}
	};

	const resetForm = () => {
		setFormData({
			label: "",
			url: "",
			parentId: null,
			order: 0,
			icon: "",
			target: "_self",
			isActive: true,
			platform: currentTab,
		});
		setEditingId(null);
		setShowForm(false);
	};

	const renderItemTree = (items: NavigationItem[], level = 0) => {
		if (!Array.isArray(items)) {
			return null;
		}

		return (
			<div className="space-y-2">
				{items.map((item, index) => (
					<div key={item.id}>
						<div
							className="flex items-center gap-2 p-3 bg-white dark:bg-[#282828] border border-gray-200 dark:border-[#3a3a3a] rounded-md hover:bg-gray-50 dark:hover:bg-[#323232] group transition"
							style={{ marginLeft: `${level * 20}px` }}
						>
							<div className="flex items-center gap-1">
								<button
									onClick={() => handleReorder(item.id, "up", item.parentId)}
									disabled={index === 0 || isReordering}
									className="p-1.5 hover:bg-gray-200 dark:hover:bg-[#3a3a3a] rounded text-gray-600 dark:text-[#929292] disabled:opacity-30 disabled:cursor-not-allowed transition"
									title="Move up"
								>
									<ArrowUp size={14} />
								</button>
								<button
									onClick={() => handleReorder(item.id, "down", item.parentId)}
									disabled={index === items.length - 1 || isReordering}
									className="p-1.5 hover:bg-gray-200 dark:hover:bg-[#3a3a3a] rounded text-gray-600 dark:text-[#929292] disabled:opacity-30 disabled:cursor-not-allowed transition"
									title="Move down"
								>
									<ArrowDown size={14} />
								</button>
							</div>
							<div className="flex-1">
								<div className="font-medium text-gray-900 dark:text-white">
									{item.label}
								</div>
								<div className="text-sm text-gray-500 dark:text-[#929292]">
									{item.url}
								</div>
							</div>
							<div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
								<button
									onClick={() => handleEdit(item)}
									className="p-2 hover:bg-blue-100 dark:hover:bg-[#3a3a3a] rounded text-blue-600 dark:text-blue-400 transition"
								>
									<Edit2 size={16} />
								</button>
								<button
									onClick={() => handleDelete(item.id)}
									className="p-2 hover:bg-red-100 dark:hover:bg-[#3a3a3a] rounded text-red-600 dark:text-red-400 transition"
								>
									<Trash2 size={16} />
								</button>
							</div>
						</div>
						{item.children && item.children.length > 0 && (
							<div className="mt-2">
								{renderItemTree(item.children, level + 1)}
							</div>
						)}
					</div>
				))}
			</div>
		);
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
						Navigation
					</h1>
					<p className="text-gray-600 dark:text-[#929292] mt-1">
						Manage the website navigation menu for desktop and mobile
					</p>
				</div>
				<button
					onClick={() => {
						setFormData({
							...formData,
							platform: currentTab,
						});
						resetForm();
						setShowForm(true);
					}}
					className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
				>
					<Plus size={20} />
					Add Menu Item
				</button>
			</div>

			{/* Tabs */}
			<div className="border-b border-gray-200 dark:border-[#3a3a3a]">
				<div className="flex space-x-8">
					<button
						onClick={() => setCurrentTab("desktop")}
						className={`py-3 px-1 border-b-2 font-medium text-sm transition ${
							currentTab === "desktop"
								? "border-blue-600 text-blue-600 dark:text-blue-400"
								: "border-transparent text-gray-600 dark:text-[#929292] hover:text-gray-900 dark:hover:text-white"
						}`}
					>
						Desktop
					</button>
					<button
						onClick={() => setCurrentTab("mobile")}
						className={`py-3 px-1 border-b-2 font-medium text-sm transition ${
							currentTab === "mobile"
								? "border-blue-600 text-blue-600 dark:text-blue-400"
								: "border-transparent text-gray-600 dark:text-[#929292] hover:text-gray-900 dark:hover:text-white"
						}`}
					>
						Mobile
					</button>
				</div>
			</div>

			{/* Navigation Disabled Notification */}
			{!isNavEnabled && (
				<div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-[#3a2a1a] border border-amber-300 dark:border-[#6b4c2a] rounded-lg">
					<AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
					<div>
						<h3 className="font-semibold text-amber-900 dark:text-amber-100">
							Navigation Menu Disabled
						</h3>
						<p className="text-sm text-amber-800 dark:text-amber-200 mt-1">
							The navigation menu is currently disabled in settings. Even though
							you can manage items here, they will not be displayed on the
							public website. Visit the <strong>Navigation Settings</strong> to
							enable the navigation menu.
						</p>
					</div>
				</div>
			)}

			{/* Form */}
			{showForm && (
				<div className="bg-white dark:bg-[#282828] border border-gray-200 dark:border-[#3a3a3a] rounded-lg p-6">
					<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
						{editingId ? "Edit Menu Item" : "Add New Menu Item"}
					</h2>

					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-[#e5e5e5] mb-1">
									Label *
								</label>
								<input
									type="text"
									value={formData.label}
									onChange={(e) =>
										setFormData({ ...formData, label: e.target.value })
									}
									className="w-full px-3 py-2 border border-gray-300 dark:border-[#525252] rounded-md bg-white dark:bg-[#323232] text-gray-900 dark:text-[#e5e5e5] focus:outline-none focus:ring-2 focus:ring-blue-500"
									required
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-[#e5e5e5] mb-1">
									URL *
								</label>
								<input
									type="text"
									value={formData.url}
									onChange={(e) =>
										setFormData({ ...formData, url: e.target.value })
									}
									className="w-full px-3 py-2 border border-gray-300 dark:border-[#525252] rounded-md bg-white dark:bg-[#323232] text-gray-900 dark:text-[#e5e5e5] focus:outline-none focus:ring-2 focus:ring-blue-500"
									required
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-[#e5e5e5] mb-1">
									Parent Item
								</label>
								<select
									value={formData.parentId || ""}
									onChange={(e) =>
										setFormData({
											...formData,
											parentId: e.target.value
												? parseInt(e.target.value)
												: null,
										})
									}
									className="w-full px-3 py-2 border border-gray-300 dark:border-[#525252] rounded-md bg-white dark:bg-[#323232] text-gray-900 dark:text-[#e5e5e5] focus:outline-none focus:ring-2 focus:ring-blue-500"
								>
									<option value="">None (Top Level)</option>
									{items.map((item) => (
										<option key={item.id} value={item.id}>
											{item.label}
										</option>
									))}
								</select>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-[#e5e5e5] mb-1">
									Target
								</label>
								<select
									value={formData.target}
									onChange={(e) =>
										setFormData({
											...formData,
											// eslint-disable-next-line @typescript-eslint/no-explicit-any
											target: e.target.value as any,
										})
									}
									className="w-full px-3 py-2 border border-gray-300 dark:border-[#525252] rounded-md bg-white dark:bg-[#323232] text-gray-900 dark:text-[#e5e5e5] focus:outline-none focus:ring-2 focus:ring-blue-500"
								>
									<option value="_self">Same Window</option>
									<option value="_blank">New Window</option>
									<option value="_parent">Parent Window</option>
									<option value="_top">Top Window</option>
								</select>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-[#e5e5e5] mb-1">
									Order
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
									className="w-full px-3 py-2 border border-gray-300 dark:border-[#525252] rounded-md bg-white dark:bg-[#323232] text-gray-900 dark:text-[#e5e5e5] focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-[#e5e5e5] mb-1">
									Icon
								</label>
								<input
									type="text"
									value={formData.icon}
									onChange={(e) =>
										setFormData({ ...formData, icon: e.target.value })
									}
									placeholder="e.g., home, user, settings"
									className="w-full px-3 py-2 border border-gray-300 dark:border-[#525252] rounded-md bg-white dark:bg-[#323232] text-gray-900 dark:text-[#e5e5e5] focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>
						</div>

						<div className="flex items-center gap-2">
							<input
								type="checkbox"
								id="active"
								checked={formData.isActive}
								onChange={(e) =>
									setFormData({ ...formData, isActive: e.target.checked })
								}
								className="rounded"
							/>
							<label
								htmlFor="active"
								className="text-sm text-gray-700 dark:text-[#e5e5e5]"
							>
								Active
							</label>
						</div>

						<div className="flex gap-2">
							<button
								type="submit"
								className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
							>
								{editingId ? "Update" : "Create"}
							</button>
							<button
								type="button"
								onClick={resetForm}
								className="px-4 py-2 bg-gray-300 dark:bg-[#3a3a3a] text-gray-900 dark:text-white rounded-md hover:bg-gray-400 dark:hover:bg-[#424242] transition"
							>
								Cancel
							</button>
						</div>
					</form>
				</div>
			)}

			{/* Navigation List */}
			<div className="bg-white dark:bg-[#282828] border border-gray-200 dark:border-[#3a3a3a] rounded-lg p-6">
				<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
					{currentTab.charAt(0).toUpperCase() + currentTab.slice(1)} Menu Items
				</h2>

				{items.length === 0 ? (
					<p className="text-gray-600 dark:text-[#929292] text-center py-8">
						No menu items for {currentTab} yet. Create your first one!
					</p>
				) : (
					renderItemTree(items)
				)}
			</div>
		</div>
	);
}
