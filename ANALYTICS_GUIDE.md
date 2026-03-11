# Analytics Implementation Guide

## Overview

Sistem analytics ini melacak page views dan visitor behavior di website Anda. Data disimpan di database dan dapat dilihat di dashboard analytics admin.

## Database Setup

### 1. Run Migration Queries

Jalankan query SQL di database Anda:

```sql
-- Analytics Tables Setup

-- Table untuk tracking page views
CREATE TABLE IF NOT EXISTS page_views (
  id SERIAL PRIMARY KEY,
  page_slug TEXT NOT NULL,
  page_title TEXT,
  visitor_id TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  ip_address TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_page_views_slug ON page_views(page_slug);
CREATE INDEX IF NOT EXISTS idx_page_views_visitor ON page_views(visitor_id);
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at);

-- Table untuk tracking unique visitors
CREATE TABLE IF NOT EXISTS visitors (
  id SERIAL PRIMARY KEY,
  visitor_id TEXT UNIQUE NOT NULL,
  referer_domain TEXT,
  country TEXT,
  city TEXT,
  user_agent TEXT,
  ip_address TEXT,
  first_visit TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_visit TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  page_views_count INTEGER DEFAULT 1
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_visitors_id ON visitors(visitor_id);
CREATE INDEX IF NOT EXISTS idx_visitors_first_visit ON visitors(first_visit);
CREATE INDEX IF NOT EXISTS idx_visitors_last_visit ON visitors(last_visit);

-- Table untuk aggregate statistics (daily summary)
CREATE TABLE IF NOT EXISTS analytics_daily (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  page_slug TEXT NOT NULL,
  total_views INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  bounce_rate FLOAT,
  avg_time_on_page INTEGER,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(date, page_slug)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_analytics_daily_date ON analytics_daily(date);
CREATE INDEX IF NOT EXISTS idx_analytics_daily_slug ON analytics_daily(page_slug);
```

### 2. Verify in Drizzle

Schema sudah ditambahkan di `lib/schema.ts`:

- `pageViews`
- `visitors`
- `analyticsDaily`

## API Endpoints

### 1. Track Page View (Public)

**POST** `/api/app/analytics/track`

Mengirim page view dari client

```json
{
	"pageSlug": "tentang-kami",
	"pageTitle": "Tentang Kami - Website",
	"referrer": "https://google.com"
}
```

### 2. Analytics Overview (Admin)

**GET** `/api/app/analytics/overview?days=30`

Fetch summary analytics untuk periode tertentu

```json
Response:
{
  "period": { "days": 30, "startDate": "...", "endDate": "..." },
  "summary": {
    "totalViews": 1500,
    "uniqueVisitors": 450,
    "viewsTrend": 15.5,
    "avgViewsPerVisitor": "3.33"
  },
  "topPages": [...]
}
```

### 3. Pages Analytics (Admin)

**GET** `/api/app/analytics/pages?days=30&pageSlug=tentang-kami`

Detail analytics per halaman dengan breakdown

```json
Response:
{
  "pages": [...],
  "pageDetail": { "totalViews": 200, "topReferrers": [...] },
  "dailyStats": [...]
}
```

### 4. Visitors Analytics (Admin)

**GET** `/api/app/analytics/visitors?days=30`

Visitor statistics dan trends

```json
Response:
{
  "summary": {
    "newVisitors": 100,
    "returningVisitors": 50,
    "avgPageViewsPerVisitor": "2.5",
    "totalVisitors": 150
  },
  "topReferrers": [...],
  "dailyTrend": [...]
}
```

## Integration dengan Public Pages

### Implementasi Page Tracking

#### Opsi 1: Menggunakan Hook Helper (Recommended)

Tambahkan ke public page components (client-side):

```tsx
// app/(public)/tentang/page.tsx
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackPageView } from "@/lib/analytics-client";

export default function TentangPage() {
	const pathname = usePathname();

	useEffect(() => {
		// Track page view saat halaman diakses
		trackPageView(
			pathname,
			"Tentang Kami", // page title
			document.referrer,
		);
	}, [pathname]);

	return <div>{/* Content */}</div>;
}
```

#### Opsi 2: Wrapper Component

Buat reusable component:

```tsx
// components/AnalyticsTracker.tsx
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackPageView } from "@/lib/analytics-client";

interface AnalyticsTrackerProps {
	pageTitle: string;
}

export default function AnalyticsTracker({ pageTitle }: AnalyticsTrackerProps) {
	const pathname = usePathname();

	useEffect(() => {
		trackPageView(pathname, pageTitle, document.referrer);
	}, [pathname, pageTitle]);

	return null; // No UI needed
}
```

Usage:

```tsx
export default function TentangPage() {
	return (
		<>
			<AnalyticsTracker pageTitle="Tentang Kami" />
			{/* Content */}
		</>
	);
}
```

#### Opsi 3: Root Layout Global Tracking

```tsx
// app/(public)/layout.tsx
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackPageView } from "@/lib/analytics-client";

export default function PublicLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();

	useEffect(() => {
		trackPageView(pathname, document.title, document.referrer);
	}, [pathname]);

	return children;
}
```

### Tracking Manual Events (Optional)

Jika ingin track custom events:

```tsx
import { trackPageView } from "@/lib/analytics-client";

// Track download
const handleDownload = async (file: string) => {
	await trackPageView(
		`/download/${file}`,
		`Downloaded: ${file}`,
		document.referrer,
	);
	// ... rest of download logic
};
```

## Admin Dashboard

### Akses Analytics

1. Masuk ke admin dashboard: `/app`
2. Lihat **Analytics** di sidebar
3. Pilih period (7, 14, 30, atau 90 hari)

### Metrics yang Ditampilkan

#### Overview Cards

- **Total Page Views**: Jumlah total page views dalam period
- **Unique Visitors**: Jumlah unique visitors
- **Views Trend**: Persentase perubahan vs period sebelumnya
- **Avg Views/Visitor**: Rata-rata page views per visitor

#### Top Pages

- List 10 halaman paling banyak diakses
- Menampilkan page title dan slug
- Jumlah views per page

#### Visitor Summary

- Total visitors
- New visitors
- Returning visitors
- Rata-rata pages per visitor

#### Top Referrers

- Source referrer yang paling banyak
- Jumlah visitors dari setiap source

## Database Queries Reference

### Mendapatkan Total Views

```sql
SELECT COUNT(*) as total_views
FROM page_views
WHERE created_at >= NOW() - INTERVAL '30 days';
```

### Unique Visitors Terbaru

```sql
SELECT COUNT(DISTINCT visitor_id) as unique_visitors
FROM page_views
WHERE created_at >= NOW() - INTERVAL '30 days';
```

### Top Pages by Views

```sql
SELECT
  page_slug,
  page_title,
  COUNT(*) as views
FROM page_views
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY page_slug, page_title
ORDER BY views DESC
LIMIT 10;
```

### Visitor Details

```sql
SELECT
  visitor_id,
  first_visit,
  last_visit,
  page_views_count,
  referer_domain
FROM visitors
WHERE first_visit >= NOW() - INTERVAL '30 days'
ORDER BY last_visit DESC
LIMIT 100;
```

### Daily Stats

```sql
SELECT
  DATE(created_at) as date,
  page_slug,
  COUNT(*) as total_views,
  COUNT(DISTINCT visitor_id) as unique_visitors
FROM page_views
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at), page_slug
ORDER BY date DESC;
```

## Advanced: Rate Limiting

Jika ingin batasi tracking requests (optional):

```tsx
import { trackPageView } from "@/lib/analytics-client";

let lastTrackTime = 0;
const TRACK_COOLDOWN = 5000; // 5 seconds

export async function throttledTrack(
	slug: string,
	title: string,
	referrer: string,
) {
	const now = Date.now();
	if (now - lastTrackTime > TRACK_COOLDOWN) {
		lastTrackTime = now;
		await trackPageView(slug, title, referrer);
	}
}
```

## Troubleshooting

### Analytics tidak tercatat

1. Cek apakah `trackPageView()` sudah dipanggil
2. Cek console browser untuk errors
3. Verify database connection
4. Cek network tab - request harus ke `/api/app/analytics/track`

### Performance Issues

1. Indexes sudah dibuat? Check query plans
2. Pertimbangkan archive old data
3. Gunakan `analyticsDaily` untuk aggregate reports

### Privacy Considerations

- Visitor ID di-hash dari IP + UserAgent (anonymous)
- Tidak menyimpan personally identifiable info
- LocalStorage digunakan untuk consistent visitor tracking

## Next Steps

1. ✅ Setup database tables (run SQL queries)
2. ✅ Review API endpoints
3. ✅ Implement tracking di public pages
4. ✅ Test analytics dashboard
5. Optional: Setup cron job untuk daily aggregation
6. Optional: Export analytics data ke external services
