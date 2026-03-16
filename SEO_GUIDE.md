# SEO Configuration Guide

Anda telah mengatur sitemap, robots.txt, dan structured data untuk SEO maksimal. Berikut panduan lengkapnya:

## 📋 Files yang Telah Dibuat

### 1. **app/sitemap.ts** (Dynamic Sitemap)

- Otomatis generate sitemap XML dari database
- Include semua published pages dan contents
- Accessible di: `https://yoursite.com/sitemap.xml`
- Update otomatis saat ada perubahan di database

### 2. **public/robots.txt** (Search Engine Instructions)

- Tell search engines apa yang boleh dicrawl
- Disallow admin dan API routes
- Block bad bots (Ahrefs, Semrush, dll)
- Point ke sitemap.xml

### 3. **lib/structured-data.ts** (JSON-LD Schema)

- Helper functions untuk generate schema markup
- Support: Organization, Article, BlogPosting, FAQ, Product, LocalBusiness, dll

## 🔧 Cara Menggunakan Structured Data

### Di Homepage (app/layout.tsx):

```tsx
import {
	generateOrganizationSchema,
	generateWebsiteSchema,
	cleanSchema,
} from "@/lib/structured-data";

export async function generateMetadata() {
	const { name, description } = await getAppMetadata();

	const organizationSchema = generateOrganizationSchema({
		baseUrl: process.env.NEXT_PUBLIC_API_URL || "https://yourdomain.com",
		siteName: name,
		siteDescription: description,
		logoUrl: "https://yourdomain.com/logo.png",
		email: "contact@yourdomain.com",
		phone: "+1-234-567-8900",
		socialProfiles: [
			"https://facebook.com/yourpage",
			"https://twitter.com/yourpage",
			"https://instagram.com/yourpage",
		],
	});

	const websiteSchema = generateWebsiteSchema({
		baseUrl: process.env.NEXT_PUBLIC_API_URL || "https://yourdomain.com",
		siteName: name,
		siteDescription: description,
	});

	return {
		title: name,
		description: description,
		// ... metadata lainnya
	};
}

export default function RootLayout({ children }) {
	return (
		<html>
			<head>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(
							cleanSchema({
								"@context": "https://schema.org",
								"@graph": [organizationSchema, websiteSchema],
							}),
						),
					}}
				/>
			</head>
			<body>{children}</body>
		</html>
	);
}
```

### Untuk Blog Posts:

```tsx
import { generateBlogPostingSchema, cleanSchema } from "@/lib/structured-data";

export default async function BlogPost({ params }) {
	const post = await getPost(params.slug);

	const schema = generateBlogPostingSchema({
		title: post.title,
		description: post.excerpt,
		content: post.content,
		image: post.featuredImage,
		author: {
			name: post.author?.name,
			url: `https://yourdomain.com/author/${post.author?.id}`,
		},
		datePublished: post.publishedAt,
		dateModified: post.updatedAt,
		url: `https://yourdomain.com/blog/${post.slug}`,
		keywords: post.metaKeywords?.split(","),
	});

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(cleanSchema(schema)),
				}}
			/>
			{/* content */}
		</>
	);
}
```

### Untuk FAQ Page:

```tsx
import { generateFAQPageSchema, cleanSchema } from "@/lib/structured-data";

export default async function FAQPage() {
	const faqs = await getFAQs();

	const schema = generateFAQPageSchema(
		faqs.map((faq) => ({
			question: faq.question,
			answer: faq.answer,
		})),
	);

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(cleanSchema(schema)),
				}}
			/>
			{/* FAQ content */}
		</>
	);
}
```

## ✅ SEO Checklist

### Meta Tags (Already in place)

- [x] `<meta name="viewport">` - Mobile responsive
- [x] `<meta charset="utf-8">` - Character encoding
- [x] Meta description on all pages
- [x] Open Graph tags (update in metadata)

### Sitemap & Robots

- [x] `sitemap.xml` generated - `/sitemap.xml`
- [x] `robots.txt` configured - `/robots.txt`
- [x] Submit sitemap ke Google Search Console

### Structured Data

- [x] JSON-LD helper functions ready
- [ ] Add Organization schema ke homepage
- [ ] Add BlogPosting schema ke blog posts
- [ ] Add FAQPage schema ke FAQ page

### Performance

- [ ] Google PageSpeed Insights score > 90
- [ ] Lighthouse score > 90
- [ ] Optimize images dengan next/image

### Content

- [ ] Unique meta descriptions (max 160 chars)
- [ ] Unique titles (max 60 chars)
- [ ] Target keywords di headings
- [ ] Internal linking strategy
- [ ] Content length > 300 words untuk blog

## 🔍 Submit ke Search Engines

### Google Search Console:

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add property untuk domain Anda
3. Submit sitemap: `https://yourdomain.com/sitemap.xml`
4. Request indexing untuk important pages

### Bing Webmaster:

1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Add your site
3. Submit sitemap
4. Monitor crawl stats

## 🎯 Optimization Tips

### 1. URL Structure

- Use slugs yang deskriptif: `/blog/how-to-optimize-seo` ✅
- Avoid: `/blog/post-123/` ❌

### 2. Heading Hierarchy

- 1 `<h1>` per page (biasanya title)
- H2, H3, H4 untuk subheadings
- Include keywords naturally

### 3. Internal Linking

```tsx
// Good internal linking
<Link href="/blog/another-related-post">
	Learn more about SEO best practices
</Link>
```

### 4. Meta Descriptions

```tsx
// Setting in database
metaDescription: "Comprehensive guide to SEO optimization for Next.js"; // 155 chars
```

### 5. Image Optimization

```tsx
import Image from "next/image";

<Image
	src="/path/to/image.jpg"
	alt="Descriptive alt text for SEO" // IMPORTANT!
	width={1200}
	height={630}
	priority // untuk above-the-fold images
/>;
```

### 6. Mobile Optimization

- Responsive design ✅ (sudah ada)
- Fast loading on mobile
- Tap targets yang cukup besar

### 7. Page Speed

- Minimize CSS/JS
- Lazy load images
- Use CDN (Cloudflare)
- Enable compression

## 📊 Monitoring & Analytics

### Track dengan Google Analytics 4:

```tsx
// Sudah ada di layout.tsx via Vercel Analytics
import { Analytics } from "@vercel/analytics/next";
```

### Monitor dengan Search Console:

- Impressions
- Clicks
- Average CTR
- Average position
- Coverage (indexed pages)

## 🚀 Production Deployment

Sebelum go live:

1. Update `process.env.NEXT_PUBLIC_API_URL` dengan domain production
2. Verify robots.txt at `https://yourdomain.com/robots.txt`
3. Check sitemap at `https://yourdomain.com/sitemap.xml`
4. Test dengan [Rich Results Test](https://search.google.com/test/rich-results)
5. Monitor Google Search Console

## ❌ Common SEO Mistakes (Avoid!)

- ❌ Duplicate content across pages
- ❌ Missing alt text on images
- ❌ Thin content (< 300 words)
- ❌ Broken internal links
- ❌ Poor page speed (> 3 seconds)
- ❌ Not mobile responsive
- ❌ Keyword stuffing
- ❌ Hidden text/links
- ❌ Cloaking (different content for bots)
- ❌ Not updating content regularly

## 📱 Mobile-First Indexing

Google menggunakan mobile version untuk indexing:

- Pastikan semua content accessible di mobile
- Check text readability di small screens
- Avoid pop-ups yang mengganggu

## 🔗 Resources

- [Google Search Central](https://developers.google.com/search)
- [Schema.org Documentation](https://schema.org)
- [Web Vitals Guide](https://web.dev/vitals/)
- [Next.js SEO Guide](https://nextjs.org/learn/seo/introduction-to-seo)
- [Yoast SEO Plugin](https://yoast.com/seo-plugins/wordpress/) (reference)

---

**Catatan**: SEO adalah proses jangka panjang. Monitor, test, dan optimize terus-menerus untuk hasil terbaik! 🚀
