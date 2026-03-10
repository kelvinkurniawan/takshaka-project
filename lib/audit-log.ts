import { auditLogs } from "@/lib/schema";

export interface AuditLogEntry {
	userId: number;
	action: "create" | "update" | "delete" | "publish" | "schedule" | "archive";
	entityType: string;
	entityId: number;
	entityName?: string;
	changes?: Record<string, unknown>;
	oldValues?: Record<string, unknown>;
	newValues?: Record<string, unknown>;
	metadata?: Record<string, unknown>;
}

/**
 * Create an audit log entry
 */
export async function logAudit(db: any, entry: AuditLogEntry) {
	try {
		await db.insert(auditLogs).values({
			userId: entry.userId,
			action: entry.action,
			entityType: entry.entityType,
			entityId: entry.entityId,
			entityName: entry.entityName,
			changes: entry.changes ? JSON.stringify(entry.changes) : null,
			oldValues: entry.oldValues ? JSON.stringify(entry.oldValues) : null,
			newValues: entry.newValues ? JSON.stringify(entry.newValues) : null,
			metadata: entry.metadata ? JSON.stringify(entry.metadata) : null,
		});
	} catch (error) {
		// Log to console but don't throw - audit logging shouldn't break main flow
		console.error("Failed to create audit log:", error);
	}
}

/**
 * Compare old and new values to detect changes
 */
export function detectChanges(
	oldValues: Record<string, unknown>,
	newValues: Record<string, unknown>,
) {
	const changes: Record<string, unknown> = {};

	const allKeys = new Set([
		...Object.keys(oldValues),
		...Object.keys(newValues),
	]);

	allKeys.forEach((key) => {
		const oldVal = oldValues[key];
		const newVal = newValues[key];

		if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
			changes[key] = {
				from: oldVal,
				to: newVal,
			};
		}
	});

	return changes;
}

/**
 * Extract metadata from request (IP, user agent)
 */
export function extractMetadata(request?: Request) {
	if (!request) return {};

	return {
		userAgent: request.headers.get("user-agent"),
		referer: request.headers.get("referer"),
		// Get IP from headers (works with Cloudflare, Vercel proxies)
		ip:
			request.headers.get("x-forwarded-for")?.split(",")[0] ||
			request.headers.get("x-real-ip"),
	};
}
