# Gallery of Works - Setup Guide

## 📋 Overview

Gallery of Works adalah fitur baru untuk menampilkan portfolio/galeri pekerjaan dengan sistem kategori dinamis. Konten terpisah dari Page Sections dan memiliki dashboard management sendiri.

### Fitur:

- ✅ Kategori dinamis (dapat ditambah/edit)
- ✅ Upload gambar ke R2 (akan di-setup di upload form)
- ✅ Rich text description
- ✅ Soft delete (data tidak hilang permanen)
- ✅ Display order customization
- ✅ Filter by category di frontend

---

## 🗄️ Database Setup

### 1. **PostgreSQL Migration**

Jalankan query SQL berikut di database PostgreSQL Anda:

```sql
-- Gallery Categories Table
CREATE TABLE gallery_categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

-- Gallery of Works Table
CREATE TABLE gallery_of_works (
  id SERIAL PRIMARY KEY,
  category_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  image_url TEXT NOT NULL,
  slug TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_by INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES gallery_categories(id)
);

-- Indexes for better query performance
CREATE INDEX idx_gallery_category ON gallery_of_works(category_id);
CREATE INDEX idx_gallery_deleted ON gallery_of_works(deleted_at);
CREATE INDEX idx_gallery_order ON gallery_of_works(display_order);
CREATE INDEX idx_gallery_cat_deleted ON gallery_categories(deleted_at);
```

### 2. **Drizzle Schema** (Already Added)

File: [lib/schema.ts](lib/schema.ts)

Dua tabel telah ditambahkan:

- `galleryCategories` - untuk manajemen kategori
- `galleryOfWorks` - untuk menyimpan item gallery

---

## 🔌 API Endpoints

### Admin API

#### **Create/Get Categories**

```
POST   /api/admin/gallery/categories     - Create kategori baru
GET    /api/admin/gallery/categories     - Ambil semua kategori
```

Request Body (POST):

```json
{
	"name": "Meeting",
	"slug": "meeting",
	"displayOrder": 0
}
```

#### **Manage Gallery Items**

```
GET    /api/admin/gallery/items          - Ambil semua items
POST   /api/admin/gallery/items          - Buat item baru
PUT    /api/admin/gallery/items          - Update item
DELETE /api/admin/gallery/items          - Hapus item (soft delete)
```

Request Body (POST/PUT):

```json
{
	"categoryId": 1,
	"title": "Our Ocean Conference",
	"subtitle": "Meeting & Conference",
	"description": "<p>Deskripsi event...</p>",
	"imageUrl": "https://pub-xxx.r2.dev/images/xxx.png",
	"slug": "our-ocean-conference",
	"displayOrder": 0
}
```

### Public API

```
GET    /api/public/gallery-of-works      - Ambil kategori + items
GET    /api/public/gallery-of-works?category=meeting - Filter by category
```

Response:

```json
{
	"categories": [
		{ "id": 1, "name": "Meeting", "slug": "meeting", "displayOrder": 0 },
		{ "id": 2, "name": "Incentive", "slug": "incentive", "displayOrder": 1 }
	],
	"items": [
		{
			"id": 1,
			"categoryId": 1,
			"title": "Our Ocean Conference",
			"subtitle": "Meeting & Conference",
			"description": "...",
			"imageUrl": "...",
			"slug": "our-ocean-conference",
			"displayOrder": 0
		}
	]
}
```

---

## 📱 Admin Dashboard

### Lokasi

```
/app/gallery-of-works
```

### Fitur

1. **Kategori Tab**
   - Lihat semua kategori
   - Tambah kategori baru
   - Edit order tampil

2. **Gallery Items Tab**
   - Lihat semua items
   - Tambah item (dengan image upload ke R2)
   - Edit item
   - Hapus item

### File

- [app/app/gallery-of-works/page.tsx](app/app/gallery-of-works/page.tsx)

---

## 🎨 Frontend Integration

### Display Gallery

```tsx
"use client";

import { useEffect, useState } from "react";

export default function GalleryOfWorks() {
	const [categories, setCategories] = useState([]);
	const [items, setItems] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState(null);

	useEffect(() => {
		const fetchGallery = async () => {
			const res = await fetch(
				`/api/public/gallery-of-works${
					selectedCategory ? `?category=${selectedCategory}` : ""
				}`,
			);
			const data = await res.json();
			setCategories(data.categories);
			setItems(data.items);
		};

		fetchGallery();
	}, [selectedCategory]);

	return (
		<section className="py-16">
			<h2 className="text-4xl font-light uppercase mb-8">Gallery of Work</h2>

			{/* Category Tabs */}
			<div className="flex space-x-4 mb-12 border-b border-gray-300 overflow-x-auto">
				<button
					onClick={() => setSelectedCategory(null)}
					className={`px-4 py-2 whitespace-nowrap ${
						selectedCategory === null
							? "border-b-2 border-black font-semibold"
							: "text-gray-600"
					}`}
				>
					ALL
				</button>
				{categories.map((cat) => (
					<button
						key={cat.id}
						onClick={() => setSelectedCategory(cat.slug)}
						className={`px-4 py-2 whitespace-nowrap uppercase text-sm ${
							selectedCategory === cat.slug
								? "border-b-2 border-black font-semibold"
								: "text-gray-600"
						}`}
					>
						{cat.name}
					</button>
				))}
			</div>

			{/* Gallery Grid */}
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
				{items.map((item) => (
					<div key={item.id} className="space-y-3">
						<img
							src={item.imageUrl}
							alt={item.title}
							className="w-full h-48 object-cover rounded"
						/>
						<p className="text-xs text-gray-600">{item.subtitle}</p>
						<h3 className="font-semibold text-sm">{item.title}</h3>
					</div>
				))}
			</div>
		</section>
	);
}
```

---

## 📸 Image Upload to R2

Untuk fitur upload image ke R2, gunakan existing upload endpoint:

```
POST   /api/upload        - Upload single image ke R2
```

File sudah ada, tinggal integrasikan di form edit item.

---

## 🛠️ Implementation Checklist

- [x] Database schema dibuat (PostgreSQL)
- [x] Drizzle ORM tables ditambahkan
- [x] Admin API endpoints dibuat (CRUD)
- [x] Public API endpoint dibuat
- [x] Admin UI dashboard dibuat
- [x] Menu di sidebar ditambahkan (`Gallery & Portfolio`)
- [x] Build verification passed
- [ ] **TODO: Image upload integration** (di upload form item)
- [ ] **TODO: Rich text editor** (di description field)
- [ ] **TODO: Frontend component** (untuk display gallery)

---

## 🚀 Next Steps

1. **Setup Database**: Jalankan SQL queries di PostgreSQL
2. **Sync Drizzle**: Jika perlu, jalankan `npm run db:push`
3. **Add Categories**: Buka `/app/gallery-of-works` → Kategori → Tambah kategori
4. **Add Items**: Tambah items dengan mengupload image ke R2
5. **Create Frontend Display**: Implementasi komponen gallery di halaman public

---

## 📝 Notes

- Soft delete diimplementasikan untuk kategori dan items
- Slug harus unik (handled di aplikasi, bukan di database)
- Display order 0 = paling atas
- Created by user ID saat ini hardcoded ke 1 (bisa ditingkatkan dengan auth session)
- Image upload perlu integrasi dengan endpoint `/api/upload` yang sudah ada

---

## 👨‍💻 File References

- Schema: [lib/schema.ts](lib/schema.ts)
- API Admin Categories: [app/api/admin/gallery/categories/route.ts](app/api/admin/gallery/categories/route.ts)
- API Admin Items: [app/api/admin/gallery/items/route.ts](app/api/admin/gallery/items/route.ts)
- API Public: [app/api/public/gallery-of-works/route.ts](app/api/public/gallery-of-works/route.ts)
- Admin Dashboard: [app/app/gallery-of-works/page.tsx](app/app/gallery-of-works/page.tsx)
- Sidebar: [app/components/Sidebar.tsx](app/components/Sidebar.tsx)
