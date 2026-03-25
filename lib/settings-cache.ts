import { getDB } from "./db";
import { settings } from "./schema";
import { eq } from "drizzle-orm";

// In-memory cache for settings during build
let settingsCache: Map<string, any> | null = null;
let cacheInitTime: number = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function getSetting(key: string) {
	try {
		// Initialize cache if needed
		if (!settingsCache || Date.now() - cacheInitTime > CACHE_TTL) {
			await initializeSettingsCache();
		}

		return settingsCache?.get(key) || null;
	} catch (error) {
		console.warn(`Failed to get setting "${key}":`, error);
		return null;
	}
}

async function initializeSettingsCache() {
	try {
		const db = getDB(process.env);
		const allSettings = await db.select().from(settings);

		settingsCache = new Map();
		for (const setting of allSettings) {
			settingsCache.set(setting.key, setting.value);
		}

		cacheInitTime = Date.now();
		console.log(
			`✓ Settings cache initialized with ${allSettings.length} entries`,
		);
	} catch (error) {
		console.error("Failed to initialize settings cache:", error);
		settingsCache = new Map();
	}
}

export async function getSiteName(): Promise<string> {
	const siteName = await getSetting("site_name");
	return siteName || "Takshaka Indonesia";
}

export async function getSiteLogo(): Promise<string | null> {
	return await getSetting("logo");
}
