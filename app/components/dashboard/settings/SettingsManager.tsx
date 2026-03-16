import { getUserWithRole } from "@/lib/session";
import { getDB } from "@/lib/db";
import { settings, pages } from "@/lib/schema";
import { isNull } from "drizzle-orm";
import { redirect } from "next/navigation";
import SettingsManagerClient from "./SettingsManagerClient";

export default async function SettingsManager() {
	// Get user session
	const user = await getUserWithRole();

	if (!user) {
		redirect("/access-denied");
	}

	// Get database connection
	const db = getDB(process.env);

	// Fetch all settings
	const settingsData = await db
		.select({
			id: settings.id,
			key: settings.key,
			value: settings.value,
			type: settings.type,
			description: settings.description,
			createdAt: settings.createdAt,
			updatedAt: settings.updatedAt,
		})
		.from(settings)
		.orderBy(settings.key);

	// Fetch all active pages
	const pagesData = await db
		.select({
			id: pages.id,
			title: pages.title,
			slug: pages.slug,
		})
		.from(pages)
		.where(isNull(pages.deletedAt))
		.orderBy(pages.title);

	return (
		<SettingsManagerClient
			initialSettings={settingsData}
			initialPages={pagesData}
			user={user}
		/>
	);
}
