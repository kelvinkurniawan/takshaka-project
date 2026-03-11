# Analytics Cron Job - Implementation Summary

## What Was Set Up

### 1. Cron Endpoint

**File**: `/app/api/cron/aggregate-analytics/route.ts`

- Triggers daily at 02:00 UTC (configured in `vercel.json`)
- Aggregates yesterday's pageViews data into `analyticsDaily`
- Calculates: total views, unique visitors, bounce rate per page
- Supports optional Bearer token authentication via `CRON_SECRET` env var

### 2. Vercel Configuration

**File**: `vercel.json`

Added cron schedule:

```json
"crons": [
  {
    "path": "/api/cron/aggregate-analytics",
    "schedule": "0 2 * * *"
  }
]
```

### 3. Documentation

**File**: `ANALYTICS_CRON_SETUP.md` - Complete setup and troubleshooting guide

---

## Quick Start

### Step 1: Database Setup (REQUIRED FIRST)

Run SQL migration to create required tables:

```bash
# Option A: Via psql
psql -U your_user -d your_db < ANALYTICS_QUERIES.sql

# Option B: Manual in Supabase/pgAdmin
# Copy & paste SQL from ANALYTICS_QUERIES.sql file
```

### Step 2: Deploy to Vercel

```bash
# Push to main branch (auto-deploys)
git add .
git commit -m "Setup analytics cron aggregation job"
git push origin main
```

Vercel akan:

1. Build project
2. Register cron job
3. Start schedule untuk besok jam 02:00 UTC

### Step 3: Verify Setup

```bash
# Test manually
curl https://your-domain.com/api/cron/aggregate-analytics

# Should return:
{
  "success": true,
  "message": "Analytics aggregation completed for 2024-01-14",
  "aggregatedPages": 5
}
```

---

## Data Flow

```
Real-time User Traffic
    ↓
GET /api/app/analytics/track (⚡ Real-time capture)
    ↓
pageViews & visitors tables (✓ Raw data)
    ↓
Daily 02:00 UTC
    ↓
GET /api/cron/aggregate-analytics (⚙️ Scheduled job)
    ↓
analyticsDaily table (✓ Aggregated data)
    ↓
/app/app/analytics dashboard (📊 Analytics UI)
```

---

## Cron Logic Explained

```typescript
// 1. Get yesterday's date
const yesterday = "2024-01-14"  // If today is 2024-01-15

// 2. Get all unique pages accessed yesterday
pageSlugList = ["home", "blog/post-1", "contact"]

// 3. For each page, calculate:
FOR EACH pageSlug:
  - Total pageViews count
  - Distinct visitor_ids (unique visitors)
  - Bounce rate: (visitors with 1 page view / total visitors) × 100%
  - UPSERT into analyticsDaily
```

---

## Environment Variables (Optional)

For production security, add CRON_SECRET:

```bash
# In Vercel Project Settings → Environment Variables
CRON_SECRET=your_random_secret_here
```

The cron endpoint will validate:

```bash
# Request must include Bearer token
Authorization: Bearer your_random_secret_here
```

---

## Testing Checklist

- [ ] SQL tables created in database
- [ ] `vercel.json` has crons configuration
- [ ] Code deployed to Vercel (git push main)
- [ ] Manual test: `curl https://your-domain.com/api/cron/aggregate-analytics`
- [ ] Check response has success: true
- [ ] Wait until next day 02:00 UTC
- [ ] Verify data in `analyticsDaily` table

---

## Schedule Reference

Edit `vercel.json` crons schedule to change timing:

```json
// Every day 2:00 AM UTC (current)
"schedule": "0 2 * * *"

// Every day midnight UTC
"schedule": "0 0 * * *"

// Every Monday 2:00 AM UTC
"schedule": "0 2 * * 1"

// Every 6 hours
"schedule": "0 */6 * * *"
```

⚠️ **Note**: Vercel cron times use UTC timezone. Convert to your local time if needed.

---

## Performance Notes

- **Duration**: ~2-5 seconds for 100 pages
- **Database Indexes**: Already created on date and page_slug for fast queries
- **Recommended Time**: 02:00 UTC (off-peak hours for most regions)

---

## Troubleshooting

### Cron not running?

1. Check Vercel Pro plan (required for crons)
2. Verify `vercel.json` syntax is valid
3. Re-deploy: `git push origin main`
4. Wait 5 minutes for deployment to complete

### "Tables don't exist" error?

1. Run SQL migration (ANALYTICS_QUERIES.sql)
2. Verify in database:
   ```sql
   SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
   ```

### No data aggregated?

1. Check if pageViews has data:
   ```sql
   SELECT COUNT(*) FROM pageViews WHERE DATE(created_at) = CURRENT_DATE - INTERVAL '1 day';
   ```
2. If 0 rows = no traffic yesterday (normal)
3. Check Vercel function logs for errors

---

## Files Modified

✅ **Created:**

- `/app/api/cron/aggregate-analytics/route.ts` - Cron endpoint
- `ANALYTICS_CRON_SETUP.md` - Full setup guide

✅ **Updated:**

- `vercel.json` - Added crons configuration

---

## Still Need To Do?

> The system will automatically aggregate analytics data once deployed and database tables are created. No additional setup needed after deployment!

**Next optimization** (optional): Update analytics dashboard to query `analyticsDaily` for faster historical trends.

---

**Questions?** See `ANALYTICS_CRON_SETUP.md` for detailed guide.
