import { getDB } from "@/lib/db";
import { navigation, settings } from "@/lib/schema";
import { isNull, asc, eq, and } from "drizzle-orm";
import NavigationClient from "./NavigationClient";

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

async function fetchNavigation(
	platform: "desktop" | "mobile",
): Promise<NavigationItem[]> {
	try {
		const db = getDB();
		const items = await db
			.select()
			.from(navigation)
			.where(
				and(isNull(navigation.deletedAt), eq(navigation.platform, platform)),
			)
			.orderBy(asc(navigation.order), asc(navigation.id));

		// Build nested structure
		const buildTree = (
			items: NavigationItem[],
			parentId: number | null = null,
		): NavigationItem[] => {
			return items
				.filter((item) => item.parentId === parentId)
				.map((item) => ({
					...item,
					children: buildTree(items, item.id),
				}))
				.sort((a, b) => a.order - b.order);
		};

		return buildTree(items);
	} catch (error) {
		console.error("Error fetching navigation:", error);
		return [];
	}
}

async function fetchNavigationSetting(): Promise<boolean> {
	try {
		const db = getDB();
		const result = await db
			.select()
			.from(settings)
			.where(eq(settings.key, "enable_navigation_menu"))
			.limit(1);

		if (result.length > 0) {
			return result[0].value !== "false";
		}
		return true; // Default to enabled
	} catch (error) {
		console.error("Error fetching navigation setting:", error);
		return true;
	}
}

export default async function NavigationPage() {
	const desktopItems = await fetchNavigation("desktop");
	const mobileItems = await fetchNavigation("mobile");
	const isNavEnabled = await fetchNavigationSetting();

	return (
		<NavigationClient
			desktopItems={desktopItems}
			mobileItems={mobileItems}
			isNavEnabled={isNavEnabled}
		/>
	);
}
