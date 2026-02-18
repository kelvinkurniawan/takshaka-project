import DashboardClient from "./DashboardClient";
import { getDB } from "@/lib/db";
import { contents, users, categories } from "@/lib/schema";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Dashboard",
	description: "NextCMS dashboard overview",
};

export default async function DashboardPage() {
	// Server component: fetch counts from DB and pass as props to client component
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const db = getDB(process.env as any);

	try {
		const allContents = await db.select().from(contents);
		const allUsers = await db.select().from(users);
		const allCategories = await db.select().from(categories);

		const activeContents = allContents.filter((c: any) => c.deletedAt === null);
		const activeUsers = allUsers.filter((u: any) => u.deletedAt === null);
		const activeCategories = allCategories.filter(
			(cat: any) => cat.deletedAt === null,
		);

		const totals = {
			contents: activeContents.length,
			users: activeUsers.length,
			categories: activeCategories.length,
		};

		return <DashboardClient totals={totals} />;
	} catch (error) {
		console.error("Dashboard data load failed:", error);
		// Fallback: render dashboard with zeroed totals and an error banner handled in client
		return (
			<DashboardClient
				totals={{ contents: 0, users: 0, categories: 0 }}
				hasError
			/>
		);
	}
}
