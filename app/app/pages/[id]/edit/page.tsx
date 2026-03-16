import { getDB } from "@/lib/db";
import { pages } from "@/lib/schema";
import { eq, and, isNull } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { getUserWithRole } from "@/lib/session";
import PageEditWrapper from "./PageEditWrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Edit Page | Takshaka CMS",
	description: "Edit page with block-based builder",
};

interface PageEditProps {
	params: Promise<{
		id: string;
	}>;
}

export default async function EditPagePage({ params }: PageEditProps) {
	const { id } = await params;
	// Check authentication
	const user = await getUserWithRole();
	if (!user) {
		redirect("/access-denied");
	}

	const pageId = parseInt(id);

	if (isNaN(pageId)) {
		notFound();
	}

	// Fetch page data
	const db = getDB(process.env);
	const result = await db
		.select()
		.from(pages)
		.where(and(eq(pages.id, pageId), isNull(pages.deletedAt)))
		.limit(1);

	if (result.length === 0) {
		notFound();
	}

	const page = result[0];

	// Parse content JSON
	let blocks = [];
	try {
		const contentData = JSON.parse(page.content);
		blocks = contentData.blocks || [];
	} catch (error) {
		console.error("Failed to parse page content:", error);
	}

	const initialData = {
		title: page.title,
		slug: page.slug,
		status: page.status as "draft" | "published",
		metaTitle: page.metaTitle || "",
		metaDescription: page.metaDescription || "",
		blocks,
	};

	return (
		<PageEditWrapper
			pageTitle={page.title}
			initialData={initialData}
			pageId={pageId}
		/>
	);
}
