"use client";

import { useRouter } from "next/navigation";
import { Lock, Home, ChevronLeft } from "lucide-react";

export default function AccessDeniedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary px-4 py-8">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative max-w-md w-full">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full">
            <Lock className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
        </div>

        {/* Heading */}
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Akses Ditolak</h1>
          <p className="text-secondary text-sm">
            Anda tidak memiliki izin untuk mengakses halaman ini
          </p>
        </div>

        {/* Description */}
        <div className="bg-secondary border border-primary rounded-lg p-4 mb-8 text-center">
          <p className="text-secondary text-sm">
            Hubungi administrator jika Anda merasa ini adalah kesalahan.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => router.back()}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-secondary text-gray-900 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-all duration-200 border border-primary"
          >
            <ChevronLeft className="w-4 h-4" />
            Kembali
          </button>
          <a
            href="/app/dashboard"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-200"
          >
            <Home className="w-4 h-4" />
            Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
