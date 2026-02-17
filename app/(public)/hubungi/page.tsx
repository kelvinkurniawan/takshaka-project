import { ContactForm } from "@/components/public/ContactForm";

export const metadata = {
  title: "Hubungi Kami - NextCMS",
  description: "Hubungi tim NextCMS untuk pertanyaan dan dukungan",
};

export default function HubungiPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-r from-primary to-blue-600 text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold">Hubungi Kami</h1>
          <p className="text-xl text-blue-50 mt-4">
            Kami siap membantu menjawab setiap pertanyaan Anda
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Info */}
          <div className="lg:col-span-1">
            <div className="space-y-8">
              {/* Email */}
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Email
                </h3>
                <a
                  href="mailto:hello@nextcms.com"
                  className="text-primary hover:underline"
                >
                  hello@nextcms.com
                </a>
              </div>

              {/* Phone */}
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  Telepon
                </h3>
                <a
                  href="tel:+6281234567890"
                  className="text-primary hover:underline"
                >
                  +62 812-3456-7890
                </a>
              </div>

              {/* Address */}
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Alamat
                </h3>
                <p className="text-gray-700">
                  Jl. Innovation No. 123
                  <br />
                  Jakarta, Indonesia 12345
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <ContactForm />
          </div>
        </div>
      </div>
    </>
  );
}
