import { getUserWithRole } from "@/lib/session";
import { redirect } from "next/navigation";
import SectionsList from "./SectionsList";

export const metadata = {
	title: "Section Management | Admin",
};

export default async function PageSectionsPage() {
	const user = await getUserWithRole();

	if (!user) {
		redirect("/secure-access");
	}

	return (
		<div className="page-sections-container">
			<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
				<div>
					<h1 className="text-3xl font-bold text-gray-900 dark:text-[#e5e5e5]">
						Page Sections
					</h1>
					<p className="text-secondary dark:text-[#929292] text-sm font-medium mt-1">
						Manage page sections and their content
					</p>
				</div>
			</div>

			<SectionsList />
		</div>
	);
}
