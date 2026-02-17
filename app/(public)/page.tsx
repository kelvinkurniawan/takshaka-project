import Link from "next/link";

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

interface Settings {
  site_title?: string;
  site_description?: string;
  hero_title?: string;
  hero_description?: string;
  show_features?: string;
  show_articles?: string;
  index_page?: string;
  [key: string]: string | undefined;
}

interface Page {
  id: number;
  title: string;
  slug: string;
  content: string;
  status: string;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

async function getSettings(): Promise<Settings> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/public/settings`,
      { next: { revalidate: 3600 } },
    );
    if (!response.ok) return {};
    return response.json();
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return {};
  }
}

async function getPageById(pageId: number): Promise<Page | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/public/pages`,
      { next: { revalidate: 3600 } },
    );
    if (!response.ok) return null;
    const pages: Page[] = await response.json();
    return pages.find((page) => page.id === pageId) || null;
  } catch (error) {
    console.error("Failed to fetch page:", error);
    return null;
  }
}

async function getFeaturedContents(): Promise<Content[]> {
  try {
    // Since we can't use env.DB in server components, we'll fetch via API
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/public/contents?limit=6`,
      { next: { revalidate: 3600 } },
    );
    if (!response.ok) return [];
    return response.json();
  } catch (error) {
    console.error("Failed to fetch featured contents:", error);
    return [];
  }
}

export const metadata = {
  title: "NextCMS - Headless CMS Modern",
  description:
    "Platform CMS modern untuk mengelola konten digital Anda dengan mudah",
};

export default async function HomePage() {
  const [settings, featuredContents] = await Promise.all([
    getSettings(),
    getFeaturedContents(),
  ]);

  // Check if index_page is set
  const indexPageId = settings?.index_page
    ? parseInt(settings.index_page, 10)
    : null;
  let indexPage: Page | null = null;

  if (indexPageId && !isNaN(indexPageId)) {
    indexPage = await getPageById(indexPageId);
  }

  // If index page is set and found, render it
  if (indexPage) {
    return (
      <div className="min-h-screen">
        <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            {indexPage.title}
          </h1>
          {indexPage.metaDescription && (
            <p className="text-xl text-gray-600 mb-8">
              {indexPage.metaDescription}
            </p>
          )}
          <div
            className="prose prose-lg max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: indexPage.content }}
          />
        </article>
      </div>
    );
  }

  // Default landing page content
  // Default values if settings not configured
  const siteTitle = settings?.site_title || "NextCMS";
  const siteDescription =
    settings?.site_description ||
    "Headless CMS modern yang powerful dan mudah digunakan untuk mengelola konten digital Anda";
  const heroTitle = settings?.hero_title || "NextCMS Platform";
  const heroDescription =
    settings?.hero_description ||
    "Headless CMS modern yang powerful dan mudah digunakan untuk mengelola konten digital Anda";
  const showFeatures = settings?.show_features !== "false";
  const showArticles = settings?.show_articles !== "false";

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary via-blue-500 to-cyan-500 text-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">{heroTitle}</h1>
            <p className="text-xl md:text-2xl text-blue-50 mb-8 max-w-2xl mx-auto">
              {heroDescription}
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Link
                href="/blog"
                className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition inline-block"
              >
                Baca Blog
              </Link>
              <Link
                href="/tentang"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition inline-block"
              >
                Pelajari Lebih Lanjut
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      {showFeatures && (
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-12">
              Fitur Unggulan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="p-6 border rounded-lg hover:shadow-lg transition">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Cepat & Responsif
                </h3>
                <p className="text-gray-600">
                  Built dengan Next.js 15 untuk performa maksimal di semua
                  device
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-6 border rounded-lg hover:shadow-lg transition">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Aman & Terpercaya
                </h3>
                <p className="text-gray-600">
                  Sistem autentikasi dan autorisasi built-in untuk keamanan data
                  Anda
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 border rounded-lg hover:shadow-lg transition">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Fleksibel</h3>
                <p className="text-gray-600">
                  Struktur database yang fleksibel untuk berbagai jenis konten
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Latest Content Section */}
      {showArticles && featuredContents.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-12">Artikel Terbaru</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredContents.slice(0, 6).map((article: Content) => (
                <article
                  key={article.id}
                  className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition"
                >
                  {article.featuredImage && (
                    <div className="aspect-video bg-gray-200 overflow-hidden">
                      <img
                        src={article.featuredImage}
                        alt={article.title}
                        className="w-full h-full object-cover hover:scale-105 transition"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    {article.type && (
                      <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm rounded-full mb-2">
                        {article.type}
                      </span>
                    )}
                    <h3 className="text-xl font-semibold mb-2 line-clamp-2">
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {article.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {new Date(
                          article.publishedAt || article.createdAt,
                        ).toLocaleDateString("id-ID")}
                      </span>
                      <Link
                        href={`/blog/${article.slug}`}
                        className="text-primary font-semibold hover:underline"
                      >
                        Baca Selengkapnya →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                href="/blog"
                className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition"
              >
                Lihat Semua Artikel
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Siap Memulai?</h2>
          <p className="text-xl text-blue-50 mb-8 max-w-2xl mx-auto">
            NextCMS siap membantu Anda mengelola konten dengan lebih efisien
          </p>
          <Link
            href="/hubungi"
            className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
          >
            Hubungi Kami
          </Link>
        </div>
      </section>
    </>
  );
}
