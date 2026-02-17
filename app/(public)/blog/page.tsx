import { SearchableBlogList } from "@/components/public/SearchableBlogList";

interface Content {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  featuredImage?: string;
  publishedAt?: string;
  createdAt: string;
  type?: string;
}

async function getContents(): Promise<Content[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/public/contents`,
      { next: { revalidate: 3600 } },
    );
    if (!response.ok) return [];
    return response.json();
  } catch (error) {
    console.error("Failed to fetch contents:", error);
    return [];
  }
}

export const metadata = {
  title: "Blog & Artikel - NextCMS",
  description: "Pelajari tips, trik, dan berita terbaru tentang CMS modern",
};

export default async function BlogPage() {
  const contents = await getContents();

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-r from-primary to-blue-600 text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold mb-4">Blog & Artikel</h1>
          <p className="text-xl text-blue-50">
            Pelajari tips, trik, dan berita terbaru tentang CMS modern
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <SearchableBlogList contents={contents} />
      </div>
    </>
  );
}
