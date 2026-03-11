# SQL Queries untuk Setup Analytics Database

Jalankan query berikut di database Anda untuk membuat tables analytics:

```sql
-- ============================================
-- ANALYTICS TABLES SETUP
-- ============================================

-- 1. Page Views Table
-- Menyimpan setiap kali halaman diakses
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

-- Indexes untuk performance
CREATE INDEX IF NOT EXISTS idx_page_views_slug ON page_views(page_slug);
CREATE INDEX IF NOT EXISTS idx_page_views_visitor ON page_views(visitor_id);
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at);


-- 2. Visitors Table
-- Menyimpan info unik visitors
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

-- Indexes untuk performance
CREATE INDEX IF NOT EXISTS idx_visitors_id ON visitors(visitor_id);
CREATE INDEX IF NOT EXISTS idx_visitors_first_visit ON visitors(first_visit);
CREATE INDEX IF NOT EXISTS idx_visitors_last_visit ON visitors(last_visit);


-- 3. Analytics Daily Table (Optional)
-- Untuk menyimpan aggregate data per hari
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

-- Indexes untuk performance
CREATE INDEX IF NOT EXISTS idx_analytics_daily_date ON analytics_daily(date);
CREATE INDEX IF NOT EXISTS idx_analytics_daily_slug ON analytics_daily(page_slug);


-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check if tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name IN ('page_views', 'visitors', 'analytics_daily');

-- Check indexes
SELECT indexname FROM pg_indexes 
WHERE schemaname = 'public' AND tablename IN ('page_views', 'visitors', 'analytics_daily');


-- ============================================
-- USEFUL QUERIES FOR ANALYTICS
-- ============================================

-- Total page views dalam 30 hari terakhir
SELECT COUNT(*) as total_views 
FROM page_views 
WHERE created_at >= NOW() - INTERVAL '30 days';

-- Unique visitors dalam 30 hari terakhir
SELECT COUNT(DISTINCT visitor_id) as unique_visitors 
FROM page_views 
WHERE created_at >= NOW() - INTERVAL '30 days';

-- Top 10 pages
SELECT 
  page_slug,
  page_title,
  COUNT(*) as views
FROM page_views 
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY page_slug, page_title
ORDER BY views DESC
LIMIT 10;

-- Top 10 referrers
SELECT 
  referer_domain,
  COUNT(*) as count
FROM visitors
WHERE first_visit >= NOW() - INTERVAL '30 days'
GROUP BY referer_domain
ORDER BY count DESC
LIMIT 10;

-- New vs Returning visitors
SELECT 
  'New' as visitor_type,
  COUNT(*) as count
FROM visitors
WHERE first_visit >= NOW() - INTERVAL '30 days'
UNION ALL
SELECT 
  'Returning' as visitor_type,
  COUNT(*) as count
FROM visitors
WHERE first_visit < NOW() - INTERVAL '30 days'
  AND last_visit >= NOW() - INTERVAL '30 days';

-- Daily visitor trend
SELECT 
  DATE(created_at) as date,
  COUNT(DISTINCT visitor_id) as unique_visitors,
  COUNT(*) as total_views
FROM page_views
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Average page views per visitor
SELECT 
  COUNT(*) / COUNT(DISTINCT visitor_id) as avg_views_per_visitor
FROM page_views
WHERE created_at >= NOW() - INTERVAL '30 days';


-- ============================================
-- MAINTENANCE QUERIES
-- ============================================

-- Delete old data (older than 1 year)
DELETE FROM page_views 
WHERE created_at < NOW() - INTERVAL '1 year';

DELETE FROM visitors 
WHERE last_visit < NOW() - INTERVAL '1 year';

-- Analyze tables for better query performance
ANALYZE page_views;
ANALYZE visitors;
ANALYZE analytics_daily;

-- Reindex tables (if needed)
REINDEX TABLE page_views;
REINDEX TABLE visitors;
REINDEX TABLE analytics_daily;
```

## Cara Menjalankan

### PostgreSQL Client
```bash
psql -U username -d database_name -f ANALYTICS_SETUP.sql
```

### DBeaver / DataGrip / pgAdmin
Copy-paste query ke SQL editor dan run

### Jika menggunakan Supabase
1. Buka Supabase console
2. Pilih project
3. Go ke SQL Editor
4. Paste query
5. Click RUN

## Verification

Setelah setup, verify dengan query:
```sql
SELECT COUNT(*) FROM page_views;
SELECT COUNT(*) FROM visitors;
```

Keduanya seharusnya return 0 (kosong) di awal, dan akan bertambah saat users mengakses halaman.
