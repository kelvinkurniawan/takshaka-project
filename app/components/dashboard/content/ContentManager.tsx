import { getDB } from "@/lib/db";
import { contents, categories, users } from "@/lib/schema";
import type { InferSelectModel } from "drizzle-orm";
import ContentManagerClient from "./ContentManagerClient";

type Content = InferSelectModel<typeof contents>;
type Category = InferSelectModel<typeof categories>;
type User = InferSelectModel<typeof users>;

interface ContentManagerState {
  data: {
    enrichedContents: Array<
      Content & {
        category: Category | null;
        creator: User;
      }
    >;
    activeCategories: Category[];
    allUsers: User[];
  } | null;
  error: Error | null;
}

export default async function ContentManager() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = getDB();

  let state: ContentManagerState = { data: null, error: null };

  try {
    // Fetch all active contents, categories, and users
    const allContents = await db.select().from(contents);
    const allCategories = await db.select().from(categories);
    const allUsers = await db.select().from(users);

    // Filter soft deleted items
    const activeContents = allContents.filter(
      (item: Content) => item.deletedAt === null,
    );
    const activeCategories = allCategories.filter(
      (item: Category) => item.deletedAt === null,
    );

    // Create lookup maps for easier access
    const categoryMap = Object.fromEntries(
      activeCategories.map((cat: Category) => [cat.id, cat]),
    );
    const userMap = Object.fromEntries(
      allUsers.map((user: User) => [user.id, user]),
    );

    // Enrich contents with category and user info
    const enrichedContents = activeContents.map((content: Content) => ({
      ...content,
      category: content.categoryId ? categoryMap[content.categoryId] : null,
      creator: userMap[content.createdBy],
    }));

    state = {
      data: {
        enrichedContents,
        activeCategories,
        allUsers,
      },
      error: null,
    };
  } catch (error) {
    state = {
      data: null,
      error: error instanceof Error ? error : new Error("Unknown error"),
    };
  }

  // JSX is now outside try/catch, avoiding the ESLint error
  if (state.error) {
    console.error("Error in ContentManager:", state.error);
    return (
      <div className="text-red-500 dark:text-red-400">
        Failed to load content manager
      </div>
    );
  }

  if (!state.data) {
    return (
      <div className="text-gray-500 dark:text-gray-400">
        No content available
      </div>
    );
  }

  return (
    <ContentManagerClient
      initialContents={state.data.enrichedContents}
      initialCategories={state.data.activeCategories}
      initialUsers={state.data.allUsers}
    />
  );
}
