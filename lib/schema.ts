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
