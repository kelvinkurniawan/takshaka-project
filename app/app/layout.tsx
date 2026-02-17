import { getUserWithRole } from "@/lib/session";
import { redirect } from "next/navigation";
import AppLayoutClient from "./AppLayoutClient";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check authentication on server side
  const user = await getUserWithRole();

  if (!user) {
    redirect("/secure-access");
  }

  return <AppLayoutClient>{children}</AppLayoutClient>;
}
