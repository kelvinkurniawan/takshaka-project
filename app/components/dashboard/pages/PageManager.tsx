import { getUserWithRole } from "@/lib/session";
import { getDB } from "@/lib/db";
import { pages } from "@/lib/schema";
import { desc, isNull } from "drizzle-orm";
import { redirect } from "next/navigation";
import PageManagerClient from "@/app/components/dashboard/pages/PageManagerClient";

export default async function PageManager() {
  // Get user session
  const user = await getUserWithRole();

  if (!user) {
    redirect("/access-denied");
  }

  // Get database connection
  const db = getDB(process.env);

  // Fetch pages
  const pagesData = await db
    .select({
      id: pages.id,
      title: pages.title,
      slug: pages.slug,
      status: pages.status,
      metaTitle: pages.metaTitle,
      metaDescription: pages.metaDescription,
      created_at: pages.createdAt,
      updated_at: pages.updatedAt,
    })
    .from(pages)
    .where(isNull(pages.deletedAt))
    .orderBy(desc(pages.createdAt));

  return <PageManagerClient initialPages={pagesData} user={user} />;
}
