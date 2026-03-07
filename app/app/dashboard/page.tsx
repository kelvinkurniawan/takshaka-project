import DashboardClient from "./DashboardClient";
import { getDB } from "@/lib/db";
import { contents, users, categories } from "@/lib/schema";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Dashboard",
	description: "Takshaka CMS dashboard overview",
};

export default async function DashboardPage() {
	// Server component: fetch counts from DB and pass as props to client component
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const db = getDB();

	let totals = { contents: 0, users: 0, categories: 0 };
	let hasError = false;

	try {
		const allContents = await db.select().from(contents);
		const allUsers = await db.select().from(users);
		const allCategories = await db.select().from(categories);

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const activeContents = allContents.filter((c: any) => c.deletedAt === null);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const activeUsers = allUsers.filter((u: any) => u.deletedAt === null);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const activeCategories = allCategories.filter(
			(cat: any) => cat.deletedAt === null,
		);

		totals = {
			contents: activeContents.length,
			users: activeUsers.length,
			categories: activeCategories.length,
		};
	} catch (error) {
		console.error("Dashboard data load failed:", error);
		// Fallback: use zeroed totals and an error banner handled in client
		hasError = true;
	}

	return <DashboardClient totals={totals} hasError={hasError} />;
}
