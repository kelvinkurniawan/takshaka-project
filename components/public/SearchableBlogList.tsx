"use client";

import Link from "next/link";
import { useState } from "react";

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

interface SearchableBlogListProps {
  contents: Content[];
}

export function SearchableBlogList({ contents }: SearchableBlogListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredContents = contents.filter(
    (content) =>
      content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <>
      {/* Search */}
      <div className="mb-12">
        <input
          type="text"
          placeholder="Cari artikel..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-6 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Articles */}
      {filteredContents.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">
            {searchTerm ? "Tidak ada artikel yang cocok" : "Belum ada artikel"}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredContents.map((content) => (
            <article
              key={content.id}
              className="flex gap-6 bg-white rounded-lg border hover:shadow-lg transition p-6"
            >
              {/* Featured Image */}
              {content.featuredImage && (
                <div className="flex-shrink-0 w-48 h-32 bg-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={content.featuredImage}
                    alt={content.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {content.type && (
                      <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm rounded-full mb-2">
                        {content.type}
                      </span>
                    )}
                    <h2 className="text-2xl font-semibold mb-2 hover:text-primary transition">
                      <Link href={`/blog/${content.slug}`}>
                        {content.title}
                      </Link>
                    </h2>
                    {content.excerpt && (
                      <p className="text-gray-600 mb-4">{content.excerpt}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>
                        {new Date(
                          content.publishedAt || content.createdAt,
                        ).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                      <Link
                        href={`/blog/${content.slug}`}
                        className="text-primary font-semibold hover:underline"
                      >
                        Baca Selengkapnya →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
