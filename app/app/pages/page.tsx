import PageManager from "@/app/components/dashboard/pages/PageManager";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Pages | Takshaka CMS",
	description: "Manage your pages with block-based builder",
};

export default function PagesPage() {
	return <PageManager />;
}
