import UserManager from "@/app/components/dashboard/users/UserManager";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Users",
  description: "Manage system users and their permissions",
};

export default function UsersPage() {
  return (
    <>
      <UserManager />
    </>
  );
}
