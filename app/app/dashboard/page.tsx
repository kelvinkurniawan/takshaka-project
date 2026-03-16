import DashboardClient from "./DashboardClient";
import { getDB } from "@/lib/db";
import {
	contents,
	users,
	categories,
	pageViews,
	loginLogs,
} from "@/lib/schema";
import { eq, and, gte, lte } from "drizzle-orm";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Dashboard",
	description: "Takshaka CMS dashboard overview",
};

interface DashboardStats {
	totals: {
		contents: number;
		users: number;
		categories: number;
	};
	today: {
		totalPageViews: number;
		uniqueVisitors: number;
		successfulLogins: number;
		hourlyBreakdown: Array<{ hour: number; visitors: number }>;
	};
	recentLogins: Array<{
		id: number;
		email: string;
		userName: string;
		time: Date;
	}>;
}

export default async function DashboardPage() {
	// Server component: fetch counts from DB and pass as props to client component
	const db = getDB(process.env);

	let stats: DashboardStats = {
		totals: { contents: 0, users: 0, categories: 0 },
		today: {
			totalPageViews: 0,
			uniqueVisitors: 0,
			successfulLogins: 0,
			hourlyBreakdown: [],
		},
		recentLogins: [],
	};
	let hasError = false;

	try {
		// Get today's date (start and end)
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const todayEnd = new Date(today);
		todayEnd.setHours(23, 59, 59, 999);

		const [allContents, allUsers, allCategories, todayPageViews, recentLogins] =
			await Promise.all([
				db.select().from(contents),
				db.select().from(users),
				db.select().from(categories),
				db
					.select()
					.from(pageViews)
					.where(
						and(
							gte(pageViews.createdAt, today),
							lte(pageViews.createdAt, todayEnd),
						),
					),
				db
					.select()
					.from(loginLogs)
					.where(
						and(
							gte(loginLogs.createdAt, today),
							lte(loginLogs.createdAt, todayEnd),
							eq(loginLogs.success, true),
						),
					),
			]);

		// Filter active records (non-deleted)
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const activeContents = allContents.filter((c: any) => c.deletedAt === null);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const activeUsers = allUsers.filter((u: any) => u.deletedAt === null);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const activeCategories = allCategories.filter(
			(cat: any) => cat.deletedAt === null,
		);

		// Count unique visitors today
		const uniqueVisitorsToday = new Set(
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			todayPageViews.map((pv: any) => pv.visitorId),
		).size;

		// Calculate hourly breakdown
		const hourlyData: Record<number, number> = {};
		for (let i = 0; i < 24; i++) {
			hourlyData[i] = 0;
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		todayPageViews.forEach((pv: any) => {
			if (pv.createdAt) {
				const hour = new Date(pv.createdAt).getHours();
				hourlyData[hour] = (hourlyData[hour] || 0) + 1;
			}
		});

		// Convert to array for chart
		const hourlyBreakdown = Object.entries(hourlyData).map(([hour, count]) => ({
			hour: parseInt(hour),
			visitors: count,
		}));

		// Prepare recent login summary (last 5 successful logins today)
		const recentLoginSummary = recentLogins
			.slice(-5)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.map((log: any) => ({
				id: log.id,
				email: log.email,
				userName: log.userId ? "User" : "Unknown",
				time: log.createdAt,
			}));

		stats = {
			totals: {
				contents: activeContents.length,
				users: activeUsers.length,
				categories: activeCategories.length,
			},
			today: {
				totalPageViews: todayPageViews.length,
				uniqueVisitors: uniqueVisitorsToday,
				successfulLogins: recentLogins.length,
				hourlyBreakdown,
			},
			recentLogins: recentLoginSummary,
		};
	} catch (error) {
		console.error("Dashboard data load failed:", error);
		hasError = true;
	}

	return <DashboardClient stats={stats} hasError={hasError} />;
}
