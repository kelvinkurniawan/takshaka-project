"use client";

import { useState } from "react";
import Link from "next/link";
import { Edit2, Trash2 } from "lucide-react";

interface Content {
  id: number;
  title: string;
  slug: string;
  content: string;
  type: string;
  categoryId: number | null;
  createdBy: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  featuredImage: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  category?: { id: number; name: string } | null;
  creator?: { id: number; name: string };
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface ContentManagerClientProps {
  initialContents: Content[];
  initialCategories: Category[];
  initialUsers: User[];
}

export default function ContentManagerClient({
  initialContents,
  initialCategories,
  initialUsers,
}: ContentManagerClientProps) {
  const [contents, setContents] = useState<Content[]>(initialContents);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this content?")) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/contents/${id}`, { method: "DELETE" });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete content");
      }

      setContents(contents.filter((c) => c.id !== id));
      setSuccess("Content deleted successfully");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Articles</h1>
          <p className="text-secondary text-sm font-medium mt-1">
            Manage your content articles here
          </p>
        </div>

        {/* Create Button */}
        <Link href="/app/content/create" className="btn-primary">
          + New Content
        </Link>
      </div>
      <div className="space-y-6">
        {/* Success Message */}
        {success && (
          <div className="bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-700 text-green-800 dark:text-green-200 px-4 py-3 rounded">
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-800 dark:text-red-200 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Contents List */}
        <div className="space-y-4 mt-4">
          <h3 className="text-lg font-semibold text-primary dark:text-[#e5e5e5]">
            List Content ({contents.length})
          </h3>

          {contents.length === 0 ? (
            <p className="text-secondary dark:text-[#929292]">
              No contents found. Please create a new content.
            </p>
          ) : (
            <div className="card-modern">
              <div className="overflow-x-auto">
                <table className="table-modern">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Type</th>
                      <th>Created By</th>
                      <th>Created</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contents.map((content) => (
                      <tr key={content.id}>
                        <td>
                          <div>
                            <Link
                              href={`/app/content/${content.id}/edit`}
                              className="font-medium text-primary hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            >
                              {content.title}
                            </Link>
                            <p className="text-xs text-secondary mt-1">
                              <code className="bg-secondary px-2 py-1 rounded text-xs text-primary">
                                {content.slug}
                              </code>
                            </p>
                          </div>
                        </td>
                        <td>
                          {content.category ? (
                            <span className="badge badge-primary">
                              {content.category.name}
                            </span>
                          ) : (
                            <span className="text-secondary">-</span>
                          )}
                        </td>
                        <td className="capitalize text-secondary">
                          {content.type}
                        </td>
                        <td className="text-secondary">
                          {content.creator?.name || "Unknown"}
                        </td>
                        <td className="text-secondary text-sm">
                          {new Date(content.createdAt).toLocaleDateString(
                            "id-ID",
                          )}
                        </td>
                        <td className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              href={`/app/content/${content.id}/edit`}
                              className="btn-icon btn-icon-primary"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDelete(content.id)}
                              disabled={loading}
                              className="btn-icon btn-icon-danger"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
