# Curated Experiences Seeder SQL - Quick Reference

## File Location

📁 `/seed-curated-experiences.sql`

## What's Included

### **5 Categories** with detailed descriptions:

1. **Adventure Tours** - Mountain climbing, jungle safaris, rock climbing, rafting, desert expeditions
2. **Beach Escapes** - Tropical islands, luxury villas, snorkeling, sailing, wellness retreat
3. **Cultural Heritage** - Ancient temples, traditional crafts, culinary heritage, museums, indigenous culture
4. **Luxury Retreats** - Private islands, alpine chalets, palace hotels, golf resorts, helicopter tours
5. **Wellness & Spa** - Ayurvedic healing, yoga, detox retreats, spa packages, fitness bootcamp

### **23 Articles** (minimum 4 per category, max 5):

- **Adventure Tours**: 5 articles
- **Beach Escapes**: 5 articles
- **Cultural Heritage**: 5 articles
- **Luxury Retreats**: 5 articles
- **Wellness & Spa**: 5 articles (23 total)

## Article Details

Each article includes:

- ✅ Unique title and slug
- ✅ Rich HTML content (paragraphs of descriptive text)
- ✅ Detailed excerpt (auto-truncated by app)
- ✅ Featured image (Unsplash URLs - real working images)
- ✅ Status: `published` (visible immediately)
- ✅ SEO metadata (meta_title, meta_description, meta_keywords)
- ✅ OG tags for social sharing (og_title, og_description, og_image)
- ✅ Timestamps (using NOW())

## How to Run

### **In Supabase SQL Editor:**

1. Open your Supabase project
2. Go to **SQL Editor**
3. Click **New Query**
4. Copy and paste the entire contents of `seed-curated-experiences.sql`
5. Click **RUN**
6. Check the notification for success

### **Via Command Line (if using psql):**

```bash
psql [DATABASE_URL] < seed-curated-experiences.sql
```

### **In Database Client:**

1. Connect to your database
2. Open `seed-curated-experiences.sql`
3. Execute

## Important Notes

⚠️ **User ID**: The seeder uses `created_by: 1`

- If your admin user has a different ID, search and replace all instances of `, 1,` with the correct user ID
- Or replace just the `created_by` field in INSERT statements

⚠️ **Images**: All featured images use Unsplash URLs

- These are stable, publicly available images
- If you want custom images later, update the `featured_image` field in the contents table

⚠️ **Timestamps**: Uses PostgreSQL `NOW()` function

- Automatically sets creation/update times to current time
- If running in a different timezone, results will reflect that timezone

## Verification

After running the seeder, uncomment and run these queries to verify:

```sql
-- Check total categories
SELECT COUNT(*) as total_categories FROM categories WHERE deleted_at IS NULL;

-- Check total articles
SELECT COUNT(*) as total_articles FROM contents WHERE status = 'published' AND deleted_at IS NULL;

-- Check article count per category
SELECT c.name, COUNT(ar.id) as article_count
FROM categories c
LEFT JOIN contents ar ON ar.category_id = c.id AND ar.deleted_at IS NULL
WHERE c.deleted_at IS NULL
GROUP BY c.id, c.name
ORDER BY c.id;
```

Expected results:

- ✅ 5 categories
- ✅ 23 published articles
- ✅ Each category has 4-5 articles

## What Gets Created

After running the seeder:

- 5 category entries in `categories` table
- 23 article entries in `contents` table
- All articles linked to appropriate categories via `category_id`
- All articles status = 'published' (visible on frontend immediately)
- All articles have featured images and complete metadata

## Frontend Impact

After seeding, you can immediately:

1. Go to the Curated Experiences section in admin
2. Click "Select Categories"
3. Select any/all categories
4. See articles auto-populate in real-time
5. Publish page with live content

The section will display:

- 5 tabs (one per category)
- Articles from each category
- Featured images (Unsplash images)
- Truncated excerpts (max 120 chars)
- All SEO metadata visible

## Modifying Before Running

If you want to customize before seeding:

1. **Change user ID**: Find/replace `, 1,` with your user ID
2. **Change featured images**: Replace Unsplash URLs with your image URLs
3. **Modify content**: Edit article titles, excerpts, and body text
4. **Add more articles**: Copy-paste article INSERT blocks and increment values
5. **Remove categories**: Delete specific INSERT blocks for unwanted categories

## Rollback

If you need to delete seeded data:

```sql
-- Delete all seeded articles
DELETE FROM contents
WHERE category_id IN (
  SELECT id FROM categories
  WHERE slug IN ('adventure-tours', 'beach-escapes', 'cultural-heritage', 'luxury-retreats', 'wellness-spa')
);

-- Delete all seeded categories
DELETE FROM categories
WHERE slug IN ('adventure-tours', 'beach-escapes', 'cultural-heritage', 'luxury-retreats', 'wellness-spa');
```

---

**Ready to use!** 🎉 Just copy the SQL file contents and run in your database.
