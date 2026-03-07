# Public Pages & Blog Dokumentasi

## Overview

Takshaka CMS sekarang memiliki public-facing pages yang memungkinkan pengunjung untuk melihat konten published tanpa memerlukan authentikasi. Struktur ini mengikuti pattern yang sama dengan https://takshaka.id/ dengan halaman landing (home), blog listing, dan halaman detail.

## Struktur File

### Public Routes (`/app/(public)/`)

Public pages menggunakan route group `(public)` dengan layout custom sendiri:

```
app/(public)/
├── layout.tsx              # Public layout dengan header & footer
├── page.tsx                # Landing page (/)
├── blog/
│   ├── page.tsx           # Blog listing (/blog)
│   └── [slug]/
│       └── page.tsx       # Blog detail (/blog/[slug])
├── pages/
│   └── [slug]/
│       └── page.tsx       # Static page (/pages/[slug])
├── tentang/
│   └── page.tsx           # About page (/tentang)
└── hubungi/
    └── page.tsx           # Contact page (/hubungi)
```

### Public API Routes (`/app/api/public/`)

API endpoints khusus untuk public content yang hanya mengembalikan published items:

```
app/api/public/
├── pages/
│   ├── route.ts           # GET /api/public/pages - List published pages
│   └── [slug]/
│       └── route.ts       # GET /api/public/pages/[slug] - Get single page
└── contents/
    ├── route.ts           # GET /api/public/contents - List published contents
    └── [slug]/
        └── route.ts       # GET /api/public/contents/[slug] - Get single content
```

### Components

- **PublicHeader.tsx** - Navigation header dengan responsive mobile menu
- **PublicFooter.tsx** - Footer dengan links dan social media
- **BlogCard.tsx** - Reusable component untuk display blog articles
- **SearchableBlogList.tsx** - Client component untuk search functionality di blog listing
- **ContactForm.tsx** - Client component untuk form submission di hubungi page

## Dynamic Landing Page dengan Settings

Landing page (`/`) sekarang **fully dynamic** dan dapat dikonfigurasi melalui Settings di dashboard admin.

### Settings Endpoint

**GET `/api/public/settings`** - Public endpoint (tidak perlu autentikasi)

Return semua settings dalam format object:

```json
{
	"site_title": "Takshaka CMS",
	"site_description": "Headless CMS modern",
	"hero_title": "Takshaka CMS Platform",
	"hero_description": "Headless CMS modern yang powerful...",
	"show_features": "true",
	"show_articles": "true",
	"index_page": "1"
}
```

### Konfigurasi Landing Page

Buat atau update settings berikut di dashboard (`/app/settings`) untuk mengontrol tampilan landing page:

| Setting Key        | Type           | Default                  | Deskripsi                               |
| ------------------ | -------------- | ------------------------ | --------------------------------------- |
| `site_title`       | string         | "Takshaka CMS"           | Judul website                           |
| `site_description` | string         | "Headless CMS modern..." | Deskripsi website                       |
| `hero_title`       | string         | "Takshaka CMS Platform"  | Judul hero section                      |
| `hero_description` | string         | "Headless CMS modern..." | Deskripsi hero section                  |
| `show_features`    | boolean/string | "true"                   | Tampilkan fitur section? (true/false)   |
| `show_articles`    | boolean/string | "true"                   | Tampilkan artikel terbaru? (true/false) |

### Cara Mengatur Settings

1. **Login** ke dashboard (`/app/dashboard` → Settings)
2. **Buat setting baru** dengan format:
   - Key: `hero_title`
   - Value: `Judul Hero Anda`
   - Type: `string` (atau `boolean` untuk true/false)
   - Description: `Judul di bagian hero section landing page`
3. **Save** - perubahan langsung apply (ISR 1 jam untuk revalidation)

### Contoh Konfigurasi Lengkap

**Landing page dengan dari settings:**

```
hero_title: "Solusi CMS Terdepan"
hero_description: "Platform manajemen konten yang aman, cepat, dan mudah digunakan"
show_features: "true"
show_articles: "true"
site_title: "Solusi CMS"
site_description: "Platform CMS modern untuk bisnis Anda"
```

Landing page akan automatically render dengan nilai-nilai setting tersebut.

### Behavior

- **Hero Section**: Selalu tampil, konten dari `hero_title` + `hero_description`
- **Features Section**: Conditional, tampil jika `show_features` = "true"
- **Articles Section**: Conditional, tampil jika `show_articles` = "true" dan ada published articles
- **CTA Section**: Selalu tampil (Hubungi Kami)

## Features

### 1. Landing Page (`/`)

Halaman depan yang menampilkan:

- Hero section dengan call-to-action
- Features highlight (3 fitur utama)
- Latest articles dari database (limit 6)
- CTA untuk hubungi kami

Fetching data dari `/api/public/contents` dengan revalidate setiap 1 jam.

### 2. Blog Listing (`/blog`)

Client-side component dengan:

- Search functionality untuk filter articles
- List semua published contents
- Pagination-friendly display (dapat ditambah di masa depan)
- Link ke detail article

### 3. Blog Detail (`/blog/[slug]`)

Single article page dengan:

- Featured image (jika ada)
- Full content HTML rendering
- Publish date
- Meta information
- Navigation kembali ke blog listing

### 4. Static Pages (`/pages/[slug]`)

Generic page viewer untuk pages yang dipublish via CMS:

- Flexible content rendering
- Meta title & description support
- Navigation

### 5. Built-in Pages

- **Tentang** (`/tentang`) - About page
- **Hubungi** (`/hubungi`) - Contact form page

## API Endpoints

### GET `/api/public/pages`

Return semua published pages (soft-deleted filtered out):

```json
[
	{
		"id": 1,
		"title": "About Us",
		"slug": "about-us",
		"content": "<h1>...</h1>",
		"status": "published",
		"metaTitle": "...",
		"metaDescription": "..."
	}
]
```

### GET `/api/public/pages/[slug]`

Return single published page atau 404:

```json
{
	"id": 1,
	"title": "About Us",
	"slug": "about-us",
	"content": "<h1>...</h1>",
	"status": "published"
}
```

### GET `/api/public/contents`

Return semua published contents (articles) dengan optional filters:

**Query Parameters:**

- `type` - Filter by content type (e.g., "article", "news")
- `categoryId` - Filter by category ID

```json
[
	{
		"id": 1,
		"title": "Article Title",
		"slug": "article-slug",
		"content": "...",
		"excerpt": "...",
		"type": "article",
		"status": "published",
		"featuredImage": "...",
		"publishedAt": "2026-02-17T00:00:00Z"
	}
]
```

### GET `/api/public/contents/[slug]`

Return single published content atau 404.

## Database Requirements

Public pages require:

1. **Contents Table** dengan fields:
   - `status` (draft/published/archived)
   - `publishedAt` (timestamp)
   - `slug` (unique per content)
   - `featuredImage` (optional)
   - `excerpt` (optional)
   - `type` (optional, untuk categorization)

2. **Pages Table** dengan fields:
   - `status` (draft/published)
   - `slug` (unique per page)
   - `content` (dapat HTML atau JSON blocks)
   - `metaTitle`, `metaDescription` (optional)

## Styling

Public pages menggunakan Tailwind CSS dengan custom theme:

- Warna primary dari CSS variables (--primary)
- Background dari CSS variables (--background)
- Responsive design dengan mobile-first approach

## How to Use

### 1. Publis Content dari Dashboard

1. Login ke `/app/dashboard/content`
2. Buat atau edit content
3. Set status ke "published"
4. Set publishedAt ke waktu saat ini
5. Save

Content akan otomatis tampil di:

- `/blog/[slug]` (detail page)
- `/blog` (listing)
- `/` (landing page - max 6 articles)

### 2. Publis Pages dari Dashboard

1. Login ke `/app/dashboard/pages`
2. Buat atau edit page
3. Set status ke "published"
4. Save

Page akan accessible di `/pages/[slug]`

### 3. Search & Filter

Blog listing memiliki search functionality client-side, search berdasarkan:

- Title
- Excerpt

Untuk filter backend (category, type), gunakan query params di API.

## Performance Optimizations

1. **Landing page revalidation** - ISR (Incremental Static Regeneration) setiap 1 jam
2. **Blog listing** - Client-side search (minimal server load)
3. **Soft deletes** - Filter di application layer, bukan database
4. **Published check** - Hanya status="published" yang ditampilkan

## Future Enhancements

Fitur yang dapat ditambahkan:

- [ ] Pagination untuk blog listing
- [ ] Search optimization (Elasticsearch/Meilisearch)
- [ ] Comments/discussion section
- [ ] Related articles
- [ ] SEO optimization (meta tags, structured data)
- [ ] Social sharing buttons
- [ ] Reading time estimate
- [ ] Newsletter subscription
- [ ] Dark mode toggle
- [ ] Internationalization (i18n)

## Route Protection

**PENTING:** Routes di `(public)` tidak memerlukan autentikasi. Jika ingin protect route tertentu, gunakan folder `(app)` atau middleware.

Autentikasi routes:

- `/app/...` - Protected dengan auth middleware
- `/api/auth/...` - Public endpoints untuk login/logout

Public routes:

- `/blog` - Public (no auth)
- `/tentang` - Public (no auth)
- `/hubungi` - Public (no auth)
- `/pages/[slug]` - Public (no auth)

## Troubleshooting

### 404 pada public page

**Kemungkinan:**

1. Content/page tidak dipublish (`status !== "published"`)
2. Content/page sudah soft-deleted (`deletedAt !== null`)
3. Slug tidak match exactly (case-sensitive)

Cek di dashboard atau database.

### Content tidak muncul di landing page

**Kemungkinan:**

1. Content status masih "draft"
2. `publishedAt` belum diset
3. Masih dalam revalidation window (max 1 jam)

Force update dengan:

```bash
# Clean build
rm -rf .next
npm run build
```

### Images tidak tampil

**Solusi:**

1. Pastikan featured image URL accessible
2. Gunakan relative path atau full URL
3. Untuk optimization, ganti `<img>` dengan `<Image>` dari Next.js
