"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Select from "react-select";
import type { CSSObjectWithLabel } from "react-select";
import RichTextEditor from "@/app/components/RichTextEditor";
import FileUploadInput from "@/app/components/FileUploadInput";

interface ContentFormProps {
  initialCategories: Array<{ id: number; name: string }>;
  initialUsers: Array<{ id: number; name: string; email: string }>;
  initialContent?: {
    id: number;
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    type: string;
    categoryId: number | null;
    createdBy: number;
    featuredImage?: string;
    status?: string;
    publishedAt?: Date;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    canonicalUrl?: string;
    robots?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
  };
  isEditing?: boolean;
}

export default function ContentForm({
  initialCategories,
  initialUsers,
  initialContent,
  isEditing = false,
}: ContentFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSEO, setShowSEO] = useState(
    isEditing && initialContent?.metaTitle ? true : false,
  );

  const [formData, setFormData] = useState({
    title: initialContent?.title || "",
    slug: initialContent?.slug || "",
    content: initialContent?.content || "",
    excerpt: initialContent?.excerpt || "",
    categoryId: initialContent?.categoryId || null,
    createdBy: initialContent?.createdBy || initialUsers[0]?.id || 1,
    featuredImage: initialContent?.featuredImage || "",
    status: initialContent?.status || "draft",
    publishedAt: initialContent?.publishedAt || null,
    metaTitle: initialContent?.metaTitle || "",
    metaDescription: initialContent?.metaDescription || "",
    metaKeywords: initialContent?.metaKeywords || "",
    canonicalUrl: initialContent?.canonicalUrl || "",
    robots: initialContent?.robots || "",
    ogTitle: initialContent?.ogTitle || "",
    ogDescription: initialContent?.ogDescription || "",
    ogImage: initialContent?.ogImage || "",
  });

  // Generate slug from title
  const handleTitleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      title: value,
      slug: value
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-"),
    }));
  };

  const categoryOptions = useMemo(
    () => initialCategories.map((cat) => ({ value: cat.id, label: cat.name })),
    [initialCategories],
  );

  const selectedCategory = useMemo(
    () =>
      formData.categoryId
        ? categoryOptions.find((opt) => opt.value === formData.categoryId)
        : null,
    [formData.categoryId, categoryOptions],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        title: formData.title,
        slug: formData.slug,
        content: formData.content,
        excerpt: formData.excerpt || undefined,
        type: "article",
        categoryId: formData.categoryId,
        createdBy: formData.createdBy,
        featuredImage: formData.featuredImage || undefined,
        status: formData.status,
        publishedAt: formData.publishedAt || undefined,
        metaTitle: formData.metaTitle || undefined,
        metaDescription: formData.metaDescription || undefined,
        metaKeywords: formData.metaKeywords || undefined,
        canonicalUrl: formData.canonicalUrl || undefined,
        robots: formData.robots || undefined,
        ogTitle: formData.ogTitle || undefined,
        ogDescription: formData.ogDescription || undefined,
        ogImage: formData.ogImage || undefined,
      };

      const url = isEditing
        ? `/api/contents/${initialContent?.id}`
        : "/api/contents";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save content");
      }

      router.push("/app/content");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading(false);
    }
  };

  const customStyles = {
    control: (base: CSSObjectWithLabel) => ({
      ...base,
      borderColor: "#d1d5db",
      backgroundColor: "#ffffff",
      color: "#1f2937",
      "&:hover": {
        borderColor: "#9ca3af",
      },
    }),
    option: (base: CSSObjectWithLabel, state: { isSelected: boolean }) => ({
      ...base,
      backgroundColor: state.isSelected ? "#3b82f6" : "#ffffff",
      color: state.isSelected ? "#ffffff" : "#1f2937",
      "&:hover": {
        backgroundColor: state.isSelected ? "#3b82f6" : "#f3f4f6",
      },
    }),
    menu: (base: CSSObjectWithLabel) => ({
      ...base,
      backgroundColor: "#ffffff",
      border: "1px solid #d1d5db",
    }),
  };

  return (
    <div className="mx-auto">
      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-800 dark:text-red-200 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Main Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN - Content Card */}
          <div className="lg:col-span-2">
            <div className="bg-surface dark:bg-[#323232] p-6 rounded-lg border border-gray-200 dark:border-[#424242] space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-primary dark:text-[#e5e5e5] mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter content title"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-[#424242] rounded-lg bg-white dark:bg-[#222222] text-primary dark:text-[#e5e5e5] placeholder-gray-500 dark:placeholder-[#828282] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-primary dark:text-[#e5e5e5] mb-2">
                  Slug *
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      slug: e.target.value,
                    }))
                  }
                  placeholder="auto-generated-from-title"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-[#424242] rounded-lg bg-white dark:bg-[#222222] text-primary dark:text-[#e5e5e5] placeholder-gray-500 dark:placeholder-[#828282] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="text-xs text-secondary dark:text-[#929292] mt-1">
                  Slug is auto-generated from title
                </p>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium text-primary dark:text-[#e5e5e5] mb-2">
                  Excerpt
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      excerpt: e.target.value,
                    }))
                  }
                  placeholder="Short content summary (optional)"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-[#424242] rounded-lg bg-white dark:bg-[#222222] text-primary dark:text-[#e5e5e5] placeholder-gray-500 dark:placeholder-[#828282] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-primary dark:text-[#e5e5e5] mb-2">
                  Content *
                </label>
                <RichTextEditor
                  content={formData.content}
                  onChange={(html) =>
                    setFormData((prev) => ({
                      ...prev,
                      content: html,
                    }))
                  }
                  placeholder="Write your content here..."
                />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Metadata Card */}
          <div className="lg:col-span-1">
            <div className="bg-surface dark:bg-[#323232] p-6 rounded-lg border border-gray-200 dark:border-[#424242] space-y-6">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-primary dark:text-[#e5e5e5] mb-2">
                  Category
                </label>
                <Select
                  options={categoryOptions}
                  value={selectedCategory}
                  onChange={(option) =>
                    setFormData((prev) => ({
                      ...prev,
                      categoryId: option?.value || null,
                    }))
                  }
                  isClearable
                  placeholder="Select category..."
                  styles={customStyles}
                  classNamePrefix="react-select"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-primary dark:text-[#e5e5e5] mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-[#424242] rounded-lg bg-white dark:bg-[#222222] text-primary dark:text-[#e5e5e5] focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              {/* Published At */}
              <div>
                <label className="block text-sm font-medium text-primary dark:text-[#e5e5e5] mb-2">
                  Publication Date
                </label>
                <input
                  type="datetime-local"
                  value={
                    formData.publishedAt
                      ? new Date(formData.publishedAt)
                          .toISOString()
                          .slice(0, 16)
                      : ""
                  }
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      publishedAt: e.target.value
                        ? new Date(e.target.value)
                        : null,
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-[#424242] rounded-lg bg-white dark:bg-[#222222] text-primary dark:text-[#e5e5e5] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Featured Image */}
              <div>
                <label className="block text-sm font-medium text-primary dark:text-[#e5e5e5] mb-2">
                  Featured Image
                </label>
                <FileUploadInput
                  type="image"
                  value={formData.featuredImage}
                  onChange={(url) =>
                    setFormData((prev) => ({
                      ...prev,
                      featuredImage: url,
                    }))
                  }
                  placeholder="Click or drag featured image here"
                  imageProps={{
                    width: "100%",
                    height: "auto",
                    objectFit: "cover",
                    placement: "center",
                    alt: "Featured Image",
                    borderRadius: "8px",
                  }}
                />
              </div>

              {/* SEO Section Toggle */}
              <div className="border-t border-gray-200 dark:border-[#424242] pt-6">
                <button
                  type="button"
                  onClick={() => setShowSEO(!showSEO)}
                  className="flex items-center gap-2 text-primary dark:text-[#e5e5e5] font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <span
                    className={`transform transition-transform ${showSEO ? "rotate-90" : ""}`}
                  >
                    ►
                  </span>
                  SEO & Open Graph
                </button>
              </div>

              {/* SEO Fields */}
              {showSEO && (
                <div className="space-y-4 pt-4 border-l-4 border-blue-500 pl-4">
                  {/* Meta Title */}
                  <div>
                    <label className="block text-sm font-medium text-primary dark:text-[#e5e5e5] mb-2">
                      Meta Title
                    </label>
                    <input
                      type="text"
                      value={formData.metaTitle}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          metaTitle: e.target.value,
                        }))
                      }
                      placeholder="Title for search engines"
                      maxLength={255}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-[#424242] rounded-lg bg-white dark:bg-[#222222] text-primary dark:text-[#e5e5e5] placeholder-gray-500 dark:placeholder-[#828282] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-secondary dark:text-[#929292] mt-1">
                      {formData.metaTitle.length}/255
                    </p>
                  </div>

                  {/* Meta Description */}
                  <div>
                    <label className="block text-sm font-medium text-primary dark:text-[#e5e5e5] mb-2">
                      Meta Description
                    </label>
                    <textarea
                      value={formData.metaDescription}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          metaDescription: e.target.value,
                        }))
                      }
                      placeholder="Description for search engines"
                      maxLength={500}
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-[#424242] rounded-lg bg-white dark:bg-[#222222] text-primary dark:text-[#e5e5e5] placeholder-gray-500 dark:placeholder-[#828282] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-secondary dark:text-[#929292] mt-1">
                      {formData.metaDescription.length}/500
                    </p>
                  </div>

                  {/* Meta Keywords */}
                  <div>
                    <label className="block text-sm font-medium text-primary dark:text-[#e5e5e5] mb-2">
                      Meta Keywords
                    </label>
                    <input
                      type="text"
                      value={formData.metaKeywords}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          metaKeywords: e.target.value,
                        }))
                      }
                      placeholder="Keywords (separated by comma)"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-[#424242] rounded-lg bg-white dark:bg-[#222222] text-primary dark:text-[#e5e5e5] placeholder-gray-500 dark:placeholder-[#828282] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Canonical URL */}
                  <div>
                    <label className="block text-sm font-medium text-primary dark:text-[#e5e5e5] mb-2">
                      Canonical URL
                    </label>
                    <input
                      type="url"
                      value={formData.canonicalUrl}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          canonicalUrl: e.target.value,
                        }))
                      }
                      placeholder="https://example.com/article"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-[#424242] rounded-lg bg-white dark:bg-[#222222] text-primary dark:text-[#e5e5e5] placeholder-gray-500 dark:placeholder-[#828282] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Robots */}
                  <div>
                    <label className="block text-sm font-medium text-primary dark:text-[#e5e5e5] mb-2">
                      Robots Meta
                    </label>
                    <input
                      type="text"
                      value={formData.robots}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          robots: e.target.value,
                        }))
                      }
                      placeholder="index, follow"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-[#424242] rounded-lg bg-white dark:bg-[#222222] text-primary dark:text-[#e5e5e5] placeholder-gray-500 dark:placeholder-[#828282] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-secondary dark:text-[#929292] mt-1">
                      Example: index,follow / noindex,follow / noindex,nofollow
                    </p>
                  </div>

                  {/* OG Title */}
                  <div>
                    <label className="block text-sm font-medium text-primary dark:text-[#e5e5e5] mb-2">
                      OG Title
                    </label>
                    <input
                      type="text"
                      value={formData.ogTitle}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          ogTitle: e.target.value,
                        }))
                      }
                      placeholder="Title for social media"
                      maxLength={255}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-[#424242] rounded-lg bg-white dark:bg-[#222222] text-primary dark:text-[#e5e5e5] placeholder-gray-500 dark:placeholder-[#828282] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* OG Description */}
                  <div>
                    <label className="block text-sm font-medium text-primary dark:text-[#e5e5e5] mb-2">
                      OG Description
                    </label>
                    <textarea
                      value={formData.ogDescription}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          ogDescription: e.target.value,
                        }))
                      }
                      placeholder="Description for social media"
                      maxLength={500}
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-[#424242] rounded-lg bg-white dark:bg-[#222222] text-primary dark:text-[#e5e5e5] placeholder-gray-500 dark:placeholder-[#828282] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* OG Image */}
                  <div>
                    <label className="block text-sm font-medium text-primary dark:text-[#e5e5e5] mb-2">
                      OG Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.ogImage}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          ogImage: e.target.value,
                        }))
                      }
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-[#424242] rounded-lg bg-white dark:bg-[#222222] text-primary dark:text-[#e5e5e5] placeholder-gray-500 dark:placeholder-[#828282] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4 border-t border-gray-200 dark:border-[#424242]">
          <div className="lg:col-span-2"></div>
          <div className="lg:col-span-1 flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-2 bg-blue-600 dark:bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Saving..." : isEditing ? "Update" : "Create"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-6 py-2 bg-gray-300 dark:bg-[#424242] text-gray-900 dark:text-[#e5e5e5] font-medium rounded-lg hover:bg-gray-400 dark:hover:bg-[#525252] transition-colors"
            >
              Batal
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
