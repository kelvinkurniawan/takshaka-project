import FAQManager from "./FAQManager";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "FAQ Management",
	description: "Manage your frequently asked questions",
};

export default function FAQPage() {
	return <FAQManager />;
}
