"use client";

import { useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import PageBuilder, {
  type PageBuilderHandle,
} from "@/app/components/dashboard/pages/PageBuilder";

export default function PageBuilderWrapper() {
  const router = useRouter();
  const pageBuilderRef = useRef<PageBuilderHandle>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveDraft = useCallback(async () => {
    if (pageBuilderRef.current) {
      setIsSaving(true);
      try {
        await pageBuilderRef.current.savePage("draft");
      } finally {
        setIsSaving(false);
      }
    }
  }, []);

  const handlePublish = useCallback(async () => {
    if (pageBuilderRef.current) {
      setIsSaving(true);
      try {
        await pageBuilderRef.current.savePage("published");
      } finally {
        setIsSaving(false);
      }
    }
  }, []);

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary dark:text-[#e5e5e5]">
              Create New Page
            </h1>
            <p className="text-secondary dark:text-[#929292] mt-1">
              Build a new page with block-based editor
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/app/pages")}
              className="px-4 py-2 bg-gray-300 dark:bg-[#424242] text-gray-900 dark:text-[#e5e5e5] rounded-lg hover:bg-gray-400 dark:hover:bg-[#525252] transition-colors"
              disabled={isSaving}
            >
              ← Back
            </button>
            <button
              onClick={handleSaveDraft}
              className="btn-secondary"
              disabled={isSaving}
            >
              Save Draft
            </button>
            <button
              onClick={handlePublish}
              className="btn-primary"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Publish"}
            </button>
          </div>
        </div>

        <div>
          <PageBuilder ref={pageBuilderRef} />
        </div>
      </div>
    </>
  );
}
