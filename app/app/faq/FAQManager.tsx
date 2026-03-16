import FAQManagerClient from "./FAQManagerClient";
import { getDB } from "@/lib/db";
import { faqs } from "@/lib/schema";
import { isNull } from "drizzle-orm";

interface FAQ {
	id: number;
	question: string;
	answer: string;
	category?: string;
	order: number;
	status: "draft" | "published";
	created_by: number;
	created_at: string;
	updated_at: string;
}

async function fetchFAQs(): Promise<FAQ[]> {
	try {
		const db = getDB(process.env);

		// Cast dates to string since they might be Date objects
		const faqsData = await db
			.select({
				id: faqs.id,
				question: faqs.question,
				answer: faqs.answer,
				category: faqs.category,
				order: faqs.order,
				status: faqs.status,
				created_by: faqs.createdBy,
				created_at: faqs.createdAt,
				updated_at: faqs.updatedAt,
			})
			.from(faqs)
			.where(isNull(faqs.deletedAt));

		return faqsData.map((faq: (typeof faqsData)[0]) => ({
			...faq,
			created_at:
				faq.created_at instanceof Date
					? faq.created_at.toISOString()
					: String(faq.created_at),
			updated_at:
				faq.updated_at instanceof Date
					? faq.updated_at.toISOString()
					: String(faq.updated_at),
		})) as FAQ[];
	} catch (error) {
		console.error("Failed to fetch FAQs:", error);
		return [];
	}
}

export default async function FAQManager() {
	const initialFaqs = await fetchFAQs();

	return <FAQManagerClient initialFaqs={initialFaqs} />;
}
