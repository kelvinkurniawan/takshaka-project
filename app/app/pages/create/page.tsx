import PageBuilderWrapper from "./PageBuilderWrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Create Page | Takshaka CMS",
	description: "Create a new page with block-based builder",
};

export default function CreatePagePage() {
	return <PageBuilderWrapper />;
}
