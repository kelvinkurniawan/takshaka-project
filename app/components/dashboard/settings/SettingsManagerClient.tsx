"use client";

import { useState, useEffect, useMemo } from "react";
import Select from "react-select";
import type { CSSObjectWithLabel } from "react-select";
import {
	Save,
	Settings as SettingsIcon,
	AlertCircle,
	CheckCircle,
} from "lucide-react";
import FileUploadInput from "@/app/components/FileUploadInput";

interface Setting {
	id: number;
	key: string;
	value: string | null;
	type: string;
	description: string | null;
	createdAt: string;
	updatedAt: string;
}

interface Page {
	id: number;
	title: string;
	slug: string;
}

interface UserSession {
	id: number;
	role: string;
}

interface SettingsManagerClientProps {
	initialSettings: Setting[];
	initialPages: Page[];
	user: UserSession;
}

export default function SettingsManagerClient({
	initialSettings,
	initialPages,
	user,
}: SettingsManagerClientProps) {
	const [settings, setSettings] = useState<Setting[]>(initialSettings);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	// Form state for different setting categories
	const [generalSettings, setGeneralSettings] = useState({
		site_name: "",
		site_description: "",
		site_url: "",
		admin_email: "",
	});

	const [indexPageSettings, setIndexPageSettings] = useState({
		index_page: "",
	});

	const [maintenanceSettings, setMaintenanceSettings] = useState({
		maintenance_mode: false,
		maintenance_message: "",
	});

	const [seoSettings, setSeoSettings] = useState({
		default_meta_title: "",
		default_meta_description: "",
		default_meta_keywords: "",
	});

	const [navigationSettings, setNavigationSettings] = useState({
		enable_navigation_menu: true,
	});

	const [logoSettings, setLogoSettings] = useState({
		logo: "",
	});

	// Create page options for select
	const pageOptions = useMemo(
		() =>
			initialPages.map((page) => ({
				value: page.id.toString(),
				label: page.title,
			})),
		[initialPages],
	);

	// Load settings into form state
	useEffect(() => {
		const loadSettings = () => {
			const settingMap = settings.reduce(
				(acc, setting) => {
					acc[setting.key] = setting.value || "";
					return acc;
				},
				{} as Record<string, string>,
			);

			setGeneralSettings({
				site_name: settingMap.site_name || "NextCMS",
				site_description:
					settingMap.site_description ||
					"A modern headless CMS built with Next.js",
				site_url: settingMap.site_url || "https://example.com",
				admin_email: settingMap.admin_email || "",
			});

			setIndexPageSettings({
				index_page: settingMap.index_page || "",
			});

			setMaintenanceSettings({
				maintenance_mode: settingMap.maintenance_mode === "true",
				maintenance_message:
					settingMap.maintenance_message ||
					"Site is under maintenance. Please check back later.",
			});

			setSeoSettings({
				default_meta_title: settingMap.default_meta_title || "",
				default_meta_description: settingMap.default_meta_description || "",
				default_meta_keywords: settingMap.default_meta_keywords || "",
			});

			setNavigationSettings({
				enable_navigation_menu: settingMap.enable_navigation_menu !== "false",
			});

			setLogoSettings({
				logo: settingMap.logo || "",
			});
		};

		loadSettings();
	}, [settings]);

	// Handle form submission
	const handleSaveSettings = async (category: string) => {
		setIsSubmitting(true);
		setError(null);
		setSuccess(null);

		try {
			let settingsToUpdate: Record<string, string> = {};

			switch (category) {
				case "general":
					settingsToUpdate = {
						site_name: generalSettings.site_name,
						site_description: generalSettings.site_description,
						site_url: generalSettings.site_url,
						admin_email: generalSettings.admin_email,
					};
					break;
				case "index_page":
					settingsToUpdate = {
						index_page: indexPageSettings.index_page,
					};
					break;
				case "maintenance":
					settingsToUpdate = {
						maintenance_mode: maintenanceSettings.maintenance_mode.toString(),
						maintenance_message: maintenanceSettings.maintenance_message,
					};
					break;
				case "seo":
					settingsToUpdate = {
						default_meta_title: seoSettings.default_meta_title,
						default_meta_description: seoSettings.default_meta_description,
						default_meta_keywords: seoSettings.default_meta_keywords,
					};
					break;
				case "navigation":
					settingsToUpdate = {
						enable_navigation_menu:
							navigationSettings.enable_navigation_menu.toString(),
					};
					break;
				case "logo":
					settingsToUpdate = {
						logo: logoSettings.logo,
					};
					break;
			}

			const response = await fetch("/api/settings", {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(settingsToUpdate),
			});

			if (response.status === 401) {
				window.location.href = "/access-denied";
				return;
			}

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Failed to save settings");
			}

			const data = await response.json();

			// Refresh settings list
			const refreshResponse = await fetch("/api/settings", {
				method: "GET",
				credentials: "include",
			});

			if (refreshResponse.ok) {
				const newSettings = await refreshResponse.json();
				setSettings(newSettings);
			}

			setSuccess(
				`${category.charAt(0).toUpperCase() + category.slice(1)} settings saved successfully`,
			);
			setTimeout(() => setSuccess(null), 3000);
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: "An error occurred while saving settings",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	// Check if user can edit
	const canEdit = user && (user.role === "admin" || user.role === "editor");

	if (!canEdit) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<div className="text-center">
					<AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
					<h2 className="text-xl font-semibold text-primary mb-2">
						Access Denied
					</h2>
					<p className="text-secondary">
						You do not have permission to access settings.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold text-primary flex items-center gap-3">
						<SettingsIcon className="w-8 h-8" />
						Settings
					</h1>
					<p className="text-secondary text-sm font-medium mt-1">
						Manage your application settings and configuration
					</p>
				</div>
			</div>

			{/* Success/Error Messages */}
			{success && (
				<div className="alert-success">
					<CheckCircle className="w-5 h-5 flex-shrink-0" />
					<span>{success}</span>
				</div>
			)}

			{error && (
				<div className="alert-error">
					<AlertCircle className="w-5 h-5 flex-shrink-0" />
					<span>{error}</span>
				</div>
			)}

			{/* General Settings */}
			<div className="card-modern">
				<div className="flex items-center justify-between p-6 border-b border-primary">
					<div>
						<h2 className="text-xl font-semibold text-primary">
							General Settings
						</h2>
						<p className="text-secondary text-sm mt-1">
							Basic site information and configuration
						</p>
					</div>
					<button
						onClick={() => handleSaveSettings("general")}
						disabled={isSubmitting}
						className="btn-solid flex items-center gap-2"
					>
						<Save className="w-4 h-4" />
						{isSubmitting ? "Saving..." : "Save"}
					</button>
				</div>

				<div className="p-6 space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label className="block text-sm font-medium text-primary mb-2">
								Site Name *
							</label>
							<input
								type="text"
								value={generalSettings.site_name}
								onChange={(e) =>
									setGeneralSettings((prev) => ({
										...prev,
										site_name: e.target.value,
									}))
								}
								className="input-modern w-full"
								placeholder="My Website"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-primary mb-2">
								Admin Email
							</label>
							<input
								type="email"
								value={generalSettings.admin_email}
								onChange={(e) =>
									setGeneralSettings((prev) => ({
										...prev,
										admin_email: e.target.value,
									}))
								}
								className="input-modern w-full"
								placeholder="admin@example.com"
							/>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-primary mb-2">
							Site Description
						</label>
						<textarea
							value={generalSettings.site_description}
							onChange={(e) =>
								setGeneralSettings((prev) => ({
									...prev,
									site_description: e.target.value,
								}))
							}
							className="textarea-modern w-full"
							rows={3}
							placeholder="A brief description of your site"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-primary mb-2">
							Site URL
						</label>
						<input
							type="url"
							value={generalSettings.site_url}
							onChange={(e) =>
								setGeneralSettings((prev) => ({
									...prev,
									site_url: e.target.value,
								}))
							}
							className="input-modern w-full"
							placeholder="https://example.com"
						/>
					</div>
				</div>
			</div>

			{/* Index Page Settings */}
			<div className="card-modern">
				<div className="flex items-center justify-between p-6 border-b border-primary">
					<div>
						<h2 className="text-xl font-semibold text-primary">
							Index Page Settings
						</h2>
						<p className="text-secondary text-sm mt-1">
							Select which page to display as your landing/home page
						</p>
					</div>
					<button
						onClick={() => handleSaveSettings("index_page")}
						disabled={isSubmitting}
						className="btn-solid flex items-center gap-2"
					>
						<Save className="w-4 h-4" />
						{isSubmitting ? "Saving..." : "Save"}
					</button>
				</div>

				<div className="p-6 space-y-6">
					<div>
						<label className="block text-sm font-medium text-primary mb-2">
							Landing Page *
						</label>
						<Select
							options={pageOptions}
							value={
								indexPageSettings.index_page
									? pageOptions.find(
											(opt) => opt.value === indexPageSettings.index_page,
										)
									: null
							}
							onChange={(option) =>
								setIndexPageSettings({
									index_page: option?.value || "",
								})
							}
							isClearable
							placeholder="Select a page..."
							styles={{
								control: (base: CSSObjectWithLabel) => ({
									...base,
									borderColor: "#d1d5db",
									backgroundColor: "#ffffff",
									color: "#1f2937",
									"&:hover": {
										borderColor: "#9ca3af",
									},
								}),
								option: (
									base: CSSObjectWithLabel,
									state: { isSelected: boolean },
								) => ({
									...base,
									backgroundColor: state.isSelected ? "#3b82f6" : "#ffffff",
									color: state.isSelected ? "#ffffff" : "#1f2937",
									"&:hover": {
										backgroundColor: state.isSelected ? "#3b82f6" : "#f3f4f6",
									},
								}),
								menu: (base: CSSObjectWithLabel) => ({
									...base,
									backgroundColor: "#ffffff",
									border: "1px solid #d1d5db",
								}),
							}}
							classNamePrefix="react-select"
						/>
						<p className="text-xs text-secondary dark:text-[#929292] mt-2">
							The selected page will be served as your home page (/)
						</p>
					</div>
				</div>
			</div>

			{/* Maintenance Settings */}
			<div className="card-modern">
				<div className="flex items-center justify-between p-6 border-b border-primary">
					<div>
						<h2 className="text-xl font-semibold text-primary">
							Maintenance Mode
						</h2>
						<p className="text-secondary text-sm mt-1">
							Control site availability and maintenance messages
						</p>
					</div>
					<button
						onClick={() => handleSaveSettings("maintenance")}
						disabled={isSubmitting}
						className="btn-solid flex items-center gap-2"
					>
						<Save className="w-4 h-4" />
						{isSubmitting ? "Saving..." : "Save"}
					</button>
				</div>

				<div className="p-6 space-y-6">
					<div className="flex items-center gap-3">
						<input
							type="checkbox"
							id="maintenance_mode"
							checked={maintenanceSettings.maintenance_mode}
							onChange={(e) =>
								setMaintenanceSettings((prev) => ({
									...prev,
									maintenance_mode: e.target.checked,
								}))
							}
							className="w-4 h-4 text-blue-600 bg-secondary border-primary rounded focus:ring-blue-500"
						/>
						<label
							htmlFor="maintenance_mode"
							className="text-primary font-medium"
						>
							Enable Maintenance Mode
						</label>
					</div>

					<div>
						<label className="block text-sm font-medium text-primary mb-2">
							Maintenance Message
						</label>
						<textarea
							value={maintenanceSettings.maintenance_message}
							onChange={(e) =>
								setMaintenanceSettings((prev) => ({
									...prev,
									maintenance_message: e.target.value,
								}))
							}
							className="textarea-modern w-full"
							rows={3}
							placeholder="Site is currently under maintenance..."
						/>
					</div>
				</div>
			</div>

			{/* SEO Settings */}
			<div className="card-modern">
				<div className="flex items-center justify-between p-6 border-b border-primary">
					<div>
						<h2 className="text-xl font-semibold text-primary">SEO Settings</h2>
						<p className="text-secondary text-sm mt-1">
							Default meta tags and SEO configuration
						</p>
					</div>
					<button
						onClick={() => handleSaveSettings("seo")}
						disabled={isSubmitting}
						className="btn-solid flex items-center gap-2"
					>
						<Save className="w-4 h-4" />
						{isSubmitting ? "Saving..." : "Save"}
					</button>
				</div>

				<div className="p-6 space-y-6">
					<div>
						<label className="block text-sm font-medium text-primary mb-2">
							Default Meta Title
						</label>
						<input
							type="text"
							value={seoSettings.default_meta_title}
							onChange={(e) =>
								setSeoSettings((prev) => ({
									...prev,
									default_meta_title: e.target.value,
								}))
							}
							className="input-modern w-full"
							placeholder="Default page title"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-primary mb-2">
							Default Meta Description
						</label>
						<textarea
							value={seoSettings.default_meta_description}
							onChange={(e) =>
								setSeoSettings((prev) => ({
									...prev,
									default_meta_description: e.target.value,
								}))
							}
							className="textarea-modern w-full"
							rows={3}
							placeholder="Default page description for search engines"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-primary mb-2">
							Default Meta Keywords
						</label>
						<input
							type="text"
							value={seoSettings.default_meta_keywords}
							onChange={(e) =>
								setSeoSettings((prev) => ({
									...prev,
									default_meta_keywords: e.target.value,
								}))
							}
							className="input-modern w-full"
							placeholder="keyword1, keyword2, keyword3"
						/>
					</div>
				</div>
			</div>

			{/* Navigation Settings */}
			<div className="card-modern">
				<div className="flex items-center justify-between p-6 border-b border-primary">
					<div>
						<h2 className="text-xl font-semibold text-primary">
							Navigation Settings
						</h2>
						<p className="text-secondary text-sm mt-1">
							Control the display and behavior of the site navigation menu
						</p>
					</div>
					<button
						onClick={() => handleSaveSettings("navigation")}
						disabled={isSubmitting}
						className="btn-solid flex items-center gap-2"
					>
						<Save className="w-4 h-4" />
						{isSubmitting ? "Saving..." : "Save"}
					</button>
				</div>

				<div className="p-6 space-y-6">
					<div className="flex items-center gap-3">
						<input
							type="checkbox"
							id="enable_navigation_menu"
							checked={navigationSettings.enable_navigation_menu}
							onChange={(e) =>
								setNavigationSettings((prev) => ({
									...prev,
									enable_navigation_menu: e.target.checked,
								}))
							}
							className="w-4 h-4 text-blue-600 bg-secondary border-primary rounded focus:ring-blue-500"
						/>
						<label
							htmlFor="enable_navigation_menu"
							className="text-primary font-medium"
						>
							Enable Navigation Menu
						</label>
					</div>
					<p className="text-xs text-secondary dark:text-[#929292]">
						When disabled, the main navigation menu will not be displayed on the
						public website
					</p>
				</div>
			</div>

			{/* Logo Settings */}
			<div className="card-modern">
				<div className="flex items-center justify-between p-6 border-b border-primary">
					<div>
						<h2 className="text-xl font-semibold text-primary">
							Logo Settings
						</h2>
						<p className="text-secondary text-sm mt-1">
							Upload your site logo that will appear in the header
						</p>
					</div>
					<button
						onClick={() => handleSaveSettings("logo")}
						disabled={isSubmitting}
						className="btn-solid flex items-center gap-2"
					>
						<Save className="w-4 h-4" />
						{isSubmitting ? "Saving..." : "Save"}
					</button>
				</div>

				<div className="p-6 space-y-6">
					<div>
						<label className="block text-sm font-medium text-primary mb-4">
							Site Logo
						</label>
						<FileUploadInput
							type="image"
							value={logoSettings.logo}
							onChange={(url) =>
								setLogoSettings((prev) => ({
									...prev,
									logo: url,
								}))
							}
							placeholder="Click or drag logo image here"
						/>
					</div>
				</div>
			</div>

			{/* All Settings List */}
			<div className="card-modern">
				<div className="p-6 border-b border-primary">
					<h2 className="text-xl font-semibold text-primary">All Settings</h2>
					<p className="text-secondary text-sm mt-1">
						Raw view of all stored settings
					</p>
				</div>

				<div className="p-6">
					{settings.length === 0 ? (
						<p className="text-secondary">
							No settings found. Save some settings above to see them here.
						</p>
					) : (
						<div className="overflow-x-auto">
							<table className="table-modern">
								<thead>
									<tr>
										<th>Key</th>
										<th>Value</th>
										<th>Type</th>
										<th>Description</th>
										<th>Updated</th>
									</tr>
								</thead>
								<tbody>
									{settings.map((setting) => (
										<tr key={setting.key}>
											<td className="font-medium text-primary font-mono text-sm">
												{setting.key}
											</td>
											<td className="text-secondary max-w-xs truncate">
												{setting.value || "-"}
											</td>
											<td>
												<span className="badge badge-primary">
													{setting.type}
												</span>
											</td>
											<td className="text-secondary">
												{setting.description || "-"}
											</td>
											<td className="text-secondary text-sm">
												{new Date(setting.updatedAt).toLocaleDateString(
													"id-ID",
												)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
