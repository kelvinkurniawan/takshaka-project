export const dynamic = "force-dynamic";

import { getDB } from "@/lib/db";
import { navigation } from "@/lib/schema";

export async function POST(request: Request) {
	try {
		const db = getDB();

		// Sample navigation data
		const sampleItems = [
			{
				label: "Home",
				url: "/",
				parentId: null,
				order: 0,
				icon: "home",
				target: "_self",
				isActive: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				label: "Blog",
				url: "/blog",
				parentId: null,
				order: 1,
				icon: "file-text",
				target: "_self",
				isActive: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				label: "Products",
				url: "/products",
				parentId: null,
				order: 2,
				icon: "shopping-bag",
				target: "_self",
				isActive: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				label: "Features",
				url: "/products/features",
				parentId: 3, // Nested under Products
				order: 0,
				icon: null,
				target: "_self",
				isActive: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				label: "Pricing",
				url: "/products/pricing",
				parentId: 3, // Nested under Products
				order: 1,
				icon: null,
				target: "_self",
				isActive: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				label: "About",
				url: "/about",
				parentId: null,
				order: 3,
				icon: "info",
				target: "_self",
				isActive: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				label: "Contact",
				url: "/contact",
				parentId: null,
				order: 4,
				icon: "mail",
				target: "_self",
				isActive: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		];

		const result = await db.insert(navigation).values(sampleItems).returning();

		return Response.json(
			{
				success: true,
				message: `Seeded ${result.length} navigation items`,
				items: result,
			},
			{ status: 201 },
		);
	} catch (error) {
		console.error("Error seeding navigation:", error);
		return Response.json(
			{ error: "Failed to seed navigation data" },
			{ status: 500 },
		);
	}
}
