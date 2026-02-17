import { getUserWithRole } from "@/lib/session";
import { getDB } from "@/lib/db";
import { users } from "@/lib/schema";
import { desc, eq, isNull } from "drizzle-orm";
import { redirect } from "next/navigation";
import UserManagerClient from "./UserManagerClient";

export default async function UserManager() {
  // Get user session
  const user = await getUserWithRole();

  if (!user) {
    redirect("/access-denied");
  }

  // Get database connection
  const db = getDB(process.env);

  // Fetch users
  const usersData = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(isNull(users.deletedAt))
    .orderBy(desc(users.createdAt));

  return <UserManagerClient initialUsers={usersData} user={user} />;
}
