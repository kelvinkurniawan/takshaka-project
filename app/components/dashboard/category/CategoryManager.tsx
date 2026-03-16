import { getUserWithRole } from "@/lib/session";
import { getDB } from "@/lib/db";
import { categories } from "@/lib/schema";
import { desc, eq, isNull } from "drizzle-orm";
import { redirect } from "next/navigation";
import CategoryManagerClient from "./CategoryManagerClient";

export default async function CategoryManager() {
	// Get user session
	const user = await getUserWithRole();

	if (!user) {
		redirect("/access-denied");
	}

	// Get database connection
	const db = getDB(process.env);

	// Fetch categories
	const categoriesData = await db
		.select({
			id: categories.id,
			name: categories.name,
			slug: categories.slug,
			description: categories.description,
			created_at: categories.createdAt,
			updated_at: categories.updatedAt,
		})
		.from(categories)
		.where(isNull(categories.deletedAt))
		.orderBy(desc(categories.createdAt));

	return (
		<CategoryManagerClient initialCategories={categoriesData} user={user} />
	);
}
