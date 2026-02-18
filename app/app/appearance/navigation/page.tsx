import { getDB } from "@/lib/db";
import { navigation, settings } from "@/lib/schema";
import { isNull, asc, eq } from "drizzle-orm";
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
	children?: NavigationItem[];
}

async function fetchNavigation(): Promise<NavigationItem[]> {
	try {
		const db = getDB({});
		const items = await db
			.select()
			.from(navigation)
			.where(isNull(navigation.deletedAt))
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
		const db = getDB({});
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
	const items = await fetchNavigation();
	const isNavEnabled = await fetchNavigationSetting();

	return <NavigationClient initialItems={items} isNavEnabled={isNavEnabled} />;
}
