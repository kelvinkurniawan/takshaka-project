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
			<div className="page-header">
				<div>
					<h1 className="dashboard-header-title">Section Management</h1>
					<p className="dashboard-header-subtitle">
						Manage page sections and their content
					</p>
				</div>
			</div>

			<SectionsList />
		</div>
	);
}
