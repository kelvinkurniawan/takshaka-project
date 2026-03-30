import { cache } from "react";
import { getDB } from "@/lib/db";
import { navigation, settings } from "@/lib/schema";
import { isNull, asc, eq, and, inArray } from "drizzle-orm";
import PublicHeaderClient from "./PublicHeaderClient";

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

interface PublicHeaderData {
	desktopItems: NavigationItem[];
	mobileItems: NavigationItem[];
	isNavEnabled: boolean;
	logo: string;
}

/**
 * Fetch all public header data with single database query
 * Includes: navigation items (desktop/mobile), navigation enabled setting, and logo
 * Cached per request to avoid duplicate queries
 */
async function _fetchPublicHeaderData(): Promise<PublicHeaderData> {
	try {
		const db = getDB(process.env);

		// ✅ Single database instance - fetch all data in one logical operation
		// Fetch all navigation items (both desktop and mobile) at once
		const allNavigationItems = await db
			.select()
			.from(navigation)
			.where(isNull(navigation.deletedAt))
			.orderBy(asc(navigation.order), asc(navigation.id));

		// Fetch all required settings at once
		const allSettings = await db
			.select()
			.from(settings)
			.where(inArray(settings.key, ["enable_navigation_menu", "logo"]));

		// Build nested structure for a platform
		const buildTree = (
			items: NavigationItem[],
			platform: "desktop" | "mobile",
			parentId: number | null = null,
		): NavigationItem[] => {
			return items
				.filter(
					(item) => item.parentId === parentId && item.platform === platform,
				)
				.map((item) => ({
					...item,
					children: buildTree(items, platform, item.id),
				}))
				.sort((a, b) => a.order - b.order);
		};

		// Process data in memory (no additional DB queries)
		const desktopItems = buildTree(
			allNavigationItems as NavigationItem[],
			"desktop",
		);
		const mobileItems = buildTree(
			allNavigationItems as NavigationItem[],
			"mobile",
		);

		// Extract settings from single query result
		const navEnabledSetting = allSettings.find(
			(s: (typeof allSettings)[number]) => s.key === "enable_navigation_menu",
		);
		const logoSetting = allSettings.find(
			(s: (typeof allSettings)[number]) => s.key === "logo",
		);

		// Default to enabled if not explicitly set to "false"
		const isNavEnabled =
			!navEnabledSetting || navEnabledSetting.value !== "false";
		const logo = logoSetting?.value || "";

		return {
			desktopItems,
			mobileItems,
			isNavEnabled,
			logo,
		};
	} catch (error) {
		console.error("❌ Error fetching public header data:", {
			error: error instanceof Error ? error.message : String(error),
			stack: error instanceof Error ? error.stack : undefined,
			timestamp: new Date().toISOString(),
		});
		// Return safe defaults on error
		return {
			desktopItems: [],
			mobileItems: [],
			isNavEnabled: true,
			logo: "",
		};
	}
}

/**
 * Cached version of fetchPublicHeaderData
 * Results are cached per request to avoid duplicate queries
 * Since navigation and settings rarely change, consider ISR/revalidation strategy
 */
const fetchPublicHeaderData = cache(_fetchPublicHeaderData);

export default async function PublicHeader() {
	const { desktopItems, mobileItems, isNavEnabled, logo } =
		await fetchPublicHeaderData();

	return (
		<PublicHeaderClient
			desktopNavigationItems={desktopItems}
			mobileNavigationItems={mobileItems}
			isNavEnabled={isNavEnabled}
			logo={logo}
		/>
	);
}
