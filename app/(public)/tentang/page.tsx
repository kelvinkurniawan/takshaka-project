export const metadata = {
  title: "Tentang Kami - NextCMS",
  description: "Pelajari lebih lanjut tentang NextCMS dan misi kami",
};

export default function TentangPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-r from-primary to-blue-600 text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold">Tentang Kami</h1>
          <p className="text-xl text-blue-50 mt-4">
            Pelajari kisah di balik NextCMS
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Siapa Kami?</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            NextCMS adalah platform headless CMS modern yang dirancang untuk
            memenuhi kebutuhan manajemen konten digital di era modern. Kami
            percaya bahwa setiap bisnis, dari startup hingga enterprise, berhak
            memiliki akses ke teknologi CMS yang powerful namun mudah digunakan.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Dengan menggunakan teknologi terkini seperti Next.js 15, Drizzle
            ORM, SQLite, dan Cloudflare Workers, kami menghadirkan solusi yang
            tidak hanya cepat dan scalable, tetapi juga cost-effective.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Misi Kami</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Memberdayakan setiap kreator dan bisnis dengan tools manajemen
            konten yang modern, aman, dan terjangkau. Kami ingin membuat
            teknologi CMS yang kompleks menjadi mudah dipahami dan
            diimplementasikan oleh siapa saja.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Nilai-Nilai Kami</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Inovasi</h3>
              <p className="text-gray-700">
                Kami terus berinovasi untuk menghadirkan fitur-fitur terbaru
                yang memenuhi kebutuhan pasar
              </p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Kualitas</h3>
              <p className="text-gray-700">
                Setiap fitur dan update diuji secara menyeluruh untuk memastikan
                kualitas terbaik
              </p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Keamanan</h3>
              <p className="text-gray-700">
                Data dan keamanan pengguna adalah prioritas utama kami dalam
                setiap keputusan
              </p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Transparansi</h3>
              <p className="text-gray-700">
                Kami percaya pada komunikasi yang jujur dan transparan dengan
                komunitas kami
              </p>
            </div>
          </div>
        </section>

        <section className="bg-primary text-white rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Tertarik Bekerja Sama?</h2>
          <p className="text-lg text-blue-50 mb-8">
            Hubungi kami untuk mengetahui bagaimana NextCMS dapat membantu
            bisnis Anda
          </p>
          <a
            href="/hubungi"
            className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
          >
            Hubungi Kami
          </a>
        </section>
      </div>
    </>
  );
}
