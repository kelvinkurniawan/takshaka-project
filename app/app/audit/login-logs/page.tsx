import type { Metadata } from "next";
import { getDB } from "@/lib/db";
import { loginLogs, users } from "@/lib/schema";
import { desc } from "drizzle-orm";
import LoginLogsClient from "./LoginLogsClient";

export const metadata: Metadata = {
	title: "Login Audit Log",
	description: "View all user login attempts and activities",
};

interface LoginLog {
	id: number;
	userId: number | null;
	userName: string | null;
	email: string;
	success: boolean;
	failureReason: string | null;
	ipAddress: string;
	createdAt: Date;
}

export default async function LoginLogsPage({
	searchParams,
}: {
	searchParams: Promise<{ page?: string; success?: string; userId?: string }>;
}) {
	const db = getDB();
	const params = await searchParams;

	const page = parseInt(params.page || "1", 10);
	const pageSize = 20;
	const offset = (page - 1) * pageSize;

	// Build filter conditions
	let logs: any[] = [];
	let total = 0;

	try {
		// Fetch all logs
		const allLogs = await db
			.select()
			.from(loginLogs)
			.orderBy(desc(loginLogs.createdAt));
		total = allLogs.length;

		// Apply filters if provided
		let filteredLogs = allLogs;
		if (params.success !== undefined) {
			const isSuccess = params.success === "true";
			filteredLogs = filteredLogs.filter(
				(log: any) => log.success === isSuccess,
			);
		}

		if (params.userId) {
			const userId = parseInt(params.userId, 10);
			filteredLogs = filteredLogs.filter((log: any) => log.userId === userId);
		}

		// Paginate
		logs = filteredLogs.slice(offset, offset + pageSize);

		// Get user names for display
		const userIds = new Set(
			logs.filter((log) => log.userId).map((log) => log.userId),
		);

		let userMap: Record<number, string> = {};
		if (userIds.size > 0) {
			const userList = await db
				.select({ id: users.id, name: users.name })
				.from(users);

			userList.forEach((user: any) => {
				userMap[user.id] = user.name;
			});
		}

		// Format logs with user names
		const formattedLogs: LoginLog[] = logs.map((log: any) => ({
			id: log.id,
			userId: log.userId,
			userName: log.userId ? userMap[log.userId] || "Unknown User" : null,
			email: log.email,
			success: log.success,
			failureReason: log.failureReason,
			ipAddress: log.ipAddress,
			createdAt: log.createdAt,
		}));

		return (
			<LoginLogsClient
				logs={formattedLogs}
				pagination={{
					page,
					pageSize,
					total,
					hasMore: offset + pageSize < total,
				}}
				filters={{
					success: params.success,
					userId: params.userId,
				}}
			/>
		);
	} catch (error) {
		console.error("Failed to load login logs:", error);
		return (
			<div className="alert alert-error">
				Failed to load login logs. Please try again later.
			</div>
		);
	}
}
