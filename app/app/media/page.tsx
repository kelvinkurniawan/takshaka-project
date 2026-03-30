import { getDB } from "@/lib/db";
import { mediaGallery } from "@/lib/schema";
import type { InferSelectModel } from "drizzle-orm";
import MediaManagerClient from "@/app/components/dashboard/media/MediaManagerClient";
import Link from "next/link";
import type { Metadata } from "next";

type Media = InferSelectModel<typeof mediaGallery>;

export const metadata: Metadata = {
	title: "Media Gallery",
	description: "Manage your media library",
};

export default async function MediaPage() {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const db = getDB(process.env);

	let media: Media[] = [];
	let error: Error | null = null;

	try {
		const allMedia = await db
			.select()
			.from(mediaGallery)
			.orderBy(mediaGallery.createdAt);

		media = allMedia.filter((item: Media) => item.deletedAt === null);
	} catch (err) {
		console.error("Error fetching media:", err);
		error = err instanceof Error ? err : new Error("Unknown error");
	}

	if (error) {
		return (
			<div className="text-red-500 dark:text-red-400">Failed to load page</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-gray-900 dark:text-[#e5e5e5]">
						Media Gallery
					</h1>
					<p className="text-secondary dark:text-[#929292] mt-1">
						Manage your media library
					</p>
				</div>
				<Link
					href="/app/dashboard"
					prefetch={false}
					className="px-4 py-2 bg-gray-300 dark:bg-[#424242] text-gray-900 dark:text-[#e5e5e5] rounded-lg hover:bg-gray-400 dark:hover:bg-[#525252] transition-colors"
				>
					← Back
				</Link>
			</div>

			<div>
				<MediaManagerClient initialMedia={media} />
			</div>
		</div>
	);
}
