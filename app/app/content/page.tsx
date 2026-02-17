import ContentManager from "@/app/components/dashboard/content/ContentManager";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Content",
  description: "Manage your articles and content",
};

export default function ContentPage() {
  return <ContentManager />;
}
