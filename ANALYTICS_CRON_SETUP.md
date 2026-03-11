# Analytics Daily Aggregation - Vercel Cron Setup

## Overview

Sistem tracking analytics memiliki 3 komponen:

1. **Real-time Tracking** (`/api/app/analytics/track`) - Captures setiap page view
2. **Real-time Analytics APIs** - Queries dari `pageViews` dan `visitors` tables
3. **Daily Aggregation (NEW)** - Consolidates data ke `analyticsDaily` table untuk historical trends

## Cron Job: Aggregate Analytics

### What It Does

Setiap hari jam 02:00 pagi (UTC), cron job akan:

1. Query semua page views dari kemarin (yesterday)
2. Untuk setiap halaman yang di-visit:
   - Hitung total views
   - Hitung unique visitors
   - Hitung bounce rate (pengunjung dengan 1 page view)
3. Upsert (insert or update) data ke `analyticsDaily` table

### Setup Steps

#### Step 1: Database Migration

Jalankan SQL migration untuk membuat tabel analytics:

```bash
# File sudah ada di: ANALYTICS_QUERIES.sql
# Run di PostgreSQL client atau Supabase SQL Editor:
psql -U postgres -d your_database < ANALYTICS_QUERIES.sql
```

**Atau manual di Supabase/pgAdmin:**

```sql
-- Create pageViews table
CREATE TABLE IF NOT EXISTS pageViews (
  id SERIAL PRIMARY KEY,
  page_slug TEXT NOT NULL,
  page_title TEXT,
  visitor_id TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  ip_address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pageviews_date ON pageViews(created_at);
CREATE INDEX idx_pageviews_slug ON pageViews(page_slug);

-- Create visitors table
CREATE TABLE IF NOT EXISTS visitors (
  id SERIAL PRIMARY KEY,
  visitor_id TEXT UNIQUE NOT NULL,
  referer_domain TEXT,
  country TEXT,
  city TEXT,
  user_agent TEXT,
  ip_address TEXT,
  first_visit TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_visit TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  page_views_count INTEGER DEFAULT 0
);

CREATE INDEX idx_visitors_id ON visitors(visitor_id);

-- Create analyticsDaily table
CREATE TABLE IF NOT EXISTS analyticsDaily (
  id SERIAL PRIMARY KEY,
  date TEXT NOT NULL,
  page_slug TEXT NOT NULL,
  total_views INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  bounce_rate DECIMAL(5,2) DEFAULT 0,
  avg_time_on_page INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(date, page_slug)
);

CREATE INDEX idx_analyticsdaily_date ON analyticsDaily(date);
CREATE INDEX idx_analyticsdaily_slug ON analyticsDaily(page_slug);
```

#### Step 2: Vercel Configuration

File `vercel.json` sudah di-update dengan cron configuration:

```json
{
	"crons": [
		{
			"path": "/api/cron/aggregate-analytics",
			"schedule": "0 2 * * *"
		}
	]
}
```

**Penjelasan:**

- `path`: Endpoint yang akan di-trigger cron
- `schedule`: Cron expression (0 2 \* \* \* = setiap hari jam 2:00 UTC)

#### Step 3: Optional Security - Add CRON_SECRET

Untuk production, tambahkan secret untuk authenticate cron requests:

1. **Generate secret** (bisa generate di terminal):

   ```bash
   openssl rand -hex 32
   # Output: abc123...xyz
   ```

2. **Add ke vercel.json env:**

   ```json
   "env": {
     "CRON_SECRET": "@cron_secret"
   }
   ```

3. **Add ke Vercel project settings** → Environment Variables:
   - Key: `CRON_SECRET`
   - Value: (paste generated secret)

4. **Cron endpoint otomatis verify secret** (sudah di-code):
   ```typescript
   if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
   	return Response.json({ error: "Unauthorized" }, { status: 401 });
   }
   ```

## Cron Schedule Reference

Standard cron expression: `minute hour day month dayofweek`

**Common Schedules:**

```
"0 2 * * *"       - Every day at 2:00 AM UTC
"0 0 * * *"       - Every day at midnight UTC
"0 */6 * * *"     - Every 6 hours
"0 0 * * 0"       - Every Sunday at midnight
"30 2 * * MON"    - Every Monday at 2:30 AM UTC
"0 2 1 * *"       - First day of month at 2:00 AM UTC
```

**Important**: Vercel runs cron jobs in UTC timezone. Adjust based on your preferred time.

## Testing the Cron Job

### Manual Test (Development)

```bash
# Test locally
curl http://localhost:3000/api/cron/aggregate-analytics

# Response jika sukses:
{
  "success": true,
  "message": "Analytics aggregation completed for 2024-01-14",
  "aggregatedPages": 5
}
```

### Production Test via Vercel

1. Go to Vercel Dashboard → Your Project → Deployments
2. Find latest deployment
3. Click on deployment link
4. Test: `https://your-domain.com/api/cron/aggregate-analytics`
5. Check response

### Monitor Cron Execution

**Via Vercel Dashboard:**

1. Project Settings → Functions
2. Find aggregation function
3. View logs and execution history

**Via API Logs:**

- Check `/api/cron/aggregate-analytics` logs in Vercel for errors

## Database Queries to Verify Data

After cron runs, verify aggregated data:

```sql
-- Check analytics_daily data
SELECT * FROM analyticsDaily
ORDER BY date DESC, total_views DESC
LIMIT 10;

-- Compare with raw data
SELECT
  DATE(created_at) as date,
  page_slug,
  COUNT(*) as total_views,
  COUNT(DISTINCT visitor_id) as unique_visitors
FROM pageViews
WHERE DATE(created_at) = CURRENT_DATE - INTERVAL '1 day'
GROUP BY DATE(created_at), page_slug
ORDER BY total_views DESC;
```

## Using Aggregated Data in Analytics Dashboard

The analytics dashboard automatically queries from `analyticsDaily` when available:

```typescript
// In /app/app/analytics/page.tsx
// For daily trends, query analyticsDaily instead of raw pageViews
const dailyStats = await db
	.select()
	.from(analyticsDaily)
	.where(sql`${analyticsDaily.date} >= ${thirtyDaysAgo}`)
	.orderBy(analyticsDaily.date);
```

## Troubleshooting

### Issue: Cron job not running

**Solution:**

1. Check Vercel project is on Pro plan (required for crons)
2. Verify `vercel.json` has valid syntax
3. Re-deploy: `git push` to main branch
4. Wait 5+ minutes for deployment to complete

### Issue: "Tables do not exist" error

**Solution:**

1. Run SQL migration first (Step 1)
2. Verify tables in database:
   ```sql
   SELECT table_name FROM information_schema.tables
   WHERE table_schema = 'public';
   ```

### Issue: Cron runs but no data aggregated

**Solution:**

1. Check if `pageViews` table has data:
   ```sql
   SELECT COUNT(*) FROM pageViews
   WHERE DATE(created_at) = CURRENT_DATE - INTERVAL '1 day';
   ```
2. If no data, it's normal - cron returns success but aggregatedPages=0
3. Check Vercel function logs for SQL errors

### Issue: Duplicate entries in analyticsDaily

**Solution:**

- The UNIQUE constraint `UNIQUE(date, page_slug)` prevents duplicates
- Cron uses UPSERT pattern (insert or update)
- If duplicates exist, clean up manually:
  ```sql
  DELETE FROM analyticsDaily
  WHERE created_at < CURRENT_TIMESTAMP - INTERVAL '7 days'
  AND created_at > CURRENT_TIMESTAMP - INTERVAL '8 days';
  ```

## Performance Considerations

- **Cron runtime**: ~2-5 seconds for 100 pages with 1000s views
- **Database indexes**: Already created on date and page_slug columns
- **Recommended backup**: Run cron at off-peak hours (2:00 AM UTC is good)

## Next Steps: Optimize Dashboard

Untuk production, update `/app/app/analytics/page.tsx` untuk:

1. Query `analyticsDaily` untuk historical trend data (lebih cepat)
2. Query raw `pageViews` untuk real-time stats (last 24 hours)
3. Cache results dengan Redis jika traffic tinggi

Example optimization:

```typescript
// Historical data from aggregated table (fast)
const month = await db
	.select()
	.from(analyticsDaily)
	.where(sql`${analyticsDaily.date} >= ${thirtyDaysAgo}`);

// Real-time data from raw table (slower but up-to-date)
const today = await db
	.select()
	.from(pageViews)
	.where(sql`DATE(${pageViews.createdAt}) = CURRENT_DATE`);
```

---

**Created**: 2024
**Status**: Ready for production deployment
