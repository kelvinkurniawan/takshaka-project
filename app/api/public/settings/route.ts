import { getDB } from "@/lib/db";
import { settings } from "@/lib/schema";

export const runtime = "edge";
export const dynamic = "force-dynamic";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(request: Request, context: any) {
	try {
		const { env } = context;
		const db = getDB(env);

		const settingsData = await db
			.select({
				key: settings.key,
				value: settings.value,
				type: settings.type,
			})
			.from(settings);

		// Convert array to object for easier access
		const settingsObj: Record<
			string,
			string | number | boolean | Record<string, unknown>
		> = {};
		for (const setting of settingsData) {
			let value: any = setting.value;
			// Parse JSON type settings
			if (setting.type === "json" && value) {
				try {
					value = JSON.parse(value);
				} catch (e) {
					// Keep as string if JSON parse fails
				}
			} else if (setting.type === "boolean" && value) {
				value = value === "true" || value === "1";
			} else if (setting.type === "number" && value) {
				value = parseFloat(value);
			}
			settingsObj[setting.key] = value;
		}

		return Response.json(settingsObj);
	} catch (error) {
		console.error("Failed to fetch public settings:", error);
		return Response.json({});
	}
}
