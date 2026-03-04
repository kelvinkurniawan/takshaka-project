import { getDB } from "@/lib/db";
import { categories, users } from "@/lib/schema";
import type { InferSelectModel } from "drizzle-orm";
import ContentForm from "@/app/components/dashboard/content/ContentForm";
import Link from "next/link";
import type { Metadata } from "next";

type Category = InferSelectModel<typeof categories>;
type User = InferSelectModel<typeof users>;

export const metadata: Metadata = {
  title: "Create Content",
  description: "Create new content article",
};

export default async function CreateContentPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = getDB();

  let activeCategories: Category[] = [];
  let allUsers: User[] = [];
  let error: Error | null = null;

  try {
    const allCategories = await db.select().from(categories);
    allUsers = await db.select().from(users);

    activeCategories = allCategories.filter(
      (item: Category) => item.deletedAt === null,
    );
  } catch (err) {
    console.error("Error fetching data:", err);
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
          <h1 className="text-3xl font-bold text-primary dark:text-[#e5e5e5]">
            Create New Content
          </h1>
          <p className="text-secondary dark:text-[#929292] mt-1">
            Add new content to the system
          </p>
        </div>
        <Link
          href="/app/content"
          className="px-4 py-2 bg-gray-300 dark:bg-[#424242] text-gray-900 dark:text-[#e5e5e5] rounded-lg hover:bg-gray-400 dark:hover:bg-[#525252] transition-colors"
        >
          ← Back
        </Link>
      </div>

      <div>
        <ContentForm
          initialCategories={activeCategories}
          initialUsers={allUsers}
        />
      </div>
    </div>
  );
}
