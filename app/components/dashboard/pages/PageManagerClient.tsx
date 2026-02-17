"use client";

import { useState } from "react";
import Link from "next/link";
import { Edit2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface Page {
  id: number;
  title: string;
  slug: string;
  status: "draft" | "published";
  metaTitle: string | null;
  metaDescription: string | null;
  created_at: Date | string;
  updated_at: Date | string;
}

interface UserSession {
  id: number;
  role: string;
}

interface PageManagerClientProps {
  initialPages: Page[];
  user: UserSession;
}

export default function PageManagerClient({
  initialPages,
  user,
}: PageManagerClientProps) {
  const [pages, setPages] = useState<Page[]>(initialPages);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this page?")) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/pages/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.status === 401) {
        window.location.href = "/access-denied";
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete page");
      }

      setPages(pages.filter((page) => page.id !== id));
      setSuccess("Page deleted successfully");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete page");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary dark:text-[#e5e5e5]">
            Pages
          </h1>
          <p className="text-secondary dark:text-[#929292] text-sm font-medium mt-1">
            Manage your pages with block-based builder
          </p>
        </div>

        {/* Create Button */}
        <Link href="/app/pages/create" className="btn-primary">
          + New Page
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

        {/* Pages List */}
        <div className="space-y-4 mt-4">
          <h3 className="text-lg font-semibold text-primary dark:text-[#e5e5e5]">
            List Pages ({pages.length})
          </h3>

          {pages.length === 0 ? (
            <p className="text-secondary dark:text-[#929292]">
              No pages found. Please create a new page.
            </p>
          ) : (
            <div className="card-modern">
              <div className="overflow-x-auto">
                <table className="table-modern">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Slug</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pages.map((page) => (
                      <tr key={page.id}>
                        <td>
                          <div>
                            <Link
                              href={`/app/pages/${page.id}/edit`}
                              className="font-medium text-primary hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            >
                              {page.title}
                            </Link>
                            <p className="text-xs text-secondary mt-1">
                              <code className="bg-secondary px-2 py-1 rounded text-xs text-primary dark:text-white">
                                {page.metaTitle || "No meta title"}
                              </code>
                            </p>
                          </div>
                        </td>
                        <td>
                          <code className="bg-gray-100 dark:bg-[#323232] px-2 py-1 rounded text-xs text-primary dark:text-white">
                            /{page.slug}
                          </code>
                        </td>
                        <td>
                          <span className={`badge badge-${page.status}`}>
                            {page.status.charAt(0).toUpperCase() +
                              page.status.slice(1)}
                          </span>
                        </td>
                        <td className="text-secondary text-sm">
                          {new Date(page.created_at).toLocaleDateString(
                            "id-ID",
                          )}
                        </td>
                        <td className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              href={`/app/pages/${page.id}/edit`}
                              className="btn-icon btn-icon-primary"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Link>
                            {user.role === "admin" && (
                              <button
                                onClick={() => handleDelete(page.id)}
                                disabled={loading}
                                className="btn-icon btn-icon-danger"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
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
