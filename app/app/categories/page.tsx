import CategoryManager from "@/app/components/dashboard/category/CategoryManager";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories",
  description: "Manage your content categories",
};

export default function CategoriesPage() {
  return (
    <>
      <CategoryManager />
    </>
  );
}
