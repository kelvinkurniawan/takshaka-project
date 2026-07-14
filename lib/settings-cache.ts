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
	} catch (error) {
		const errorMsg = error instanceof Error ? error.message : String(error);
		const isTableNotFound =
			errorMsg.includes("does not exist") ||
			errorMsg.includes("no such table") ||
			errorMsg.includes("Failed query");

		// Log at warning level for expected errors (table not initialized)
		if (isTableNotFound) {
			console.warn("⚠️  Settings table not accessible, using defaults");
		} else {
			console.error("Failed to initialize settings cache:", error);
		}

		// Initialize empty cache instead of showing error
		settingsCache = new Map([
			["site_name", "Takshaka Indonesia"],
			["site_description", "Luxury Travel Experiences"],
		]);
	}
}

export async function getSiteName(): Promise<string> {
	const siteName = await getSetting("site_name");
	return siteName || "Takshaka Indonesia";
}

export async function getSiteLogo(): Promise<string | null> {
	return await getSetting("logo");
}

export async function getSocialMediaLink(
	platform: string,
): Promise<string | null> {
	return await getSetting(`social_${platform}`);
}

export async function getAllSocialMediaLinks(): Promise<
	Record<string, string>
> {
	try {
		// Initialize cache if needed
		if (!settingsCache || Date.now() - cacheInitTime > CACHE_TTL) {
			await initializeSettingsCache();
		}

		const socialLinks: Record<string, string> = {};
		const platforms = [
			"instagram",
			"youtube",
			"linkedin",
			"facebook",
			"twitter",
		];

		for (const platform of platforms) {
			const key = `social_${platform}`;
			const value = settingsCache?.get(key);
			if (value) {
				socialLinks[platform] = value;
			}
		}

		return socialLinks;
	} catch (error) {
		console.warn("Failed to get social media links:", error);
		return {};
	}
}
