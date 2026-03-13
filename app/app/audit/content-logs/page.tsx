import type { Metadata } from "next";
import { getDB } from "@/lib/db";
import { auditLogs, users } from "@/lib/schema";
import { desc } from "drizzle-orm";
import ContentAuditLogsClient from "./ContentAuditLogsClient";

export const metadata: Metadata = {
	title: "Content Audit Logs",
	description: "View all content changes and activities",
};

interface AuditLog {
	id: number;
	userId: number;
	userName: string;
	action: string;
	entityType: string;
	entityName: string;
	entityId: number;
	changes: Record<string, any> | null;
	oldValues: Record<string, any> | null;
	newValues: Record<string, any> | null;
	createdAt: Date;
}

export default async function ContentAuditLogsPage({
	searchParams,
}: {
	searchParams: Promise<{
		page?: string;
		entityType?: string;
		action?: string;
	}>;
}) {
	const db = getDB();
	const params = await searchParams;

	const page = parseInt(params.page || "1", 10);
	const pageSize = 20;
	const offset = (page - 1) * pageSize;

	let logs: any[] = [];
	let total = 0;

	try {
		// Fetch all audit logs
		const allLogs = await db
			.select()
			.from(auditLogs)
			.orderBy(desc(auditLogs.createdAt));

		total = allLogs.length;

		// Apply filters if provided
		let filteredLogs = allLogs;

		if (params.entityType) {
			filteredLogs = filteredLogs.filter(
				(log: any) => log.entityType === params.entityType,
			);
		}

		if (params.action) {
			filteredLogs = filteredLogs.filter(
				(log: any) => log.action === params.action,
			);
		}

		// Paginate
		logs = filteredLogs.slice(offset, offset + pageSize);

		// Get user names for display
		const userIds = new Set(logs.map((log) => log.userId));

		let userMap: Record<number, string> = {};
		if (userIds.size > 0) {
			const userList = await db
				.select({ id: users.id, name: users.name })
				.from(users);

			userList.forEach((user: any) => {
				userMap[user.id] = user.name;
			});
		}

		// Format logs with user names and parsed JSON fields
		const formattedLogs: AuditLog[] = logs.map((log: any) => ({
			id: log.id,
			userId: log.userId,
			userName: userMap[log.userId] || "Unknown User",
			action: log.action,
			entityType: log.entityType,
			entityName: log.entityName || `${log.entityType}#${log.entityId}`,
			entityId: log.entityId,
			changes: log.changes ? JSON.parse(log.changes) : null,
			oldValues: log.oldValues ? JSON.parse(log.oldValues) : null,
			newValues: log.newValues ? JSON.parse(log.newValues) : null,
			createdAt: log.createdAt,
		}));

		return (
			<ContentAuditLogsClient
				logs={formattedLogs}
				pagination={{
					page,
					pageSize,
					total,
					hasMore: offset + pageSize < total,
				}}
			/>
		);
	} catch (error) {
		console.error("Error fetching audit logs:", error);
		return (
			<ContentAuditLogsClient
				logs={[]}
				pagination={{ page: 1, pageSize, total: 0, hasMore: false }}
				error="Failed to load audit logs"
			/>
		);
	}
}
