import ContentManager from "@/app/components/dashboard/content/ContentManager";

export default function ContentPage() {
  return (
    <div className="space-y-6">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-header-title">Manajemen Konten</h1>
          <p className="dashboard-header-subtitle">
            Kelola konten, artikel, dan berita Anda
          </p>
        </div>
      </div>

      <div className="px-8 pb-8">
        <ContentManager />
      </div>
    </div>
  );
}
