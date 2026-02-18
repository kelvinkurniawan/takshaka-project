"use client";

import { useState } from "react";

interface ThemeSettings {
	primaryColor: string;
	secondaryColor: string;
	backgroundColor: string;
	textColor: string;
	fontFamily: string;
}

export default function ThemeClient() {
	const [settings, setSettings] = useState<ThemeSettings>({
		primaryColor: "#3b82f6",
		secondaryColor: "#8b5cf6",
		backgroundColor: "#ffffff",
		textColor: "#1f2937",
		fontFamily: "Inter",
	});
	const [loading, setLoading] = useState(false);

	const handleChange = (field: keyof ThemeSettings, value: string) => {
		setSettings((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleSave = async () => {
		setLoading(true);
		try {
			// TODO: Save theme settings to database/API
			console.log("Saving theme settings:", settings);
			alert("Theme settings saved successfully!");
		} catch (error) {
			console.error("Error saving theme:", error);
			alert("Failed to save theme settings");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
					Theme
				</h1>
				<p className="text-gray-600 dark:text-[#929292] mt-1">
					Customize the appearance of your website
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Color Settings */}
				<div className="bg-white dark:bg-[#282828] border border-gray-200 dark:border-[#3a3a3a] rounded-lg p-6">
					<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
						Colors
					</h2>

					<div className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-[#e5e5e5] mb-2">
								Primary Color
							</label>
							<div className="flex items-center gap-3">
								<input
									type="color"
									value={settings.primaryColor}
									onChange={(e) => handleChange("primaryColor", e.target.value)}
									className="w-12 h-12 rounded cursor-pointer"
								/>
								<input
									type="text"
									value={settings.primaryColor}
									onChange={(e) => handleChange("primaryColor", e.target.value)}
									className="flex-1 px-3 py-2 border border-gray-300 dark:border-[#525252] rounded-md bg-white dark:bg-[#323232] text-gray-900 dark:text-[#e5e5e5] font-mono text-sm"
								/>
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-[#e5e5e5] mb-2">
								Secondary Color
							</label>
							<div className="flex items-center gap-3">
								<input
									type="color"
									value={settings.secondaryColor}
									onChange={(e) =>
										handleChange("secondaryColor", e.target.value)
									}
									className="w-12 h-12 rounded cursor-pointer"
								/>
								<input
									type="text"
									value={settings.secondaryColor}
									onChange={(e) =>
										handleChange("secondaryColor", e.target.value)
									}
									className="flex-1 px-3 py-2 border border-gray-300 dark:border-[#525252] rounded-md bg-white dark:bg-[#323232] text-gray-900 dark:text-[#e5e5e5] font-mono text-sm"
								/>
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-[#e5e5e5] mb-2">
								Background Color
							</label>
							<div className="flex items-center gap-3">
								<input
									type="color"
									value={settings.backgroundColor}
									onChange={(e) =>
										handleChange("backgroundColor", e.target.value)
									}
									className="w-12 h-12 rounded cursor-pointer"
								/>
								<input
									type="text"
									value={settings.backgroundColor}
									onChange={(e) =>
										handleChange("backgroundColor", e.target.value)
									}
									className="flex-1 px-3 py-2 border border-gray-300 dark:border-[#525252] rounded-md bg-white dark:bg-[#323232] text-gray-900 dark:text-[#e5e5e5] font-mono text-sm"
								/>
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-[#e5e5e5] mb-2">
								Text Color
							</label>
							<div className="flex items-center gap-3">
								<input
									type="color"
									value={settings.textColor}
									onChange={(e) => handleChange("textColor", e.target.value)}
									className="w-12 h-12 rounded cursor-pointer"
								/>
								<input
									type="text"
									value={settings.textColor}
									onChange={(e) => handleChange("textColor", e.target.value)}
									className="flex-1 px-3 py-2 border border-gray-300 dark:border-[#525252] rounded-md bg-white dark:bg-[#323232] text-gray-900 dark:text-[#e5e5e5] font-mono text-sm"
								/>
							</div>
						</div>
					</div>
				</div>

				{/* Typography Settings */}
				<div className="bg-white dark:bg-[#282828] border border-gray-200 dark:border-[#3a3a3a] rounded-lg p-6">
					<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
						Typography
					</h2>

					<div className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-[#e5e5e5] mb-2">
								Font Family
							</label>
							<select
								value={settings.fontFamily}
								onChange={(e) => handleChange("fontFamily", e.target.value)}
								className="w-full px-3 py-2 border border-gray-300 dark:border-[#525252] rounded-md bg-white dark:bg-[#323232] text-gray-900 dark:text-[#e5e5e5] focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								<option value="Inter">Inter</option>
								<option value="Roboto">Roboto</option>
								<option value="Open Sans">Open Sans</option>
								<option value="Lato">Lato</option>
								<option value="Playfair Display">Playfair Display</option>
							</select>
						</div>

						<div className="pt-4">
							<h3 className="text-sm font-medium text-gray-700 dark:text-[#e5e5e5] mb-3">
								Preview
							</h3>
							<div
								style={{
									backgroundColor: settings.backgroundColor,
									color: settings.textColor,
									fontFamily: settings.fontFamily,
								}}
								className="p-4 rounded-md border border-gray-300 dark:border-[#525252]"
							>
								<h1 className="text-2xl font-bold mb-2">Heading Preview</h1>
								<p className="mb-2">
									This is a paragraph text preview with your selected font.
								</p>
								<button
									style={{ backgroundColor: settings.primaryColor }}
									className="text-white px-4 py-2 rounded"
								>
									Button Preview
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="flex gap-2">
				<button
					onClick={handleSave}
					disabled={loading}
					className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition"
				>
					{loading ? "Saving..." : "Save Theme"}
				</button>
			</div>
		</div>
	);
}
