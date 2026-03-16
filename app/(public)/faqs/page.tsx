import type { Metadata } from "next";
import FaqsClient from "./faqs-client";
import { getDB } from "@/lib/db";
import { faqs } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";

export const metadata: Metadata = {
	title: "FAQs - Takshaka",
	description:
		"Frequently Asked Questions. Find answers to common questions about Takshaka's experiences and services.",
};

export default async function FaqsPage() {
	const db = getDB(process.env);

	let faqsList: any[] = [];
	let hasError = false;

	try {
		// Fetch all published FAQs, ordered by category and order
		const allFaqs = await db
			.select()
			.from(faqs)
			.where(eq(faqs.status, "published"))
			.orderBy(faqs.category, faqs.order);

		// Filter out soft deleted FAQs
		faqsList = allFaqs.filter((faq: any) => faq.deletedAt === null);

		// Group by category
		const groupedFaqs: Record<string, typeof faqsList> = {};
		faqsList.forEach((faq) => {
			const category = faq.category || "General";
			if (!groupedFaqs[category]) {
				groupedFaqs[category] = [];
			}
			groupedFaqs[category].push(faq);
		});

		return <FaqsClient faqs={groupedFaqs} hasError={false} />;
	} catch (error) {
		console.error("FAQs data load failed:", error);
		hasError = true;
		return <FaqsClient faqs={{}} hasError={true} />;
	}
}
