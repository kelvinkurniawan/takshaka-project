import { getUserWithRole } from "@/lib/session";
import { redirect } from "next/navigation";
import SectionEditor from "./SectionEditor";

export const metadata = {
	title: "Edit Section | Admin",
};

interface PageSectionDetailProps {
	params: Promise<{ id: string }>;
}

export default async function PageSectionDetailPage({
	params,
}: PageSectionDetailProps) {
	const user = await getUserWithRole();

	if (!user) {
		redirect("/secure-access");
	}

	const { id } = await params;

	return (
		<div className="page-section-detail-container">
			<SectionEditor sectionId={id} />
		</div>
	);
}
