import CommentsClient from "./CommentsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Manajemen Komentar",
	description: "Kelola komentar blog",
};

export default function CommentsPage() {
	return <CommentsClient />;
}
