import DashboardClient from "./DashboardClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "NextCMS dashboard overview",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
