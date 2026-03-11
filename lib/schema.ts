import {
	pgTable,
	serial,
	text,
	timestamp,
	boolean,
	integer,
	uniqueIndex,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const users = pgTable(
	"users",
	{
		id: serial("id").primaryKey(),
		name: text("name").notNull(),
		email: text("email").notNull(),
		password: text("password").notNull(),
		role: text("role").notNull().default("editor"), // admin, editor, viewer
		createdAt: timestamp("created_at", { mode: "date" })
			.notNull()
			.$defaultFn(() => new Date()),
		deletedAt: timestamp("deleted_at", { mode: "date" }),
	},
	(table) => {
		return {
			emailIdx: uniqueIndex("users_email_idx").on(table.email),
		};
	},
);

export const categories = pgTable(
	"categories",
	{
		id: serial("id").primaryKey(),
		name: text("name").notNull(),
		slug: text("slug").notNull(),
		description: text("description"),
		createdBy: integer("created_by").notNull(),
		createdAt: timestamp("created_at", { mode: "date" }).notNull(),
		updatedAt: timestamp("updated_at", { mode: "date" }).notNull(),
		deletedAt: timestamp("deleted_at", { mode: "date" }),
	},
	(table) => {
		return {
			slugIdx: uniqueIndex("categories_slug_idx")
				.on(table.slug)
				.where(sql`${table.deletedAt} is null`),
		};
	},
);

export const contents = pgTable(
	"contents",
	{
		id: serial("id").primaryKey(),
		title: text("title").notNull(),
		slug: text("slug").notNull(),
		content: text("content").notNull(),
		excerpt: text("excerpt"),
		type: text("type").notNull().default("article"), // article, news, etc
		categoryId: integer("category_id"),
		featuredImage: text("featured_image"),
		status: text("status").notNull().default("draft"), // draft, published, archived
		publishedAt: timestamp("published_at", { mode: "date" }),
		scheduledAt: timestamp("scheduled_at", { mode: "date" }), // untuk scheduled publishing
		metaTitle: text("meta_title"),
		metaDescription: text("meta_description"),
		metaKeywords: text("meta_keywords"),
		canonicalUrl: text("canonical_url"),
		robots: text("robots"), // index, noindex, follow, nofollow
		ogTitle: text("og_title"),
		ogDescription: text("og_description"),
		ogImage: text("og_image"),
		createdBy: integer("created_by").notNull(),
		createdAt: timestamp("created_at", { mode: "date" }).notNull(),
		updatedAt: timestamp("updated_at", { mode: "date" }).notNull(),
		deletedAt: timestamp("deleted_at", { mode: "date" }),
	},
	(table) => {
		return {
			slugIdx: uniqueIndex("contents_slug_idx")
				.on(table.slug)
				.where(sql`${table.deletedAt} is null`),
		};
	},
);

export const settings = pgTable(
	"settings",
	{
		id: serial("id").primaryKey(),
		key: text("key").notNull(),
		value: text("value"),
		type: text("type").notNull().default("string"), // string, boolean, number, json
		description: text("description"),
		createdAt: timestamp("created_at", { mode: "date" })
			.notNull()
			.$defaultFn(() => new Date()),
		updatedAt: timestamp("updated_at", { mode: "date" })
			.notNull()
			.$defaultFn(() => new Date()),
	},
	(table) => {
		return {
			keyIdx: uniqueIndex("settings_key_idx").on(table.key),
		};
	},
);

export const pages = pgTable(
	"pages",
	{
		id: serial("id").primaryKey(),
		title: text("title").notNull(),
		slug: text("slug").notNull(),
		content: text("content").notNull(), // JSON string containing blocks structure
		status: text("status").notNull().default("draft"), // draft, published
		publishedAt: timestamp("published_at", { mode: "date" }),
		scheduledAt: timestamp("scheduled_at", { mode: "date" }), // untuk scheduled publishing
		metaTitle: text("meta_title"),
		metaDescription: text("meta_description"),
		createdBy: integer("created_by").notNull(),
		createdAt: timestamp("created_at", { mode: "date" }).notNull(),
		updatedAt: timestamp("updated_at", { mode: "date" }).notNull(),
		deletedAt: timestamp("deleted_at", { mode: "date" }),
	},
	(table) => {
		return {
			slugIdx: uniqueIndex("pages_slug_idx")
				.on(table.slug)
				.where(sql`${table.deletedAt} is null`),
		};
	},
);

export const mediaGallery = pgTable("media_gallery", {
	id: serial("id").primaryKey(),
	filename: text("filename").notNull(),
	url: text("url").notNull(),
	type: text("type").notNull(), // image, video
	originalName: text("original_name").notNull(),
	fileSize: integer("file_size").notNull(),
	mimeType: text("mime_type").notNull(),
	createdBy: integer("created_by").notNull(),
	createdAt: timestamp("created_at", { mode: "date" }).notNull(),
	deletedAt: timestamp("deleted_at", { mode: "date" }),
});

export const navigation = pgTable("navigation", {
	id: serial("id").primaryKey(),
	label: text("label").notNull(),
	url: text("url").notNull(),
	parentId: integer("parent_id"),
	order: integer("order").notNull().default(0),
	icon: text("icon"),
	target: text("target").default("_self"), // _self, _blank, _parent, _top
	isActive: boolean("is_active").notNull().default(true),
	createdAt: timestamp("created_at", { mode: "date" }).notNull(),
	updatedAt: timestamp("updated_at", { mode: "date" }).notNull(),
	deletedAt: timestamp("deleted_at", { mode: "date" }),
});

export const comments = pgTable("comments", {
	id: serial("id").primaryKey(),
	contentId: integer("content_id").notNull(),
	name: text("name").notNull(),
	email: text("email").notNull(),
	content: text("content").notNull(),
	status: text("status").notNull().default("pending"), // pending, approved, rejected
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	isSpam: boolean("is_spam").notNull().default(false),
	createdAt: timestamp("created_at", { mode: "date" }).notNull(),
	updatedAt: timestamp("updated_at", { mode: "date" }).notNull(),
	deletedAt: timestamp("deleted_at", { mode: "date" }),
});

export const commentReplies = pgTable("comment_replies", {
	id: serial("id").primaryKey(),
	commentId: integer("comment_id").notNull(),
	name: text("name").notNull(),
	email: text("email").notNull(),
	content: text("content").notNull(),
	status: text("status").notNull().default("pending"), // pending, approved, rejected
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	isSpam: boolean("is_spam").notNull().default(false),
	createdAt: timestamp("created_at", { mode: "date" }).notNull(),
	updatedAt: timestamp("updated_at", { mode: "date" }).notNull(),
	deletedAt: timestamp("deleted_at", { mode: "date" }),
});

export const pageSections = pgTable(
	"page_sections",
	{
		id: serial("id").primaryKey(),
		pageName: text("page_name").notNull(),
		pageSlug: text("page_slug").notNull(),
		pageData: text("page_data").notNull(), // JSON string containing all section data
		createdBy: integer("created_by").notNull(),
		createdAt: timestamp("created_at", { mode: "date" })
			.notNull()
			.$defaultFn(() => new Date()),
		updatedAt: timestamp("updated_at", { mode: "date" })
			.notNull()
			.$defaultFn(() => new Date()),
		deletedAt: timestamp("deleted_at", { mode: "date" }),
	},
	(table) => {
		return {
			slugIdx: uniqueIndex("page_sections_slug_idx")
				.on(table.pageSlug)
				.where(sql`${table.deletedAt} is null`),
		};
	},
);

export const faqs = pgTable("faqs", {
	id: serial("id").primaryKey(),
	question: text("question").notNull(),
	answer: text("answer").notNull(),
	category: text("category"),
	order: integer("order").notNull().default(0),
	status: text("status").notNull().default("published"), // draft, published
	createdBy: integer("created_by").notNull(),
	createdAt: timestamp("created_at", { mode: "date" }).notNull(),
	updatedAt: timestamp("updated_at", { mode: "date" }).notNull(),
	deletedAt: timestamp("deleted_at", { mode: "date" }),
});

// Audit logs untuk tracking semua perubahan
export const auditLogs = pgTable(
	"audit_logs",
	{
		id: serial("id").primaryKey(),
		userId: integer("user_id").notNull(), // user yang melakukan aksi
		action: text("action").notNull(), // create, update, delete, publish, schedule
		entityType: text("entity_type").notNull(), // contents, pages, categories, etc
		entityId: integer("entity_id").notNull(), // ID dari entity yang diubah
		entityName: text("entity_name"), // title/name untuk reference
		changes: text("changes"), // JSON string - perubahan apa saja
		oldValues: text("old_values"), // JSON string - nilai sebelumnya
		newValues: text("new_values"), // JSON string - nilai baru
		metadata: text("metadata"), // JSON string - info tambahan (IP, user agent, dll)
		createdAt: timestamp("created_at", { mode: "date" })
			.notNull()
			.$defaultFn(() => new Date()),
	},
	(table) => {
		return {
			userIdIdx: sql`CREATE INDEX idx_audit_logs_user_id ON ${table} (${table.userId})`,
			entityIdx: sql`CREATE INDEX idx_audit_logs_entity ON ${table} (${table.entityType}, ${table.entityId})`,
			createdAtIdx: sql`CREATE INDEX idx_audit_logs_created_at ON ${table} (${table.createdAt})`,
		};
	},
);

export const loginAttempts = pgTable("login_attempts", {
	id: serial("id").primaryKey(),
	identifier: text("identifier").notNull(),
	attemptedAt: timestamp("attempted_at", { mode: "date" }).notNull(),
});
// Analytics tables
export const pageViews = pgTable("page_views", {
	id: serial("id").primaryKey(),
	pageSlug: text("page_slug").notNull(),
	pageTitle: text("page_title"),
	visitorId: text("visitor_id").notNull(),
	referrer: text("referrer"),
	userAgent: text("user_agent"),
	ipAddress: text("ip_address"),
	createdAt: timestamp("created_at", { mode: "date" })
		.notNull()
		.$defaultFn(() => new Date()),
});

export const visitors = pgTable("visitors", {
	id: serial("id").primaryKey(),
	visitorId: text("visitor_id").notNull().unique(),
	refererDomain: text("referer_domain"),
	country: text("country"),
	city: text("city"),
	userAgent: text("user_agent"),
	ipAddress: text("ip_address"),
	firstVisit: timestamp("first_visit", { mode: "date" })
		.notNull()
		.$defaultFn(() => new Date()),
	lastVisit: timestamp("last_visit", { mode: "date" })
		.notNull()
		.$defaultFn(() => new Date()),
	pageViewsCount: integer("page_views_count").default(1),
});

export const analyticsDaily = pgTable(
	"analytics_daily",
	{
		id: serial("id").primaryKey(),
		date: text("date").notNull(), // YYYY-MM-DD format
		pageSlug: text("page_slug").notNull(),
		totalViews: integer("total_views").default(0),
		uniqueVisitors: integer("unique_visitors").default(0),
		bounceRate: text("bounce_rate"),
		avgTimeOnPage: integer("avg_time_on_page"),
		createdAt: timestamp("created_at", { mode: "date" })
			.notNull()
			.$defaultFn(() => new Date()),
	},
	(table) => {
		return {
			dateSlugIdx: uniqueIndex("analytics_daily_date_slug_idx").on(
				table.date,
				table.pageSlug,
			),
		};
	},
);
