"use client";

import Link from "next/link";

interface BlogCardProps {
  title: string;
  slug: string;
  excerpt?: string;
  featuredImage?: string;
  publishedAt?: string;
  createdAt: string;
  type?: string;
}

export default function BlogCard({
  title,
  slug,
  excerpt,
  featuredImage,
  publishedAt,
  createdAt,
  type,
}: BlogCardProps) {
  return (
    <article className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition border">
      {/* Featured Image */}
      {featuredImage && (
        <div className="aspect-video bg-gray-200 overflow-hidden">
          <img
            src={featuredImage}
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Type Badge */}
        {type && (
          <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm rounded-full mb-2">
            {type}
          </span>
        )}

        {/* Title */}
        <h3 className="text-xl font-semibold mb-2 line-clamp-2 hover:text-primary transition">
          <Link href={`/blog/${slug}`}>{title}</Link>
        </h3>

        {/* Excerpt */}
        {excerpt && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{excerpt}</p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t">
          <span className="text-xs text-gray-500">
            {new Date(publishedAt || createdAt).toLocaleDateString("id-ID")}
          </span>
          <Link
            href={`/blog/${slug}`}
            className="text-primary font-semibold hover:underline text-sm"
          >
            Baca Selengkapnya →
          </Link>
        </div>
      </div>
    </article>
  );
}
