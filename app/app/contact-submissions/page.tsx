import ContactSubmissionsClient from "./ContactSubmissionsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Contact Submissions - Dashboard",
	description: "Manage contact form submissions",
};

export default function ContactSubmissionsPage() {
	return <ContactSubmissionsClient />;
}
