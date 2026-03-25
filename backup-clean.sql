--
-- PostgreSQL database dump
--

\restrict eZvHtEudGT3WwYJyNfe2cFI4oWGqmeEL34McwzzcRINyl19Emtelry8mGF4qUEe

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.9 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA public;


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: analytics_daily; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.analytics_daily (
    id integer NOT NULL,
    date date NOT NULL,
    page_slug text NOT NULL,
    total_views integer DEFAULT 0,
    unique_visitors integer DEFAULT 0,
    bounce_rate double precision,
    avg_time_on_page integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: analytics_daily_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.analytics_daily_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: analytics_daily_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.analytics_daily_id_seq OWNED BY public.analytics_daily.id;


--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.audit_logs (
    id integer NOT NULL,
    user_id integer NOT NULL,
    action text NOT NULL,
    entity_type text NOT NULL,
    entity_id integer NOT NULL,
    entity_name text,
    changes text,
    old_values text,
    new_values text,
    metadata text,
    created_at timestamp without time zone NOT NULL
);


--
-- Name: audit_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.audit_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: audit_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.audit_logs_id_seq OWNED BY public.audit_logs.id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    created_by integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    deleted_at timestamp without time zone
);


--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: comment_replies; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.comment_replies (
    id integer NOT NULL,
    comment_id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    content text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    ip_address text,
    user_agent text,
    is_spam boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    deleted_at timestamp without time zone
);


--
-- Name: comment_replies_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.comment_replies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: comment_replies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.comment_replies_id_seq OWNED BY public.comment_replies.id;


--
-- Name: comments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.comments (
    id integer NOT NULL,
    content_id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    content text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    ip_address text,
    user_agent text,
    is_spam boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    deleted_at timestamp without time zone
);


--
-- Name: comments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.comments_id_seq OWNED BY public.comments.id;


--
-- Name: contact_submissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.contact_submissions (
    id integer NOT NULL,
    full_name text NOT NULL,
    email text NOT NULL,
    phone_number text,
    country text,
    subject text NOT NULL,
    message text NOT NULL,
    status text DEFAULT 'new'::text NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: contact_submissions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.contact_submissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: contact_submissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.contact_submissions_id_seq OWNED BY public.contact_submissions.id;


--
-- Name: contents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.contents (
    id integer NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    content text NOT NULL,
    excerpt text,
    type text DEFAULT 'article'::text NOT NULL,
    category_id integer,
    featured_image text,
    status text DEFAULT 'draft'::text NOT NULL,
    published_at timestamp without time zone,
    meta_title text,
    meta_description text,
    meta_keywords text,
    canonical_url text,
    robots text,
    og_title text,
    og_description text,
    og_image text,
    created_by integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    deleted_at timestamp without time zone,
    scheduled_at timestamp without time zone
);


--
-- Name: contents_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.contents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: contents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.contents_id_seq OWNED BY public.contents.id;


--
-- Name: faqs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.faqs (
    id integer NOT NULL,
    question text NOT NULL,
    answer text NOT NULL,
    category text,
    "order" integer DEFAULT 0 NOT NULL,
    status text DEFAULT 'published'::text NOT NULL,
    created_by integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    deleted_at timestamp without time zone
);


--
-- Name: faqs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.faqs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: faqs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.faqs_id_seq OWNED BY public.faqs.id;


--
-- Name: gallery_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.gallery_categories (
    id integer NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    display_order integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp without time zone
);


--
-- Name: gallery_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.gallery_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: gallery_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.gallery_categories_id_seq OWNED BY public.gallery_categories.id;


--
-- Name: gallery_of_works; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.gallery_of_works (
    id integer NOT NULL,
    category_id integer NOT NULL,
    title text NOT NULL,
    subtitle text,
    description text,
    image_url text NOT NULL,
    slug text NOT NULL,
    display_order integer DEFAULT 0,
    created_by integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp without time zone
);


--
-- Name: gallery_of_works_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.gallery_of_works_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: gallery_of_works_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.gallery_of_works_id_seq OWNED BY public.gallery_of_works.id;


--
-- Name: login_attempts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.login_attempts (
    id bigint NOT NULL,
    identifier text NOT NULL,
    attempted_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: login_attempts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.login_attempts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: login_attempts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.login_attempts_id_seq OWNED BY public.login_attempts.id;


--
-- Name: login_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.login_logs (
    id integer NOT NULL,
    user_id integer,
    email text NOT NULL,
    success boolean NOT NULL,
    failure_reason text,
    ip_address text NOT NULL,
    user_agent text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: login_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.login_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: login_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.login_logs_id_seq OWNED BY public.login_logs.id;


--
-- Name: media_gallery; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.media_gallery (
    id integer NOT NULL,
    filename text NOT NULL,
    url text NOT NULL,
    type text NOT NULL,
    original_name text NOT NULL,
    file_size integer NOT NULL,
    mime_type text NOT NULL,
    created_by integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    deleted_at timestamp without time zone
);


--
-- Name: media_gallery_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.media_gallery_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: media_gallery_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.media_gallery_id_seq OWNED BY public.media_gallery.id;


--
-- Name: navigation; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.navigation (
    id integer NOT NULL,
    label text NOT NULL,
    url text NOT NULL,
    parent_id integer,
    "order" integer DEFAULT 0 NOT NULL,
    icon text,
    target text DEFAULT '_self'::text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    deleted_at timestamp without time zone,
    platform character varying
);


--
-- Name: navigation_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.navigation_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: navigation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.navigation_id_seq OWNED BY public.navigation.id;


--
-- Name: page_sections; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.page_sections (
    id integer NOT NULL,
    page_name text NOT NULL,
    page_slug text NOT NULL,
    page_data text NOT NULL,
    created_by integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone
);


--
-- Name: page_sections_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.page_sections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: page_sections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.page_sections_id_seq OWNED BY public.page_sections.id;


--
-- Name: page_views; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.page_views (
    id integer NOT NULL,
    page_slug text NOT NULL,
    page_title text,
    visitor_id text NOT NULL,
    referrer text,
    user_agent text,
    ip_address text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: page_views_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.page_views_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: page_views_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.page_views_id_seq OWNED BY public.page_views.id;


--
-- Name: pages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pages (
    id integer NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    content text NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    meta_title text,
    meta_description text,
    created_by integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    deleted_at timestamp without time zone,
    scheduled_at timestamp without time zone,
    published_at timestamp without time zone
);


--
-- Name: pages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.pages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: pages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.pages_id_seq OWNED BY public.pages.id;


--
-- Name: settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.settings (
    id integer NOT NULL,
    key text NOT NULL,
    value text,
    type text DEFAULT 'string'::text NOT NULL,
    description text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: settings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.settings_id_seq OWNED BY public.settings.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    role text DEFAULT 'editor'::text NOT NULL,
    created_at timestamp without time zone NOT NULL,
    deleted_at timestamp without time zone
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: visitors; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.visitors (
    id integer NOT NULL,
    visitor_id text NOT NULL,
    referer_domain text,
    country text,
    city text,
    user_agent text,
    ip_address text,
    first_visit timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_visit timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    page_views_count integer DEFAULT 1
);


--
-- Name: visitors_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.visitors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: visitors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.visitors_id_seq OWNED BY public.visitors.id;


--
-- Name: analytics_daily id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analytics_daily ALTER COLUMN id SET DEFAULT nextval('public.analytics_daily_id_seq'::regclass);


--
-- Name: audit_logs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs ALTER COLUMN id SET DEFAULT nextval('public.audit_logs_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: comment_replies id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comment_replies ALTER COLUMN id SET DEFAULT nextval('public.comment_replies_id_seq'::regclass);


--
-- Name: comments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments ALTER COLUMN id SET DEFAULT nextval('public.comments_id_seq'::regclass);


--
-- Name: contact_submissions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_submissions ALTER COLUMN id SET DEFAULT nextval('public.contact_submissions_id_seq'::regclass);


--
-- Name: contents id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contents ALTER COLUMN id SET DEFAULT nextval('public.contents_id_seq'::regclass);


--
-- Name: faqs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faqs ALTER COLUMN id SET DEFAULT nextval('public.faqs_id_seq'::regclass);


--
-- Name: gallery_categories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gallery_categories ALTER COLUMN id SET DEFAULT nextval('public.gallery_categories_id_seq'::regclass);


--
-- Name: gallery_of_works id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gallery_of_works ALTER COLUMN id SET DEFAULT nextval('public.gallery_of_works_id_seq'::regclass);


--
-- Name: login_attempts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.login_attempts ALTER COLUMN id SET DEFAULT nextval('public.login_attempts_id_seq'::regclass);


--
-- Name: login_logs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.login_logs ALTER COLUMN id SET DEFAULT nextval('public.login_logs_id_seq'::regclass);


--
-- Name: media_gallery id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media_gallery ALTER COLUMN id SET DEFAULT nextval('public.media_gallery_id_seq'::regclass);


--
-- Name: navigation id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.navigation ALTER COLUMN id SET DEFAULT nextval('public.navigation_id_seq'::regclass);


--
-- Name: page_sections id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.page_sections ALTER COLUMN id SET DEFAULT nextval('public.page_sections_id_seq'::regclass);


--
-- Name: page_views id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.page_views ALTER COLUMN id SET DEFAULT nextval('public.page_views_id_seq'::regclass);


--
-- Name: pages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages ALTER COLUMN id SET DEFAULT nextval('public.pages_id_seq'::regclass);


--
-- Name: settings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.settings ALTER COLUMN id SET DEFAULT nextval('public.settings_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: visitors id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visitors ALTER COLUMN id SET DEFAULT nextval('public.visitors_id_seq'::regclass);


--
-- Data for Name: analytics_daily; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.analytics_daily (id, date, page_slug, total_views, unique_visitors, bounce_rate, avg_time_on_page, created_at) FROM stdin;
\.


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.audit_logs (id, user_id, action, entity_type, entity_id, entity_name, changes, old_values, new_values, metadata, created_at) FROM stdin;
1	1	update	contents	1	lorem ipsum dolor sit amet Edit	{"title":{"from":"lorem ipsum dolor sit amet","to":"lorem ipsum dolor sit amet Edit"},"slug":{"from":"lorem-ipsum-dolor-sit-amet","to":"lorem-ipsum-dolor-sit-amet-edit"}}	{"title":"lorem ipsum dolor sit amet","slug":"lorem-ipsum-dolor-sit-amet","status":"published"}	{"title":"lorem ipsum dolor sit amet Edit","slug":"lorem-ipsum-dolor-sit-amet-edit","status":"published"}	{"userAgent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36","referer":"http://localhost:3000/app/content/1/edit","ip":"::1"}	2026-03-10 13:49:39.027
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.categories (id, name, slug, description, created_by, created_at, updated_at, deleted_at) FROM stdin;
1	General	general	\N	1	2026-03-06 22:22:56.328	2026-03-06 22:22:56.328	\N
2	Adventure Tours	adventure-tours	Thrilling outdoor adventures and expedition experiences around the world	1	2026-03-13 06:13:03.828435	2026-03-13 06:13:03.828435	\N
3	Beach Escapes	beach-escapes	Relaxing beach vacations and seaside resort experiences	1	2026-03-13 06:13:03.828435	2026-03-13 06:13:03.828435	\N
4	Cultural Heritage	cultural-heritage	Immersive cultural experiences and historical tour packages	1	2026-03-13 06:13:03.828435	2026-03-13 06:13:03.828435	\N
5	Luxury Retreats	luxury-retreats	Exclusive luxury vacation experiences and high-end accommodations	1	2026-03-13 06:13:03.828435	2026-03-13 06:13:03.828435	\N
6	Wellness & Spa	wellness-spa	Rejuvenating wellness retreats and spa packages	1	2026-03-13 06:13:03.828435	2026-03-13 06:13:03.828435	\N
\.


--
-- Data for Name: comment_replies; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.comment_replies (id, comment_id, name, email, content, status, ip_address, user_agent, is_spam, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.comments (id, content_id, name, email, content, status, ip_address, user_agent, is_spam, created_at, updated_at, deleted_at) FROM stdin;
1	1	Kelvin Kurniawan	tepinnko@gmail.com	Halo kak	approved	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	f	2026-03-10 07:21:26.14	2026-03-10 09:12:46.331	\N
\.


--
-- Data for Name: contact_submissions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.contact_submissions (id, full_name, email, phone_number, country, subject, message, status, created_at, updated_at) FROM stdin;
1	Kelvin Kurniawan	tepinnko@gmail.com	085747570111	Indonesia	Hai Tolong dibantu	Halo selamat pagi, tolong kirim proposal ya	read	2026-03-13 02:14:00.597	2026-03-13 02:14:24.273
\.


--
-- Data for Name: contents; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.contents (id, title, slug, content, excerpt, type, category_id, featured_image, status, published_at, meta_title, meta_description, meta_keywords, canonical_url, robots, og_title, og_description, og_image, created_by, created_at, updated_at, deleted_at, scheduled_at) FROM stdin;
1	lorem ipsum dolor sit amet Edit	lorem-ipsum-dolor-sit-amet-edit	<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel tortor non felis malesuada ullamcorper. Nunc efficitur luctus nulla, a sollicitudin magna egestas id. Praesent id ultricies dolor. Donec luctus sem tempus orci pretium, vitae imperdiet metus efficitur. Suspendisse eu massa ut tellus fermentum venenatis eget rutrum risus. Praesent a ultricies nisi, ac sollicitudin leo. Quisque elementum a mi non sollicitudin. Etiam ac ex et odio eleifend tempus.</p><p style="text-align: justify;">Praesent libero ipsum, commodo nec mattis sed, placerat eu tellus. Praesent consectetur enim tortor, eget scelerisque metus tempus non. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nam pharetra aliquet tellus quis ullamcorper. In at ultrices ligula. Fusce ultrices et magna quis lacinia. Curabitur finibus sapien faucibus sapien porta pharetra. Suspendisse luctus augue sed feugiat commodo. Vivamus commodo finibus ante, et mattis felis dignissim sed. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Duis ut commodo velit.</p><p style="text-align: justify;">Integer commodo malesuada lacus, non dignissim nunc consequat at. Nullam condimentum nunc sed luctus ornare. Vivamus rutrum tortor vitae gravida posuere. Vestibulum viverra, diam non facilisis varius, libero tellus posuere erat, eu eleifend tellus erat nec nibh. Nam tempor augue condimentum, egestas nunc ac, consectetur nunc. Praesent erat ante, placerat eget fermentum ac, euismod eget elit. Sed non nibh a massa feugiat iaculis. Fusce tempus efficitur ipsum vel dapibus. Pellentesque eget nisi sed lacus vestibulum iaculis et id ipsum. Quisque ultricies orci quis interdum dignissim. Integer vel justo sapien. Morbi luctus vitae purus quis placerat. Nunc non convallis elit, vitae ullamcorper tortor. Donec malesuada posuere odio, eu placerat lorem.</p><p style="text-align: justify;">In vel ante et mauris blandit vehicula. Vivamus imperdiet est iaculis, suscipit odio sed, vehicula risus. Sed tincidunt ante in blandit semper. Aenean elementum sem sed quam euismod, eu sagittis augue viverra. Proin quis arcu fringilla, pretium ligula vitae, luctus quam. Interdum et malesuada fames ac ante ipsum primis in faucibus. Cras id libero in lacus fermentum lobortis. Vestibulum nec nisi molestie, imperdiet enim nec, ornare elit. Vivamus commodo vestibulum sem, at viverra purus finibus vitae.</p><p style="text-align: justify;">Aliquam erat volutpat. Proin feugiat suscipit quam a luctus. Vivamus pharetra arcu eros, id dapibus ex posuere et. Phasellus pellentesque facilisis odio vitae fringilla. Aenean ultrices consequat nisi, sed porttitor ex malesuada ut. Suspendisse et diam ex. Phasellus lobortis at diam in malesuada. Morbi luctus metus in risus sagittis, ac aliquam elit lacinia. Phasellus id purus eu nisl consectetur dignissim et ac neque. Sed eu ante malesuada, egestas nisi vitae, laoreet ex. Mauris eleifend ipsum lorem, eu semper quam porta ac. Morbi tempor tortor nec mi luctus rhoncus. Duis risus libero, iaculis id mauris in, tempus rutrum magna. Vestibulum congue mauris dictum blandit placerat.</p>	Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum	article	1	\N	published	2026-03-10 04:45:00	\N	\N	\N	\N	\N	\N	\N	\N	1	2026-03-10 04:48:45.963	2026-03-10 13:49:38.89	\N	\N
2	Mountain Climbing Expedition to Peak Adventures	mountain-climbing-expedition	<p>Experience the thrill of conquering some of the world's most spectacular peaks. Our expert guides will lead you through challenging terrain and breathtaking landscapes. This 10-day expedition includes professional mountaineering training, high-altitude acclimatization, and summit attempts with full safety equipment and support.</p><p>Perfect for adventurers seeking an unforgettable challenge and stunning views from the top of the world.</p>	Join us on an epic mountain climbing expedition to conquer challenging peaks with expert guides and comprehensive safety support.	article	1	https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop	published	2026-03-13 06:13:03.828435	Mountain Climbing Expedition | Adventure Tours	Join our mountain climbing expedition with expert guides. Conquer peaks and experience breathtaking landscapes.	mountain climbing, expedition, adventure, trekking, peaks	\N	\N	\N	\N	\N	1	2026-03-13 06:13:03.828435	2026-03-13 06:13:03.828435	\N	\N
3	Jungle Safari Through Rainforest Wonders	jungle-safari-rainforest	<p>Explore the most biodiverse regions on Earth with our guided jungle safari expeditions. Navigate pristine rainforests, spot exotic wildlife, and discover hidden waterfalls. Our experienced naturalist guides will teach you about the ecosystem while you stay in comfortable eco-lodges.</p><p>This immersive 8-day adventure includes daily jungle treks, wildlife observation, indigenous community interactions, and photography opportunities.</p>	Discover the untamed beauty of rainforests with guided wildlife safari through pristine jungle landscapes.	article	1	https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop	published	2026-03-13 06:13:03.828435	Jungle Safari Rainforest Adventure | Explore Wildlife	Experience jungle safari through pristine rainforests. Spot exotic wildlife and discover hidden natural wonders.	jungle safari, rainforest, wildlife, adventure, nature	\N	\N	\N	\N	\N	1	2026-03-13 06:13:03.828435	2026-03-13 06:13:03.828435	\N	\N
4	Rock Climbing & Rappelling in Dramatic Canyons	rock-climbing-canyons	<p>Test your climbing skills and conquer vertical rock faces in some of the world's most dramatic canyon systems. Our certified climbing instructors provide comprehensive training and safety briefings for climbers of all skill levels. Experience the rush of ascending challenging routes with panoramic canyon views.</p><p>The 5-day program includes rope management, safety protocols, technical climbing instruction, and spectacular rappelling descents.</p>	Master rock climbing and rappelling techniques while exploring stunning canyon landscapes with professional instructors.	article	1	https://images.unsplash.com/photo-1522163182402-834ff146da16?w=800&h=600&fit=crop	published	2026-03-13 06:13:03.828435	Rock Climbing Canyon Adventure | Technical Climbing	Learn rock climbing and rappelling in dramatic canyons. World-class instruction for all skill levels.	rock climbing, rappelling, canyons, adventure, outdoors	\N	\N	\N	\N	\N	1	2026-03-13 06:13:03.828435	2026-03-13 06:13:03.828435	\N	\N
5	White Water Rafting Down Roaring Rivers	white-water-rafting-rivers	<p>Experience the adrenaline rush of navigating class IV and V white water rapids through pristine river canyons. Professional river guides accompany every raft, ensuring safety while delivering maximum excitement. Navigate through stunning geological formations and untamed wilderness.</p><p>Our 6-day white water adventure includes multiple rivers, varying difficulty levels, riverside camping, and gourmet meal preparation in the wilderness.</p>	Navigate thrilling white water rapids through scenic river canyons with expert guides and comprehensive safety gear.	article	1	https://images.unsplash.com/photo-1541625602330-2277a4647d6e?w=800&h=600&fit=crop	published	2026-03-13 06:13:03.828435	White Water Rafting Adventure | River Tours	Experience white water rafting through exciting rapids and scenic canyons with professional guides.	white water rafting, rivers, adventure, rapids, outdoor	\N	\N	\N	\N	\N	1	2026-03-13 06:13:03.828435	2026-03-13 06:13:03.828435	\N	\N
6	Desert Expedition & Star Gazing Experience	desert-expedition-stargazing	<p>Journey into vast desert landscapes under some of the clearest night skies on Earth. Our desert expeditions combine camel trekking, dune exploration, and luxury Bedouin-style tent camping. As the sun sets, experience world-class stargazing with our astronomy guides who reveal the wonders of the cosmos.</p><p>This 7-day desert experience includes daily camel treks, sandboard lessons, traditional desert cuisine, and nightly astronomy sessions.</p>	Explore vast desert landscapes and experience exceptional stargazing under pristine night skies with expert astronomers.	article	1	https://images.unsplash.com/photo-1467270351994-14ae9a54c3f1?w=800&h=600&fit=crop	published	2026-03-13 06:13:03.828435	Desert Expedition Stargazing | Adventure Tours	Desert trekking and astronomy experience. Explore endless dunes and gaze at the stars with expert guides.	desert expedition, stargazing, astronomy, adventure, trekking	\N	\N	\N	\N	\N	1	2026-03-13 06:13:03.828435	2026-03-13 06:13:03.828435	\N	\N
7	Tropical Island Paradise with Crystal Waters	tropical-island-paradise	<p>Escape to pristine tropical islands surrounded by crystal-clear turquoise waters and white sand beaches. Our all-inclusive island packages feature luxury beachfront resorts, water sports, snorkeling, and private island excursions. Immerse yourself in tropical paradise with perfect weather, exotic cuisine, and world-class hospitality.</p><p>The 5-day tropical escape includes beachfront accommodation, daily water sports, spa treatments, and gourmet dining experiences.</p>	Discover tropical island paradise with pristine beaches, crystal waters, and luxury resort accommodations.	article	2	https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop	published	2026-03-13 06:13:03.828435	Tropical Island Paradise | Beach Resort Escape	Experience tropical island paradise with luxury resorts, crystal waters, and white sandy beaches.	tropical islands, beach, paradise, vacation, resort	\N	\N	\N	\N	\N	1	2026-03-13 06:13:03.828435	2026-03-13 06:13:03.828435	\N	\N
8	Luxury Beachfront Villa Retreat	luxury-beachfront-villa	<p>Indulge in ultimate luxury at an exclusive beachfront villa with private beach access and ocean views. These stunning villas feature infinity pools, premium amenities, private chefs, and personalized concierge services. Perfect for couples seeking romance or families wanting an exclusive beach experience.</p><p>Our villa packages include luxury accommodation, private beach, infinity pool, gourmet dining, spa services, and water sports activities.</p>	Stay in exclusive luxury beachfront villas with private pools, personal chefs, and pristine beach access.	article	2	https://images.unsplash.com/photo-1520250497591-112f2980fc06?w=800&h=600&fit=crop	published	2026-03-13 06:13:03.828435	Luxury Beachfront Villa Retreat | Exclusive Getaway	Exclusive luxury beachfront villas with private amenities, gourmet dining, and pristine ocean views.	luxury villa, beachfront, resort, vacation, private beach	\N	\N	\N	\N	\N	1	2026-03-13 06:13:03.828435	2026-03-13 06:13:03.828435	\N	\N
9	Coral Reef Snorkeling Adventure	coral-reef-snorkeling	<p>Explore vibrant coral reefs teeming with colorful fish and marine life. Our guided snorkeling excursions take you to protected marine reserves where you'll encounter sea turtles, tropical fish, and pristine coral ecosystems. Professional guides ensure your safety while providing fascinating insights into marine biology and conservation.</p><p>The 4-day snorkeling adventure includes daily reef excursions, marine biology briefings, beach relaxation, and sunset sailing.</p>	Snorkel vibrant coral reefs and encounter exotic marine life in protected underwater sanctuaries.	article	2	https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop	published	2026-03-13 06:13:03.828435	Coral Reef Snorkeling | Marine Adventure	Guided snorkeling in pristine coral reefs with marine biologists. Encounter sea turtles and tropical fish.	snorkeling, coral reef, beach, marine life, water sports	\N	\N	\N	\N	\N	1	2026-03-13 06:13:03.828435	2026-03-13 06:13:03.828435	\N	\N
10	Sunset Sailing & Seaside Dining	sunset-sailing-dining	<p>Experience romantic sunset sailing on luxury yacht vessels with gourmet dining at sea. Glide across calm ocean waters as the sun paints the sky in golden hues, enjoying fine dining prepared by award-winning chefs. Perfect for romantic getaways, anniversaries, or special celebrations with unforgettable ocean vistas.</p><p>Evening packages include sunset sail, gourmet multi-course dinner, premium beverages, live music, and private deck access.</p>	Enjoy romantic sunset sailing on luxury yachts with gourmet dining and ocean panoramas.	article	2	https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop	published	2026-03-13 06:13:03.828435	Sunset Sailing & Seaside Dining | Romantic Escape	Romantic sunset sailing with gourmet dining, live music, and luxurious yacht experience.	sailing, sunset, yacht, dining, romantic vacation	\N	\N	\N	\N	\N	1	2026-03-13 06:13:03.828435	2026-03-13 06:13:03.828435	\N	\N
11	Beach Spa Wellness Retreat	beach-spa-wellness	<p>Rejuvenate your body and mind at our beachfront spa wellness retreat. Enjoy daily yoga and meditation sessions with ocean views, professional spa treatments using natural ingredients, and nutritious cuisine focused on health and wellness. The healing sound of waves combined with expert therapists creates the perfect environment for renewal and relaxation.</p><p>The 6-day wellness retreat includes accommodation, daily yoga, meditation, spa treatments, healthy cuisine, and wellness workshops.</p>	Rejuvenate at beachfront wellness retreat with yoga, spa treatments, and healthy cuisine.	article	2	https://images.unsplash.com/photo-1543862475-eb785736ad0f?w=800&h=600&fit=crop	published	2026-03-13 06:13:03.828435	Beach Spa Wellness Retreat | Relaxation Vacation	Beachfront wellness retreat with yoga, spa treatments, meditation, and restorative wellness programs.	wellness, spa, beach, yoga, relaxation, retreat	\N	\N	\N	\N	\N	1	2026-03-13 06:13:03.828435	2026-03-13 06:13:03.828435	\N	\N
12	Ancient Temple Tour Through Sacred Sites	ancient-temple-tour	<p>Journey through centuries of history exploring magnificent ancient temples and sacred sites. Our expert historians and local guides provide deep insights into the cultural significance, architectural brilliance, and spiritual importance of each location. Visit intricately carved temples, monasteries, and religious monuments that have stood for millennia.</p><p>The 8-day cultural tour includes guided temple visits, expert lectures, local community interactions, photography opportunities, and cultural workshops.</p>	Explore magnificent ancient temples and sacred sites with expert historians and local cultural guides.	article	3	https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop	published	2026-03-13 06:13:03.828435	Ancient Temple Tour | Cultural Heritage Sites	Expert-guided tours through ancient temples, sacred sites, and historical monuments with cultural insights.	temples, cultural heritage, history, archaeology, ancient sites	\N	\N	\N	\N	\N	1	2026-03-13 06:13:03.828435	2026-03-13 06:13:03.828435	\N	\N
13	Traditional Art & Craft Master Classes	traditional-art-craft	<p>Learn authentic traditional arts and crafts directly from master artisans. Participate in hands-on workshops creating textiles, pottery, paintings, and sculptures using centuries-old techniques passed down through generations. Gain deep appreciation for cultural traditions while creating your own artistic masterpieces to take home.</p><p>The 5-day craft workshop includes daily master classes, art supplies, material costs, artisan interactions, and gallery visit.</p>	Master traditional arts and crafts through hands-on workshops with expert local artisans and craftspeople.	article	3	https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&h=600&fit=crop	published	2026-03-13 06:13:03.828435	Traditional Art & Craft Classes | Cultural Learning	Learn traditional arts and crafts from master artisans. Hands-on workshops in textile, pottery, and painting.	traditional art, craft, workshops, cultural learning, artisan	\N	\N	\N	\N	\N	1	2026-03-13 06:13:03.828435	2026-03-13 06:13:03.828435	\N	\N
14	Culinary Heritage Food Tour	culinary-heritage-food	<p>Discover authentic culinary traditions through immersive food tours and cooking classes. Visit local markets, meet traditional cooks, and learn to prepare signature dishes using family recipes and local ingredients. Experience the cultural significance of food in different regions through market exploration, cooking classes, and festive meals with local families.</p><p>The 6-day culinary tour includes market visits, cooking classes, restaurant experiences, local family dinners, and food history lessons.</p>	Explore authentic culinary traditions through markets, cooking classes, and meals with local families.	article	3	https://images.unsplash.com/photo-1496627666981-5047e0db3b37?w=800&h=600&fit=crop	published	2026-03-13 06:13:03.828435	Culinary Heritage Food Tour | Authentic Cuisine	Explore authentic culinary traditions through cooking classes, markets, and local family dinners.	food tour, culinary, cooking class, local cuisine, heritage	\N	\N	\N	\N	\N	1	2026-03-13 06:13:03.828435	2026-03-13 06:13:03.828435	\N	\N
15	Historical Museum & Archive Expedition	historical-museum-archive	<p>Access restricted museum archives and behind-the-scenes collections with expert curators. Explore rare artifacts, historical documents, and museum storage areas typically closed to the public. Learn the stories behind priceless collections and understand how museums preserve cultural heritage for future generations.</p><p>The 4-day museum expedition includes curator-guided tours, archive access, conservation demonstrations, and exclusive lectures.</p>	Explore rare artifacts and museum archives with expert curators during exclusive behind-the-scenes tours.	article	3	https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&h=600&fit=crop	published	2026-03-13 06:13:03.828435	Historical Museum & Archive Expedition | Cultural Access	Exclusive museum archive tours with rare artifacts and curator-guided historical exploration.	museum, history, archives, artifacts, cultural heritage	\N	\N	\N	\N	\N	1	2026-03-13 06:13:03.828435	2026-03-13 06:13:03.828435	\N	\N
16	Indigenous Culture & Community Experience	indigenous-culture-community	<p>Experience authentic indigenous cultures through respectful, community-based tourism. Live with indigenous families, participate in daily activities, learn traditional languages, and understand spiritual practices. Support local communities directly while gaining genuine cultural insights and building meaningful cross-cultural connections.</p><p>The 7-day cultural immersion includes homestay accommodation, daily activities, language lessons, spiritual ceremonies, and community meals.</p>	Experience authentic indigenous cultures through homestays, daily activities, and meaningful community connections.	article	3	https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop	published	2026-03-13 06:13:03.828435	Indigenous Culture Experience | Community Tourism	Authentic indigenous culture immersion with community homestays and respectful cultural exchange.	indigenous culture, community, travel, cultural exchange, linguistics	\N	\N	\N	\N	\N	1	2026-03-13 06:13:03.828435	2026-03-13 06:13:03.828435	\N	\N
17	Five-Star Private Island Resort	five-star-private-island	<p>Escape to an exclusive private island resort accessible only to guests. Experience ultra-luxury accommodations with personal butlers, Michelin-star dining, infinity pools overlooking pristine waters, and world-class spa facilities. Every detail is meticulously crafted for absolute comfort and indulgence with unparalleled privacy and service excellence.</p><p>Private island packages include luxury villa accommodation, personal butler service, gourmet dining, water sports, spa, and helicopter transfers.</p>	Exclusive private island resort with luxury villas, personal butler service, and five-star amenities.	article	4	https://images.unsplash.com/photo-1553531088-eef8a64da54e?w=800&h=600&fit=crop	published	2026-03-13 06:13:03.828435	Five-Star Private Island Resort | Luxury Escape	Ultra-luxury private island resort with personal butler, gourmet dining, and exclusive beach access.	luxury resort, private island, five-star, vacation, exclusive	\N	\N	\N	\N	\N	1	2026-03-13 06:13:03.828435	2026-03-13 06:13:03.828435	\N	\N
18	Alpine Mountain Luxury Chalet Experience	alpine-mountain-chalet	<p>Indulge in ultimate Alpine luxury at exclusive mountain chalets with breathtaking peak views. These stunning properties feature roaring fireplaces, premium furnishings, private hot tubs, wine cellars, and gourmet kitchens. Enjoy mountain activities by day and cozy luxury by night with world-class spa services and fine dining experiences.</p><p>Alpine chalet packages include luxury accommodation, concierge services, spa treatments, fine dining, and mountain activities.</p>	Alpine luxury chalets with premium amenities, private hot tubs, and gourmet mountain dining experiences.	article	4	https://images.unsplash.com/photo-1566576722541-b34c7f37141d?w=800&h=600&fit=crop	published	2026-03-13 06:13:03.828435	Alpine Mountain Luxury Chalet | Premium Retreat	Luxury Alpine chalets with premium furnishings, spa services, and fine dining mountain experiences.	alpine chalet, luxury, mountain resort, vacation, skiing	\N	\N	\N	\N	\N	1	2026-03-13 06:13:03.828435	2026-03-13 06:13:03.828435	\N	\N
19	Palace Hotel Grand Heritage Experience	palace-hotel-heritage	<p>Stay in magnificently restored palace hotels that blend historic grandeur with modern luxury. These iconic properties showcase original architectural details, period furnishings, and cultural significance while offering contemporary comfort and amenities. Experience timeless elegance in locations rich with history and royal heritage.</p><p>Palace hotel stays include historic suite accommodation, heritage tours, gourmet dining, spa access, and concierge service.</p>	Stay in historic palace hotels blending royal heritage with modern luxury and cultural significance.	article	4	https://images.unsplash.com/photo-1631336344892-54dc1a9a5d69?w=800&h=600&fit=crop	published	2026-03-13 06:13:03.828435	Palace Hotel Grand Heritage | Historic Luxury	Historic palace hotels with royal heritage, luxury suites, and cultural significance.	palace hotel, heritage, luxury, historic, vacation	\N	\N	\N	\N	\N	1	2026-03-13 06:13:03.828435	2026-03-13 06:13:03.828435	\N	\N
20	Exclusive Golf Course & Resort Package	exclusive-golf-resort	<p>Access world-renowned private golf courses at exclusive resorts. Enjoy championship-level courses designed by legendary architects, professional coaching from PGA instructors, and luxurious on-course accommodations. Perfect for golf enthusiasts seeking the finest courses combined with premium resort facilities and amenities.</p><p>Golf resort packages include luxury accommodation, unlimited golf rounds, PGA instruction, caddy service, spa, and fine dining.</p>	Exclusive private golf courses with championship designs and luxury resort facilities combined.	article	4	https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=600&fit=crop	published	2026-03-13 06:13:03.828435	Exclusive Golf Course & Resort | Premium Golf	Private championship golf courses with luxury resorts, PGA instruction, and premium amenities.	golf resort, luxury, private course, championship, vacation	\N	\N	\N	\N	\N	1	2026-03-13 06:13:03.828435	2026-03-13 06:13:03.828435	\N	\N
21	Helicopter Tour & Luxury Dinner Experience	helicopter-luxury-dinner	<p>Experience ultimate luxury with private helicopter tours showcasing spectacular landscapes, followed by gourmet dinners in exclusive venues. Combine breathtaking aerial sightseeing with Michelin-star dining and champagne celebrations. Perfect for special occasions, anniversaries, or those seeking unforgettable luxury experiences combining adventure and fine dining.</p><p>Helicopter packages include private helicopter charter, scenic tour, luxury dinner, premium beverages, and ground transfers.</p>	Private helicopter tours with aerial sightseeing followed by gourmet dinners in exclusive venues.	article	4	https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop	published	2026-03-13 06:13:03.828435	Helicopter Tour & Luxury Dinner | Premium Experience	Private helicopter tours with luxury dinner experiences, scenic flights, and Michelin-star dining.	helicopter tour, luxury, dining, scenic, exclusive	\N	\N	\N	\N	\N	1	2026-03-13 06:13:03.828435	2026-03-13 06:13:03.828435	\N	\N
22	Ayurvedic Healing & Traditional Medicine Retreat	ayurvedic-healing-retreat	<p>Discover ancient Ayurvedic healing practices and traditional medicine through immersive wellness retreats. Work with certified Ayurvedic practitioners to create personalized wellness plans, receive authentic treatments, and learn traditional healing techniques. Experience rejuvenation through massage, herbal remedies, yoga, meditation, and dietary plans aligned with your individual constitution.</p><p>Ayurvedic retreat includes accommodation, personalized consultations, daily treatments, yoga classes, and herbal meals.</p>	Authentic Ayurvedic healing and traditional medicine retreat with personalized wellness plans.	article	5	https://images.unsplash.com/photo-1526495124232-a04b0903ba3d?w=800&h=600&fit=crop	published	2026-03-13 06:13:03.828435	Ayurvedic Healing Retreat | Traditional Wellness	Authentic Ayurvedic retreat with traditional healing, personalized treatments, and wellness plans.	ayurveda, healing, wellness, traditional medicine, retreat	\N	\N	\N	\N	\N	1	2026-03-13 06:13:03.828435	2026-03-13 06:13:03.828435	\N	\N
23	Yoga & Meditation Intensive Program	yoga-meditation-intensive	<p>Immerse yourself in comprehensive yoga and meditation programs with world-renowned instructors. Daily asana classes, pranayama breathing techniques, meditation sessions, philosophy lectures, and lifestyle coaching guide you toward inner peace and physical vitality. Programs cater to all levels from beginners to advanced practitioners seeking deeper spiritual connection.</p><p>Yoga intensive includes accommodation, daily classes, group meditation, philosophy lectures, vegetarian meals, and materials.</p>	Intensive yoga and meditation programs with world-renowned instructors and daily spiritual practices.	article	5	https://images.unsplash.com/photo-1544993795-c4da6ffb5e51?w=800&h=600&fit=crop	published	2026-03-13 06:13:03.828435	Yoga & Meditation Intensive | Spiritual Wellness	Intensive yoga and meditation programs with expert instruction, daily practices, and spiritual guidance.	yoga, meditation, wellness, instruction, mindfulness	\N	\N	\N	\N	\N	1	2026-03-13 06:13:03.828435	2026-03-13 06:13:03.828435	\N	\N
24	Detox & Organic Cleansing Retreat	detox-cleansing-retreat	<p>Reset your body and mind through comprehensive detox and cleansing programs. Supervised by wellness doctors, these programs include organic juice cleanses, nutritious meals, herbal treatments, body therapies, and lifestyle coaching. Experience energy renewal and toxin elimination through evidence-based practices in beautiful, health-focused environments.</p><p>Detox retreat includes accommodation, daily detox meals, juice cleanses, spa treatments, consultations, and wellness education.</p>	Comprehensive detox and cleansing retreat with organic nutrition and professional wellness supervision.	article	5	https://images.unsplash.com/photo-1506797048baad5f3caf91e7876e4f5e8?w=800&h=600&fit=crop	published	2026-03-13 06:13:03.828435	Detox & Cleansing Retreat | Health Wellness	Supervised detox retreat with organic nutrition, cleansing programs, and wellness restoration.	detox, cleansing, wellness, organic, health retreat	\N	\N	\N	\N	\N	1	2026-03-13 06:13:03.828435	2026-03-13 06:13:03.828435	\N	\N
25	Holistic Wellness Spa Package	holistic-wellness-spa	<p>Experience comprehensive holistic wellness through integrated spa and wellness packages. Receive Swedish massage, aromatherapy, facials, body treatments, reflexology, and energy healing sessions from certified therapists. Complementary wellness consultations guide personalized wellness journeys combining ancient practices with modern therapeutic techniques.</p><p>Holistic spa packages include accommodation, daily treatments, wellness consultations, healthy meals, and access to wellness facilities.</p>	Holistic wellness spa combining massage, aromatherapy, energy healing, and personalized wellness care.	article	5	https://images.unsplash.com/photo-1600334089393-b70033a65718?w=800&h=600&fit=crop	published	2026-03-13 06:13:03.828435	Holistic Wellness Spa | Therapeutic Treatments	Holistic spa with massage, aromatherapy, energy healing, and comprehensive wellness treatments.	spa, wellness, massage, aromatherapy, holistic health	\N	\N	\N	\N	\N	1	2026-03-13 06:13:03.828435	2026-03-13 06:13:03.828435	\N	\N
26	Fitness Transformation Bootcamp	fitness-transformation-bootcamp	<p>Achieve your fitness goals through intensive transformation bootcamps led by elite fitness trainers. Personalized training programs, nutritional counseling, group fitness classes, and wellness coaching combine to create lasting lifestyle changes. Programs accommodate all fitness levels with adaptable intensity and focus on sustainable health improvements.</p><p>Fitness bootcamp includes accommodation, daily training sessions, nutritional guidance, meal planning, and fitness assessments.</p>	Elite fitness bootcamp with personalized training, nutritional coaching, and transformation programs.	article	5	https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop	published	2026-03-13 06:13:03.828435	Fitness Transformation Bootcamp | Health Training	Intensive fitness bootcamp with elite trainers, personalized programs, and nutritional coaching.	fitness, bootcamp, training, transformation, wellness	\N	\N	\N	\N	\N	1	2026-03-13 06:13:03.828435	2026-03-13 06:13:03.828435	\N	\N
\.


--
-- Data for Name: faqs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.faqs (id, question, answer, category, "order", status, created_by, created_at, updated_at, deleted_at) FROM stdin;
1	Apa itu takshaka ?	Takshaka adalah travel manajement agent 		0	published	1	2026-03-10 08:19:37.706	2026-03-10 08:19:37.706	\N
2	Cara menghubungi takshaka	Melalui email dan nomor telepon yang tertera		0	published	1	2026-03-10 08:22:08.34	2026-03-10 08:22:08.34	\N
\.


--
-- Data for Name: gallery_categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.gallery_categories (id, name, slug, display_order, created_at, updated_at, deleted_at) FROM stdin;
1	Metting	metting	0	2026-03-12 04:04:09.094	2026-03-12 04:04:09.094	\N
2	Incentive	incentive	0	2026-03-12 04:04:24.396	2026-03-12 04:04:24.396	\N
3	Conference	conference	0	2026-03-12 04:04:33.672	2026-03-12 04:04:33.672	\N
4	Exhibition	exhibition	0	2026-03-12 04:04:43.107	2026-03-12 04:04:43.107	\N
\.


--
-- Data for Name: gallery_of_works; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.gallery_of_works (id, category_id, title, subtitle, description, image_url, slug, display_order, created_by, created_at, updated_at, deleted_at) FROM stdin;
1	1	OUR OCEAN CONFERENCE	Meeting & Conference		https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1773289209124-3tzwld.png	our-ocean-conference	0	1	2026-03-12 04:20:18.066	2026-03-12 04:20:18.066	\N
2	1	WORLD BANK MFM UNIT RETREAT	Meeting & Gathering		https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1773289254942-uu49d3.png	world-bank-mfm-unit-retreat	0	1	2026-03-12 04:21:02.618	2026-03-12 04:21:02.618	\N
3	1	Meeting & Conference	ASIAN INITIATIVE MEETING		https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1773289314239-823p50.webp	meeting-conference	0	1	2026-03-12 04:21:59.222	2026-03-12 04:21:59.222	\N
4	1	PT. SURYA MADISTRINDO	Incentive Trip		https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1773289341980-scyqm0.webp	pt-surya-madistrindo	0	1	2026-03-12 04:22:27.234	2026-03-12 04:22:27.234	\N
\.


--
-- Data for Name: login_attempts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.login_attempts (id, identifier, attempted_at) FROM stdin;
\.


--
-- Data for Name: login_logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.login_logs (id, user_id, email, success, failure_reason, ip_address, user_agent, created_at) FROM stdin;
1	1	admin@example.com	f	invalid_password	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-03-13 03:51:10.912
2	1	admin@example.com	t	\N	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-03-13 03:51:15.05
3	1	admin@example.com	t	\N	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-03-13 05:53:20.544
4	1	admin@example.com	f	invalid_password	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-03-13 13:32:05.688
5	1	admin@example.com	t	\N	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-03-13 13:32:09.829
\.


--
-- Data for Name: media_gallery; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.media_gallery (id, filename, url, type, original_name, file_size, mime_type, created_by, created_at, deleted_at) FROM stdin;
2	images/1772850784664-1r4ddc.png	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1772850784664-1r4ddc.png	image	Rectangle 243.png	376933	image/png	1	2026-03-07 02:33:06.028	\N
3	images/1772850801856-xq8a12.png	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1772850801856-xq8a12.png	image	Rectangle 243-1.png	679647	image/png	1	2026-03-07 02:33:22.444	\N
4	images/1772850805800-3crjuk.png	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1772850805800-3crjuk.png	image	Rectangle 243-2.png	421229	image/png	1	2026-03-07 02:33:26.147	\N
5	images/1772850864455-fpdy8t.png	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1772850864455-fpdy8t.png	image	Rectangle 245.png	697620	image/png	1	2026-03-07 02:34:24.835	\N
6	images/1772850867319-pqzlkn.png	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1772850867319-pqzlkn.png	image	Rectangle 263.png	871976	image/png	1	2026-03-07 02:34:27.776	\N
7	images/1772850869995-f34fnr.png	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1772850869995-f34fnr.png	image	Rectangle 264.png	741364	image/png	1	2026-03-07 02:34:30.441	\N
8	images/1772859237924-70i5yt.png	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1772859237924-70i5yt.png	image	envato-labs-image-edit (3) 2.png	460512	image/png	1	2026-03-07 04:53:58.775	\N
9	images/1772859241079-o168vy.png	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1772859241079-o168vy.png	image	Rectangle 17.png	386536	image/png	1	2026-03-07 04:54:01.634	\N
10	images/1772859245474-bg7or1.png	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1772859245474-bg7or1.png	image	envato-labs-image-edit (3) 1.png	473292	image/png	1	2026-03-07 04:54:05.853	\N
12	images/1772859514262-mzqkzp.png	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1772859514262-mzqkzp.png	image	Rectangle 246.png	203071	image/png	1	2026-03-07 04:58:34.589	\N
13	images/1772860505814-6klxu4.png	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1772860505814-6klxu4.png	image	Rectangle 245.png	1379453	image/png	1	2026-03-07 05:15:06.776	\N
14	images/1772860523140-qakw5e.png	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1772860523140-qakw5e.png	image	Rectangle 10.png	134787	image/png	1	2026-03-07 05:15:23.572	\N
15	images/1772860535501-xy5w04.png	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1772860535501-xy5w04.png	image	Rectangle 11.png	117942	image/png	1	2026-03-07 05:15:35.881	\N
16	images/1772860544053-76mv7w.png	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1772860544053-76mv7w.png	image	Rectangle 12.png	156292	image/png	1	2026-03-07 05:15:44.412	\N
17	images/1772860547849-ahemfx.png	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1772860547849-ahemfx.png	image	Rectangle 13.png	153405	image/png	1	2026-03-07 05:15:48.138	\N
18	images/1772860551175-sn4jp6.png	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1772860551175-sn4jp6.png	image	Rectangle 18.png	162425	image/png	1	2026-03-07 05:15:51.759	\N
19	images/1772860559611-cs3sk8.png	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1772860559611-cs3sk8.png	image	Rectangle 247.png	2304855	image/png	1	2026-03-07 05:16:00.772	\N
20	images/1772860583090-mq1ghm.png	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1772860583090-mq1ghm.png	image	envato-labs-image-edit (3) 1.png	211278	image/png	1	2026-03-07 05:16:23.499	\N
21	images/1772860589894-uhb6md.png	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1772860589894-uhb6md.png	image	Rectangle 17.png	246529	image/png	1	2026-03-07 05:16:30.359	\N
22	images/1772860593017-lulzaj.png	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1772860593017-lulzaj.png	image	envato-labs-image-edit (3) 2.png	175371	image/png	1	2026-03-07 05:16:33.431	\N
1	images/1772850357410-p9qmi7.png	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1772850357410-p9qmi7.png	image	aerial-shot-of-the-komodo-national-park-in-indones-2026-01-08-00-27-30-utc 1 (1).png	3096844	image/png	1	2026-03-07 02:25:58.469	\N
11	images/1772859468139-bo0qsu.png	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1772859468139-bo0qsu.png	image	Rectangle 244.png	1176233	image/png	1	2026-03-07 04:57:48.552	\N
23	images/1773283721645-adc3mv.webp	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1773283721645-adc3mv.webp	image	Rectangle 251.webp	44408	image/webp	1	2026-03-12 02:48:43.06	\N
24	images/1773283862884-6eav3p.webp	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1773283862884-6eav3p.webp	image	Rectangle 253.webp	156772	image/webp	1	2026-03-12 02:51:03.92	\N
25	images/1773283882452-9uwba8.webp	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1773283882452-9uwba8.webp	image	Rectangle 253 (1).webp	234526	image/webp	1	2026-03-12 02:51:23.814	\N
26	images/1773283911239-2r2qij.webp	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1773283911239-2r2qij.webp	image	Rectangle 253 (2).webp	71530	image/webp	1	2026-03-12 02:51:53.679	\N
27	images/1773284060706-1scnat.webp	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1773284060706-1scnat.webp	image	Rectangle 244.webp	75484	image/webp	1	2026-03-12 02:54:21.827	\N
28	images/1773284103933-ebqrh4.webp	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1773284103933-ebqrh4.webp	image	Rectangle 244.webp	75484	image/webp	1	2026-03-12 02:55:05.772	\N
29	images/1773284304677-55lxnv.webp	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1773284304677-55lxnv.webp	image	Rectangle 254.webp	25454	image/webp	1	2026-03-12 02:58:25.881	\N
30	images/1773285284215-3zjzuf.webp	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1773285284215-3zjzuf.webp	image	Rectangle 10.webp	34924	image/webp	1	2026-03-12 03:14:46.351	\N
31	images/1773285298972-7zvtoc.webp	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1773285298972-7zvtoc.webp	image	Rectangle 11.webp	21760	image/webp	1	2026-03-12 03:15:00.053	\N
32	images/1773285311831-ldsex9.webp	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1773285311831-ldsex9.webp	image	Rectangle 12.webp	28868	image/webp	1	2026-03-12 03:15:12.966	\N
33	images/1773285330061-sg27vt.webp	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1773285330061-sg27vt.webp	image	Rectangle 13.webp	41274	image/webp	1	2026-03-12 03:15:31.174	\N
34	images/1773289209124-3tzwld.png	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1773289209124-3tzwld.png	image	Rectangle 269.png	577115	image/png	1	2026-03-12 04:20:11.994	\N
35	images/1773289254942-uu49d3.png	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1773289254942-uu49d3.png	image	Rectangle 270.png	674942	image/png	1	2026-03-12 04:20:56.834	\N
36	images/1773289278596-f5tbfd.png	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1773289278596-f5tbfd.png	image	Rectangle 271.png	669425	image/png	1	2026-03-12 04:21:19.915	\N
37	images/1773289314239-823p50.webp	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1773289314239-823p50.webp	image	Rectangle 271.webp	121094	image/webp	1	2026-03-12 04:21:55.293	\N
38	images/1773289341980-scyqm0.webp	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1773289341980-scyqm0.webp	image	Rectangle 272.webp	114030	image/webp	1	2026-03-12 04:22:24.31	\N
39	images/1773303258336-nohy30.webp	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1773303258336-nohy30.webp	image	aerial-shot-of-the-komodo-national-park-in-indones-2026-01-08-00-27-30-utc 1 (1).webp	413198	image/webp	1	2026-03-12 08:14:20.614	\N
40	images/1773303905548-hatvvf.webp	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1773303905548-hatvvf.webp	image	Rectangle 285.webp	255728	image/webp	1	2026-03-12 08:25:06.836	\N
41	images/1773328431590-8x5ewz.webp	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1773328431590-8x5ewz.webp	image	aerial-shot-of-the-komodo-national-park-in-indones-2026-01-08-00-27-30-utc 1 (1).webp	413198	image/webp	1	2026-03-12 15:13:52.297	\N
42	images/1773328707802-tqpn6d.webp	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1773328707802-tqpn6d.webp	image	aerial-shot-of-the-komodo-national-park-in-indones-2026-01-08-00-27-30-utc 1 (1).webp	413198	image/webp	1	2026-03-12 15:18:28.67	\N
43	videos/1773330084431-q30mdp.mp4	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/videos/1773330084431-q30mdp.mp4	video	Travel Hero Video (1) (1).mp4	10743875	video/mp4	1	2026-03-12 15:41:26.44	2026-03-13 13:39:03.815
44	videos/1773357798329-n9fhng.mp4	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/videos/1773357798329-n9fhng.mp4	video	Travel Hero Video (1).mp4	19646180	video/mp4	1	2026-03-12 23:23:26.823	2026-03-13 13:39:06.922
45	images/1773409271550-qwa7is.webp	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/images/1773409271550-qwa7is.webp	image	Rectangle 253 (1).webp	234526	image/webp	1	2026-03-13 13:41:12.586	\N
46	videos/1773409323446-kwa68g.mp4	https://pub-326b3cc59f484d4fa165e65b5c4836c1.r2.dev/videos/1773409323446-kwa68g.mp4	video	Travel Hero Video (1).mp4	16647563	video/mp4	1	2026-03-13 13:42:09.339	\N
\.


--
-- Data for Name: navigation; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.navigation (id, label, url, parent_id, "order", icon, target, is_active, created_at, updated_at, deleted_at, platform) FROM stdin;
1	Indonesia Journal	/	\N	0		_self	t	2026-03-05 06:10:50.354	2026-03-05 06:10:50.354	\N	desktop
2	Portfolio	/portfolio	\N	0		_self	t	2026-03-05 06:11:03.261	2026-03-05 06:11:03.261	\N	desktop
3	Sustainable Impact	/sustainable-impact	\N	0		_self	t	2026-03-05 06:11:22.961	2026-03-05 06:11:22.961	\N	desktop
4	Let's Connected	/contact-us	\N	0		_self	t	2026-03-05 06:11:29.986	2026-03-12 14:24:39.408	\N	desktop
5	Our Inspiration	/	\N	0		_self	t	2026-03-13 19:20:08.913	2026-03-13 19:20:08.913	\N	mobile
6	Prestige Event	/	\N	0		_self	t	2026-03-13 19:20:18.326	2026-03-13 19:20:18.326	\N	mobile
7	Signature Voyage	/	\N	0		_self	t	2026-03-13 19:20:28.993	2026-03-13 19:20:28.993	\N	mobile
8	Wellness Escape	/	\N	0		_self	t	2026-03-13 19:20:40.815	2026-03-13 19:20:40.815	\N	mobile
9	Curated Experience	/	\N	0		_self	t	2026-03-13 19:20:49.645	2026-03-13 19:20:49.645	\N	mobile
10	Indonesia Journal	/	\N	0		_self	t	2026-03-13 19:21:00.388	2026-03-13 19:21:00.388	\N	mobile
11	Portfolio	/	\N	0		_self	t	2026-03-13 19:21:09.303	2026-03-13 19:21:09.303	\N	mobile
12	Sustainable Impact	/	\N	0		_self	t	2026-03-13 19:21:20.351	2026-03-13 19:21:20.351	\N	mobile
\.


--
-- Data for Name: page_sections; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.page_sections (id, page_name, page_slug, page_data, created_by, created_at, updated_at, deleted_at) FROM stdin;
3	Our Inspiration	our-inspiration	{"hero":{"title":"BOARD LETTER","description":"","background":"https://cdn.takshaka.id/images/1772859468139-bo0qsu.png"},"boardLetter":{"imageUrl":"https://cdn.takshaka.id/images/1772859514262-mzqkzp.png","paragraphs":[{"null":"At Takshaka, we believe that true leadership is defined by the ability to adapt and innovate in an ever-evolving landscape. This past year has been a testament to our resilience and our unwavering commitment to excellence."},{"null":"Our focus remains clear: to drive sustainable growth while delivering exceptional value to our clients and partners. By integrating forward-thinking strategies with a dedicated team, Takshaka is not just keeping pace with the industry—we are setting the standard for the future."},{"null":"We thank you for your continued trust as we embark on this next chapter of our journey."}],"signatureName":"Leadership Team","signatureTitle":"Taksaka"},"fullwidthImage":{"src":"https://cdn.takshaka.id/images/1772860505814-6klxu4.png","alt":"Inspiration"},"takskaWay":{"sectionTitle":"TAKSHAKA WAY","items":[{"id":"authenticity","title":"AUTHENTICITY","imageUrl":"https://cdn.takshaka.id/images/1772860523140-qakw5e.png"},{"id":"transformation","title":"TRANSFORMATION","imageUrl":"https://cdn.takshaka.id/images/1772860535501-xy5w04.png"},{"id":"sustainability","title":"SUSTAINABILITY","imageUrl":"https://cdn.takshaka.id/images/1772860544053-76mv7w.png"},{"id":"harmony","title":"HARMONY","imageUrl":"https://cdn.takshaka.id/images/1772860547849-ahemfx.png"},{"id":"excellence","title":"EXCELLENCE\\nIN EXPERIENCE","imageUrl":"https://cdn.takshaka.id/images/1772860551175-sn4jp6.png"}]},"brandStory":{"backgroundImage":"https://cdn.takshaka.id/images/1772860559611-cs3sk8.png","sectionTitle":"BRAND STORY","items":[{"id":"origin","title":"THE ORIGIN","description":"Taksaka draws from a rich cultural heritage, weaving together ancestral wisdom with contemporary consciousness to create transformative journeys.","imageUrl":"https://cdn.takshaka.id/images/1772860583090-mq1ghm.png"},{"id":"myth","title":"MYTH & SYMBOL","description":"More than mythology, Taksaka embodies the sacred connection between the ethereal and the spiritual, honoring the timeless and cherished traditions.","imageUrl":"https://cdn.takshaka.id/images/1772860589894-uhb6md.png"},{"id":"meaning","title":"MEANING","description":"At its heart, Taksaka seeks to awaken collective revelation advancing consciousness, responsibility, and renewal to transform experience.","imageUrl":"https://cdn.takshaka.id/images/1772860593017-lulzaj.png"}]},"timeline":{"sectionTitle":"SPIRITUAL JOURNEY","items":[{"id":"mount-agung","title":"MOUNT AGUNG","description":"The axis of spiritual elevation."},{"id":"cloud","title":"CLOUD","description":"Aspiration beyond boundaries."},{"id":"air","title":"AIR","description":"Invisible force that connects all."},{"id":"fire","title":"FIRE","description":"Energy of transformation."},{"id":"water","title":"WATER","description":"Balance through adaptability."},{"id":"night-queen","title":"NIGHT QUEEN","description":"Timeless victory and grace."},{"id":"dragon","title":"DRAGON","description":"Directional growth and evolution."},{"id":"dragon-wing","title":"DRAGON WING","description":"Transcendental strength."},{"id":"gold-crown","title":"GOLD CROWN","description":"Illuminated authority."},{"id":"circle","title":"CIRCLE","description":"Eternal unity."},{"id":"gold-jewels","title":"GOLD JEWELS","description":"Inner prosperity and clarity."}]}}	1	2026-03-06 14:27:23.826482	2026-03-12 10:02:39.043	\N
5	Prestige Events	prestige-events	{"hero":{"title":"PRESTIGE EVENTS","description":"IDEAS DEMAND WORTHY STAGES","background":"https://cdn.takshaka.id/images/1773284103933-ebqrh4.webp"},"heroContent":{"backgroundImage":"https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1920&q=80","alt":"Prestige Event Stage","badge":"CONFERENCE & SUMMIT","heading":"IDEAS DEMAND\\nWORTHY STAGES","description":"The world's boldest ideas deserve a stage to match, and TakskaEvents creates experiences that turn conversation into transformation. Every event unfolds as a carefully choreographed masterpiece—from intimate roundtables to grand summits with thousands. We believe in creating powerful moments of connection and impact while building global peer communities.","slides":[{"backgroundImage":"https://cdn.takshaka.id/images/1773283721645-adc3mv.webp","alt":"Ideas Demand Worthy Stages","badge":"Conference & Summit","heading":"Ideas Demand Worthy Stages","description":"The world’s boldest ideas deserve a stage to match, and Takshaka curates conferences and summits where intellectual rigor meets elevated experience, overseeing every detail from venue and keynote orchestration to world-class production and seamless global guest management."},{"backgroundImage":"https://cdn.takshaka.id/images/1773283862884-6eav3p.webp","alt":"Tables Set with Gold and Memory","badge":"Reception & Gala","heading":"Tables Set with Gold and Memory","description":"A Takshaka gala dinner is not a meal but a meticulously composed sensory narrative, set in extraordinary locations, crafted with Indonesia’s finest culinary and cultural talents, and executed with obsessive precision to deliver an unforgettable experience."},{"backgroundImage":"https://cdn.takshaka.id/images/1773283882452-9uwba8.webp","alt":"Reward the Extraordinary with the Extraordinary","badge":"Incentive & Gathering","heading":"Reward the Extraordinary with the Extraordinary","description":"Your highest performers deserve more than recognition, they deserve an experience that becomes the benchmark for reward. Takshaka incentive programs deliver bespoke journeys, blending private access, curated cultural encounters, and seamless, understated luxury, designed for lasting impact and memory."},{"backgroundImage":"https://cdn.takshaka.id/images/1773283911239-2r2qij.webp","alt":"Your Debut Deserves Dragon Fire","badge":"Launching & Exhibition","heading":"Your Debut Deserves Dragon Fire","description":"When a brand launches in Indonesia or steps onto the global stage, the moment demands precision and theatrical impact. Takshaka crafts product launches and brand activations that spark conversation, earn coverage, and deliver reveal moments that are architecturally and dramatically flawless."}]},"twoColumn":{"title":"WHERE BUSINESS","titleItalic":"TRANSFORM INTO","titleBold":"EXPERIENCE","description":"When business gathers in the right setting, shaped by clear intention, it doesn’t just meet objectives, it transcends them.\\n\\nThe world’s most forward-thinking organizations choose Takshaka to ensure their people return transformed and their brand leaves an impression that endures long after the conference ends.","imageUrl":"https://cdn.takshaka.id/images/1773284304677-55lxnv.webp"},"imageGallery":{"images":[{"id":"1","src":"https://cdn.takshaka.id/images/1773285284215-3zjzuf.webp","alt":"Mountain landscape","caption":"UNLOCK TEAM POTENTIAL WITH CULTURE","link":"/"},{"id":"2","src":"https://cdn.takshaka.id/images/1773285298972-7zvtoc.webp","alt":"high impact conference & meeting","caption":"high impact conference & meeting","link":"/"},{"id":"3","src":"https://cdn.takshaka.id/images/1773285311831-ldsex9.webp","alt":"UNLOCK INSPIRATION FROM LOCAL CULTURE","caption":"UNLOCK INSPIRATION FROM LOCAL CULTURE","link":"/"},{"id":"4","src":"https://cdn.takshaka.id/images/1773285330061-sg27vt.webp","alt":"IMPACTFUL ENVIRONMENTAL EVENTS","caption":"IMPACTFUL ENVIRONMENTAL EVENTS","link":"/"}]},"whatMakesUsDifferent":{"title":"WHAT MAKE US DIFFERENT'S?","items":[{"title":"Rooted\\nin Culture","description":"We blend local wisdom into modern, meaningful formats that feel fresh and relevant."},{"title":"All-in-One Service","description":"From travel, design, content, logistics, to wellness, all in sync. No need to coordinate multiple vendors."},{"title":"Meaning in Every Moment","description":"From how guests are welcomed to what they feel when they leave, everything is intentional."},{"title":"Sustainability & Inclusion in Practice","description":"From accessible setups to eco-friendly event kits, we embed values into real details that matter, not just as decoration."}]}}	1	2026-03-06 21:48:32.428145	2026-03-12 14:10:54.642	\N
6	Signature Voyage	signature-voyage	{"hero":{"title":"SIGNATURE VOYAGE","description":"CURATED TRAVEL EXPERIENCES THAT TRANSFORM","background":"https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1920&q=80"},"topDestinations":{"title":"TOP DESTINATION AROUND INDONESIA","subtitle":"A curated collection of Indonesia's most extraordinary destinations, where nature, culture, and refined travel experiences converge.","destinations":[{"title":"BALI","subtitle":"Indonesian most iconic island, where sacred culture meets luxury hospitality","description":"Bali enchants with its temples, rice terraces, and spiritual traditions. Experience ancient ceremonies, wellness retreats, and pristine beaches in harmony with Balinese hospitality.","image":"https://cdn.takshaka.id/images/1773303905548-hatvvf.webp"},{"title":"LOMBOK","subtitle":"A serene island escape defined by pristine beaches and underwater treasures","description":"A serene island escape defined by pristine beaches and underwater treasures. Remote beauty meets sustainable luxury in this untouched paradise.","image":"https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&q=80"},{"title":"LABUAN BAJO","subtitle":"Gateway to Komodo National Park and extraordinary marine adventures","description":"We curate gateway to Komodo National Park and extraordinary marine adventures. Dive alongside majestic manta rays and explore volcanic islands.","image":"https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=600&q=80"},{"title":"LIKUPANG","subtitle":"A tranquil North Sulawesi retreat favored by pristine beaches and underwater wonders","description":"A tranquil North Sulawesi retreat favored by pristine beaches and underwater wonders. Pristine dive sites and white sand beaches.","image":"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80"},{"title":"MOROTAI","subtitle":"A coastal island frontier offering crystal waters, rich history, and rare exclusivity","description":"A coastal island frontier offering crystal waters, rich history, and rare exclusivity. Experience untouched natural beauty and cultural authenticity.","image":"https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&q=80"},{"title":"WAKATOBI","subtitle":"A world-renowned marine sanctuary celebrated for extraordinary diving and biodiversity","description":"A world-renowned marine sanctuary celebrated for extraordinary diving and biodiversity. Premier destination for underwater exploration.","image":"https://images.unsplash.com/photo-1451108636100-e071f88e0e7e?w=600&q=80"},{"title":"RAJA AMPAT","subtitle":"An iconic archipelago of emerald islands about the richest coral and marine life on earth","description":"An iconic archipelago of emerald islands about the richest coral and marine life on earth. World-class diving destination.","image":"https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80"},{"title":"BANGKA BELITONG","subtitle":"A coastal paradise of pristine islands and luminous white-sand beaches","description":"A coastal paradise of pristine islands and luminous white-sand beaches. Perfect for beach lovers and island hoppers.","image":"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80"}]}}	1	2026-03-12 07:37:31.865316	2026-03-12 08:25:13.579	\N
2	Homepage	home	{"hero":{"title":"SIGNATURE VOYAGE","subtitle":"Our Curated Travel Experience \\nwith Meaningful Impact","background":"https://cdn.takshaka.id/videos/1773357798329-n9fhng.mp4","contents":[{"title":"Signature Voyage","description":"Our Curated Travel Experience with Meaningful Impact","background":"https://cdn.takshaka.id/videos/1773409323446-kwa68g.mp4"},{"title":"Signature Voyage","description":"Our Curated Travel Experience with Meaningful Impact","background":"https://cdn.takshaka.id/images/1773409271550-qwa7is.webp"}]},"threeItemSection":{"heading":"Rooted in cultural wisdom, we curate bespoke experiences that are meaningful, transformative, and timeless.","images":[{"image":"https://cdn.takshaka.id/images/1772850784664-1r4ddc.png","alt":"Impactful Experience","title":"Impactful Experience","description":"Every journey designed with intention, precision, and meaning."},{"image":"https://cdn.takshaka.id/images/1772850801856-xq8a12.png","alt":"Cultural Wisdom","title":"Cultural Wisdom","description":"Inspired by the depth of cultural wisdom, we design experiences that transcend beauty, harmony, and transformation."},{"image":"https://cdn.takshaka.id/images/1772850805800-3crjuk.png","alt":"Bespoke Services","title":"Bespoke Services","description":"We curate bespoke experiences, meticulously crafted for each client, transforming vision into moments of lasting meaning."}]},"imagesSection":{"images":[{"src":"https://cdn.takshaka.id/images/1772850864455-fpdy8t.png","alt":"Indonesian cultural heritage"},{"src":"https://cdn.takshaka.id/images/1772850867319-pqzlkn.png","alt":"Indonesian traditions and arts"},{"src":"https://cdn.takshaka.id/images/1772850869995-f34fnr.png","alt":"Indonesian immersive experiences"}],"description":"A curated collection of Indonesia’s most inspiring destinations and immersive experiences. From cultural heritage and gastronomy to marine exploration, wildlife, and adventure, each journey is thoughtfully designed to reveal the richness of Indonesia while creating meaningful and memorable moments."},"curatedExperiences":{"tabs":[{"id":"tab-1","label":"General","items":[{"id":"1","title":"lorem ipsum dolor sit amet Edit","description":"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum","image":""}]}],"selectedCategoryIds":[2,3,5,4,6]},"experiencesShared":{"experiences":[{"id":"1","title":"YACHT BALI","description":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam eu condimentum arcu, a fermentum magna. Donec rutrum quis massa sit amet viverra. Integer pretium nunc ut diam tempus feugiat.","image":"https://cdn.takshaka.id/images/1772859237924-70i5yt.png"},{"id":"2","title":"GRAND CANYON","description":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam eu condimentum arcu, a fermentum magna. Donec rutrum quis massa sit amet viverra. Integer pretium nunc ut diam tempus feugiat.","image":"https://cdn.takshaka.id/images/1772859241079-o168vy.png"},{"id":"3","title":"PHI PHI ISLAND","description":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam eu condimentum arcu, a fermentum magna. Donec rutrum quis massa sit amet viverra. Integer pretium nunc ut diam tempus feugiat.","image":"https://cdn.takshaka.id/images/1772859245474-bg7or1.png"}]}}	1	2026-03-06 07:05:44.27368	2026-03-13 13:42:17.986	\N
\.


--
-- Data for Name: page_views; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.page_views (id, page_slug, page_title, visitor_id, referrer, user_agent, ip_address, created_at) FROM stdin;
1	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-10 22:18:20.398
2	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-11 13:22:21.673
3	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-11 13:48:30.038
4	/our-inspiration	Our Inspiration	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-11 13:48:36.952
5	/our-inspiration	Our Inspiration	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-11 13:48:36.955
6	/	Home	2ecea537a54c33ea169f774420db3e64	\N	vercel-screenshot/1.0	146.190.133.82	2026-03-11 14:02:01.721
7	/	Home	656c15f17bd7ce7e83a35253c2cb71d0	\N	vercel-screenshot/1.0	137.184.37.40	2026-03-11 14:02:03.596
8	/	Home	b9f3348b2b4e6c98e046228f2d9b68e0	https://takshaka-project-fj6we71k9-takshakabaliwebsite-6496s-projects.vercel.app/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	103.171.146.56	2026-03-11 14:02:28.521
9	/	Home	2af78c7389a361b6f8bfaded74b2831f	\N	Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/144.0.7559.95 Mobile/15E148 Safari/604.1	104.22.17.121	2026-03-11 14:24:41.609
10	/	Home	143f5035b2316b60391619283265e65e	\N	Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/144.0.7559.95 Mobile/15E148 Safari/604.1	162.159.104.152	2026-03-11 14:24:41.606
11	/	Home	a49536e036865c053464536e88eb811f	https://www.google.com/	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	172.69.194.242	2026-03-11 16:21:33.858
12	/	Home	e7a848eff7d785f79db73ab2e77980a7	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36	162.158.38.194	2026-03-11 17:24:01.05
13	/	Home	2a9178240aa698ac67dd2c5ea4988c9b	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.7680.71 Safari/537.36	104.23.160.42	2026-03-11 17:58:04.266
14	/	Home	5223c35fd6c9cec41bfb8390854fffde	\N	Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1	108.162.245.232	2026-03-11 17:58:12.219
15	/	Home	0a1f58a867b8dbed75db578652a0e79c	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	162.158.170.62	2026-03-11 19:07:04.473
16	/our-inspiration	Our Inspiration	590bbe3676d9b99808de5f97f3d3e060	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	162.158.170.63	2026-03-11 19:07:11.495
17	/	Home	590bbe3676d9b99808de5f97f3d3e060	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	162.158.170.63	2026-03-11 19:07:16.96
18	/prestige-event	Prestige Events	0a1f58a867b8dbed75db578652a0e79c	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	162.158.170.62	2026-03-11 19:07:22.277
19	/our-inspiration	Our Inspiration	0a1f58a867b8dbed75db578652a0e79c	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	162.158.170.62	2026-03-11 19:07:28.784
20	/	Home	703c916427175df8d52db5f6452665ee	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	162.158.190.18	2026-03-11 19:16:20.398
21	/	Home	703c916427175df8d52db5f6452665ee	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	162.158.190.18	2026-03-11 19:16:22.728
22	/	Home	703c916427175df8d52db5f6452665ee	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	162.158.190.18	2026-03-11 19:16:23.522
23	/	Home	703c916427175df8d52db5f6452665ee	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	162.158.190.18	2026-03-11 19:16:24.255
24	/	Home	703c916427175df8d52db5f6452665ee	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	162.158.190.18	2026-03-11 19:16:25.294
25	/	Home	533bdee2c407d966a6d5269167173d29	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	104.23.175.147	2026-03-12 01:29:01.837
26	/prestige-event	Prestige Events	77fb187d3f15bad35c90a7f0f21b726f	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	104.23.175.146	2026-03-12 01:29:30.349
27	/our-inspiration	Our Inspiration	533bdee2c407d966a6d5269167173d29	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	104.23.175.147	2026-03-12 01:29:47.431
28	/	Home	77fb187d3f15bad35c90a7f0f21b726f	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	104.23.175.146	2026-03-12 01:29:54.266
29	/	Home	77fb187d3f15bad35c90a7f0f21b726f	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	104.23.175.146	2026-03-12 01:29:57.749
30	/	Home	1e89ccafd6de8ca01442e70f7f1e853b	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15	104.23.175.132	2026-03-12 02:06:39.865
31	/	Home	8d76ff55ce7b21ace96d1b2beacaac54	https://www.google.com/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15	104.23.175.146	2026-03-12 02:07:03.271
32	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 02:25:52.116
33	/our-inspiration	Our Inspiration	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 02:26:05.538
34	/our-inspiration	Our Inspiration	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 02:26:05.54
35	/	Home	158403fc36a9c85f172f7c0f84bc2df9	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.69.176.67	2026-03-12 02:26:33.958
36	/our-inspiration	Our Inspiration	158403fc36a9c85f172f7c0f84bc2df9	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.69.176.67	2026-03-12 02:26:34.299
37	/our-inspiration	Our Inspiration	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 02:26:39.497
38	/our-inspiration	Our Inspiration	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 02:27:08.642
39	/	Home	158403fc36a9c85f172f7c0f84bc2df9	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.69.176.67	2026-03-12 02:27:14.921
40	/our-inspiration	Our Inspiration	158403fc36a9c85f172f7c0f84bc2df9	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.69.176.67	2026-03-12 02:27:16.53
41	/our-inspiration	Our Inspiration	158403fc36a9c85f172f7c0f84bc2df9	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.69.176.67	2026-03-12 02:27:19.457
42	/our-inspiration	Our Inspiration	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 02:28:24.14
43	/our-inspiration	Our Inspiration	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 02:31:21.996
44	/our-inspiration	Our Inspiration	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 02:31:47.357
45	/our-inspiration	Our Inspiration	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 02:31:47.359
46	/prestige-event	Prestige Events	3f0dc78b8eefd550ca7ff88caf8b7873	http://localhost:3000/prestige-event	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 02:32:16.128
47	/prestige-event	Prestige Events	3f0dc78b8eefd550ca7ff88caf8b7873	http://localhost:3000/prestige-event	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 02:35:52.708
48	/prestige-event	Prestige Events	3f0dc78b8eefd550ca7ff88caf8b7873	http://localhost:3000/prestige-event	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 02:37:40.542
49	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 02:37:48.893
50	/prestige-event	Prestige Events	3f0dc78b8eefd550ca7ff88caf8b7873	http://localhost:3000/prestige-event	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 02:49:15.76
51	/prestige-event	Prestige Events	3f0dc78b8eefd550ca7ff88caf8b7873	http://localhost:3000/prestige-event	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 02:52:11.695
52	/prestige-event	Prestige Events	3f0dc78b8eefd550ca7ff88caf8b7873	http://localhost:3000/prestige-event	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 02:54:27.554
53	/prestige-event	Prestige Events	3f0dc78b8eefd550ca7ff88caf8b7873	http://localhost:3000/prestige-event	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 02:55:13.892
54	/prestige-event	Prestige Events	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 02:58:53.71
55	/prestige-event	Prestige Events	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 03:15:40.529
56	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	http://localhost:3000/prestige-event	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 03:16:57.485
57	/prestige-event	Prestige Events	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 03:16:59.977
58	/prestige-event	Prestige Events	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 03:25:45.61
59	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 04:23:07.33
60	/prestige-event	Prestige Events	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 04:23:10.789
61	/prestige-event	Prestige Events	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 04:23:10.792
62	/prestige-event	Prestige Events	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 04:26:23.762
63	/prestige-event	Prestige Events	3f0dc78b8eefd550ca7ff88caf8b7873	http://localhost:3000/prestige-event	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 04:31:18.879
64	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	http://localhost:3000/prestige-event	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 04:49:24.33
65	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	http://localhost:3000/prestige-event	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 04:49:24.337
66	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	http://localhost:3000/prestige-event	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 04:49:25.226
67	/	Home	20b7f9b37830dcfa49f33a0cf86265f7	\N	vercel-screenshot/1.0	137.184.12.43	2026-03-12 04:52:04.065
68	/	Home	8ed7c16d68e5569b61519389ad1b5811	\N	vercel-screenshot/1.0	64.23.178.209	2026-03-12 04:52:04.199
69	/	Home	77703603fe774f95cf5a6f3aa4d563d0	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.69.176.97	2026-03-12 04:52:54.202
70	/	Home	606106c53fc4469b816b1048c5d6ada3	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.69.176.66	2026-03-12 04:53:03.25
71	/prestige-event	Prestige Events	606106c53fc4469b816b1048c5d6ada3	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.69.176.66	2026-03-12 04:53:04.624
72	/	Home	120f8ee4fbd01059045c153ac975b829	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.5938.132 Safari/537.36	172.68.27.95	2026-03-12 05:30:19.82
73	/	Home	3916615f0d86ee8a7c4547a2b4acc878	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.68.164.119	2026-03-12 06:06:13.991
74	/prestige-event	Prestige Events	e7a1e81b715a820ccf9c61635f71a239	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.71.81.47	2026-03-12 06:13:51.996
75	/prestige-event	Prestige Events	e7a1e81b715a820ccf9c61635f71a239	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.71.81.47	2026-03-12 06:13:54.188
76	/	Home	5cecfcbda5f2e1ba94edf1c5dcbfbff9	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	172.71.124.224	2026-03-12 07:10:20.325
77	/	Home	5cecfcbda5f2e1ba94edf1c5dcbfbff9	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	172.71.124.224	2026-03-12 07:10:22.452
78	/	Home	5cecfcbda5f2e1ba94edf1c5dcbfbff9	https://www.takshaka.id/	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	172.71.124.224	2026-03-12 07:10:54.177
79	/	Home	5cecfcbda5f2e1ba94edf1c5dcbfbff9	https://www.takshaka.id/	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	172.71.124.224	2026-03-12 07:10:58.03
80	/prestige-event	Prestige Events	5cecfcbda5f2e1ba94edf1c5dcbfbff9	https://www.takshaka.id/	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	172.71.124.224	2026-03-12 07:10:59.156
81	/	Home	5cecfcbda5f2e1ba94edf1c5dcbfbff9	https://www.takshaka.id/	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	172.71.124.224	2026-03-12 07:11:21.54
82	/our-inspiration	Our Inspiration	5cecfcbda5f2e1ba94edf1c5dcbfbff9	https://www.takshaka.id/	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	172.71.124.224	2026-03-12 07:11:25.933
83	/	Home	5febf67f00cc117b1b2b135827041e4f	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	162.159.102.149	2026-03-12 07:30:53.618
84	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 07:31:48.304
85	/	Home	dd0ceab340d06d90772cbf98ee67f36f	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	162.158.88.120	2026-03-12 07:35:23.735
86	/signature-voyage	Signature Voyage	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 07:37:36.311
87	/prestige-event	Prestige Events	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 07:37:45.62
88	/prestige-event	Prestige Events	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 07:37:45.622
89	/signature-voyage	Signature Voyage	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 07:37:50.581
90	/signature-voyage	Signature Voyage	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 07:37:50.583
91	/signature-voyage	Signature Voyage	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 07:38:24.148
92	/signature-voyage	Signature Voyage	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 07:38:41.421
93	/prestige-event	Prestige Events	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 07:38:57.029
94	/prestige-event	Prestige Events	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 07:38:57.032
96	/signature-voyage	Signature Voyage	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 07:43:05.555
95	/signature-voyage	Signature Voyage	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 07:43:05.558
97	/signature-voyage	Signature Voyage	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 07:43:11.273
98	/signature-voyage	Signature Voyage	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 07:45:25.219
99	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 08:00:48.986
100	/signature-voyage	Signature Voyage	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 08:00:52.729
101	/signature-voyage	Signature Voyage	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 08:00:52.733
102	/	Home	82fcd9b928326cea6501d2bc6e45ec12	\N	Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36	162.158.95.141	2026-03-12 08:02:13.577
103	/signature-voyage	Signature Voyage	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 08:06:34.087
104	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 08:18:33.181
105	/signature-voyage	Signature Voyage	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 08:18:37.195
106	/signature-voyage	Signature Voyage	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 08:18:37.198
107	/signature-voyage	Signature Voyage	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 08:25:18.945
108	/signature-voyage	Signature Voyage	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 08:32:00.452
109	/signature-voyage	Signature Voyage	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 08:35:41.724
110	/signature-voyage	Signature Voyage	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 08:37:26.179
111	/	Home	5c7d7ba30d6b0fae25348a5e6613d8df	\N	vercel-screenshot/1.0	143.198.63.243	2026-03-12 08:44:36.937
112	/	Home	656c15f17bd7ce7e83a35253c2cb71d0	\N	vercel-screenshot/1.0	137.184.37.40	2026-03-12 08:44:37.55
113	/	Home	5e261d12c2cca4e1cf0a2c335dee6132	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	104.22.66.54	2026-03-12 08:57:36.372
114	/signature-voyage	Signature Voyage	258896a5e944ab66e57bd999418b0c71	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	104.22.66.184	2026-03-12 08:57:54.875
115	/	Home	65af2fd5fa856771509ddf0798f74de7	https://www.takshaka.id/	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	104.23.175.147	2026-03-12 08:59:31.932
116	/our-inspiration	Our Inspiration	533bdee2c407d966a6d5269167173d29	https://www.takshaka.id/	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	104.23.175.147	2026-03-12 09:01:00.957
117	/our-inspiration	Our Inspiration	533bdee2c407d966a6d5269167173d29	https://www.takshaka.id/	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	104.23.175.147	2026-03-12 09:01:02.724
118	/signature-voyage	Signature Voyage	533bdee2c407d966a6d5269167173d29	https://www.takshaka.id/	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	104.23.175.147	2026-03-12 09:02:07.026
119	/prestige-event	Prestige Events	533bdee2c407d966a6d5269167173d29	https://www.takshaka.id/	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	104.23.175.147	2026-03-12 09:02:09.115
120	/	Home	533bdee2c407d966a6d5269167173d29	https://www.takshaka.id/	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	104.23.175.147	2026-03-12 09:02:32.749
121	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 09:05:39.807
122	/prestige-event	Prestige Events	f26b7c7028ada054a4d0308a50e3bd1b	https://www.takshaka.id/	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	104.22.66.184	2026-03-12 09:15:39.616
123	/signature-voyage	Signature Voyage	f26b7c7028ada054a4d0308a50e3bd1b	https://www.takshaka.id/	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	104.22.66.184	2026-03-12 09:15:41.227
124	/prestige-event	Prestige Events	eeeff2ff4d225f276d599b69de081eaa	https://www.takshaka.id/	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	172.70.188.68	2026-03-12 09:16:32.59
125	/prestige-event	Prestige Events	65af2fd5fa856771509ddf0798f74de7	https://www.takshaka.id/	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	104.23.175.147	2026-03-12 09:17:58.258
126	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 09:18:46.211
127	/	Home	d21202af1b1aa8f74c5d8f907832acbb	https://www.takshaka.id/	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	172.71.124.225	2026-03-12 09:19:20.769
128	/our-inspiration	Our Inspiration	dc8297ced045cba803aecc186ae2273e	https://www.takshaka.id/	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	162.158.88.120	2026-03-12 09:19:27.375
129	/our-inspiration	Our Inspiration	3f0dc78b8eefd550ca7ff88caf8b7873	http://localhost:3000/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 09:20:40.41
130	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 09:20:47.004
131	/	Home	2ecea537a54c33ea169f774420db3e64	\N	vercel-screenshot/1.0	146.190.133.82	2026-03-12 09:23:46.391
132	/	Home	a2d288b2eddaa7773355618da8ec1327	\N	vercel-screenshot/1.0	143.110.147.18	2026-03-12 09:23:46.993
133	/	Home	9f12d59870d8e4f628ba09adee695550	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.70.189.97	2026-03-12 09:24:49.72
134	/our-inspiration	Our Inspiration	9f12d59870d8e4f628ba09adee695550	https://www.takshaka.id/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.70.189.97	2026-03-12 09:24:54.907
135	/	Home	65af2fd5fa856771509ddf0798f74de7	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	104.23.175.147	2026-03-12 09:41:04.347
136	/	Home	e3865ed28c9598b42e26b189dda43ec0	https://www.takshaka.id/our-inspiration	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	172.68.164.119	2026-03-12 09:42:39.245
137	/	Home	29d5a21600fb713055fd320b1119edc1	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	172.70.248.41	2026-03-12 09:46:20.574
138	/	Home	2090bd6d1b1e943eab5fa1ca1e3b4e76	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	172.71.148.122	2026-03-12 09:46:29.499
139	/	Home	9066042fc90b0b1658cf09f1ae0004e2	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	172.70.208.24	2026-03-12 09:55:05.282
140	/	Home	9066042fc90b0b1658cf09f1ae0004e2	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	172.70.208.24	2026-03-12 09:55:40.516
141	/signature-voyage	Signature Voyage	9066042fc90b0b1658cf09f1ae0004e2	https://www.takshaka.id/	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	172.70.208.24	2026-03-12 09:55:52.621
142	/	Home	9066042fc90b0b1658cf09f1ae0004e2	https://www.takshaka.id/signature-voyage	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	172.70.208.24	2026-03-12 09:56:10.154
143	/signature-voyage	Signature Voyage	9066042fc90b0b1658cf09f1ae0004e2	https://www.takshaka.id/signature-voyage	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	172.70.208.24	2026-03-12 09:56:13.079
144	/	Home	9066042fc90b0b1658cf09f1ae0004e2	https://www.takshaka.id/signature-voyage	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	172.70.208.24	2026-03-12 09:56:16.675
145	/signature-voyage	Signature Voyage	9066042fc90b0b1658cf09f1ae0004e2	https://www.takshaka.id/signature-voyage	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	172.70.208.24	2026-03-12 09:56:17.441
146	/	Home	9066042fc90b0b1658cf09f1ae0004e2	https://www.takshaka.id/signature-voyage	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	172.70.208.24	2026-03-12 09:56:23.2
147	/prestige-event	Prestige Events	9066042fc90b0b1658cf09f1ae0004e2	https://www.takshaka.id/signature-voyage	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	172.70.208.24	2026-03-12 09:56:24.1
148	/our-inspiration	Our Inspiration	9066042fc90b0b1658cf09f1ae0004e2	https://www.takshaka.id/signature-voyage	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	172.70.208.24	2026-03-12 09:56:37.263
149	/	Home	0dc3d0464a39e72fe843ec9b1a9aa843	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	172.69.165.42	2026-03-12 09:57:14.792
150	/	Home	b498251159d50f20c65b209251f0f2dc	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	172.71.124.225	2026-03-12 09:57:28.345
151	/	Home	b0e709518d972e70890db9ad626b2fda	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.69.165.42	2026-03-12 09:57:48.028
152	/	Home	b0e709518d972e70890db9ad626b2fda	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.69.165.42	2026-03-12 09:59:44.422
153	/our-inspiration	Our Inspiration	b0e709518d972e70890db9ad626b2fda	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.69.165.42	2026-03-12 09:59:45.97
154	/our-inspiration	Our Inspiration	b0e709518d972e70890db9ad626b2fda	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.69.165.42	2026-03-12 09:59:51.484
155	/our-inspiration	Our Inspiration	b0e709518d972e70890db9ad626b2fda	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.69.165.42	2026-03-12 10:00:18.228
156	/our-inspiration	Our Inspiration	31b18f69ccff315c83acdc705f32ef2c	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.69.166.117	2026-03-12 10:01:16.214
157	/our-inspiration	Our Inspiration	31b18f69ccff315c83acdc705f32ef2c	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.69.166.117	2026-03-12 10:02:18.074
158	/our-inspiration	Our Inspiration	31b18f69ccff315c83acdc705f32ef2c	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.69.166.117	2026-03-12 10:02:23.588
159	/our-inspiration	Our Inspiration	31b18f69ccff315c83acdc705f32ef2c	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.69.166.117	2026-03-12 10:02:56.329
160	/our-inspiration	Our Inspiration	31b18f69ccff315c83acdc705f32ef2c	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.69.166.117	2026-03-12 10:02:57.085
161	/our-inspiration	Our Inspiration	31b18f69ccff315c83acdc705f32ef2c	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.69.166.117	2026-03-12 10:02:57.755
162	/	Home	4339b8c1f32ff9d0bfa80529007d8a62	\N	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.7.3 Mobile/15E148 Safari/604.1	172.69.166.117	2026-03-12 10:05:07.24
163	/our-inspiration	Our Inspiration	4339b8c1f32ff9d0bfa80529007d8a62	\N	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.7.3 Mobile/15E148 Safari/604.1	172.69.166.117	2026-03-12 10:05:08.61
164	/our-inspiration	Our Inspiration	fcb7b9007c2d91649ed142f3a76816e6	\N	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.7.3 Mobile/15E148 Safari/604.1	172.71.214.95	2026-03-12 12:46:11.055
165	/	Home	182469a7505c0260f1e1f09caf40755b	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	104.23.175.132	2026-03-12 14:07:12.228
166	/signature-voyage	Signature Voyage	182469a7505c0260f1e1f09caf40755b	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	104.23.175.132	2026-03-12 14:07:12.658
167	/prestige-event	Prestige Events	8031e83149b030dc445a606263627699	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	104.23.175.146	2026-03-12 14:07:14.703
168	/our-inspiration	Our Inspiration	8031e83149b030dc445a606263627699	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	104.23.175.146	2026-03-12 14:07:23.37
169	/signature-voyage	Signature Voyage	8031e83149b030dc445a606263627699	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	104.23.175.146	2026-03-12 14:07:27.351
170	/prestige-event	Prestige Events	8031e83149b030dc445a606263627699	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	104.23.175.146	2026-03-12 14:07:36.015
171	/	Home	8031e83149b030dc445a606263627699	https://www.takshaka.id/prestige-event	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	104.23.175.146	2026-03-12 14:07:43.658
172	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 14:09:41.13
173	/our-inspiration	Our Inspiration	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 14:09:42.99
174	/our-inspiration	Our Inspiration	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 14:09:42.993
175	/	Home	8031e83149b030dc445a606263627699	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	104.23.175.146	2026-03-12 14:09:57.069
176	/	Home	015b75bd46b704e798c19d67e202ef1a	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	104.23.175.207	2026-03-12 14:10:11.227
177	/prestige-event	Prestige Events	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 14:11:00.895
178	/prestige-event	Prestige Events	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 14:11:00.891
179	/	Home	b0f782072b6f243232f3098b75c3a3fb	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	104.23.175.147	2026-03-12 14:11:08.817
180	/our-inspiration	Our Inspiration	8031e83149b030dc445a606263627699	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	104.23.175.146	2026-03-12 14:11:12.182
181	/prestige-event	Prestige Events	b0f782072b6f243232f3098b75c3a3fb	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	104.23.175.147	2026-03-12 14:11:18.646
182	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 14:24:21.169
183	/prestige-event	Prestige Events	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 14:24:42.712
184	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 14:53:19.047
185	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 14:53:19.053
186	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 15:19:08.06
187	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 15:41:47.155
188	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 23:23:37.827
189	/	Home	2d8fc9b5725e30f7a3ca1ac3712c86bd	\N	vercel-screenshot/1.0	165.232.154.185	2026-03-12 23:25:50.176
190	/	Home	20b7f9b37830dcfa49f33a0cf86265f7	\N	vercel-screenshot/1.0	137.184.12.43	2026-03-12 23:25:50.718
191	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	http://localhost:3000/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-12 23:52:22.088
192	/	Home	f59427535db2a7f3b51594ad148dc89e	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	104.23.175.146	2026-03-13 00:48:49.934
193	/our-inspiration	Our Inspiration	c276fba0efc452afea59187df83d1b7f	https://www.takshaka.id/	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	172.71.81.48	2026-03-13 00:49:36.328
194	/signature-voyage	Signature Voyage	b328e658ca5fe4c2f817c9b0efd25352	https://www.takshaka.id/our-inspiration	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	172.70.93.16	2026-03-13 00:50:11.611
195	/	Home	b328e658ca5fe4c2f817c9b0efd25352	https://www.takshaka.id/signature-voyage	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	172.70.93.16	2026-03-13 00:50:36.818
196	/	Home	17c181dd0b48a2659e78be14a7bd8429	https://www.takshaka.id/signature-voyage	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	172.70.93.16	2026-03-13 00:50:43.686
197	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 01:33:49.801
198	/	Home	083d490a4d2636ec046fb8c27bbf26ca	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	162.158.189.89	2026-03-13 02:01:25.632
199	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 02:26:26.398
200	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 02:26:26.4
201	/signature-voyage	Signature Voyage	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 02:26:30.635
202	/signature-voyage	Signature Voyage	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 02:26:30.637
203	/blog	Blog & Artikel	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 02:27:29.517
204	/blog	Blog & Artikel	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 02:27:29.514
205	/our-inspiration	Our Inspiration	65348e3778ac5392c0cf5d9e3838c336	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	162.158.190.18	2026-03-13 02:36:18.648
206	/signature-voyage	Signature Voyage	65348e3778ac5392c0cf5d9e3838c336	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	162.158.190.18	2026-03-13 02:36:26.265
207	/our-inspiration	Our Inspiration	65348e3778ac5392c0cf5d9e3838c336	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	162.158.190.18	2026-03-13 02:36:36.876
208	/	Home	65348e3778ac5392c0cf5d9e3838c336	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	162.158.190.18	2026-03-13 02:36:37.647
209	/	Home	19ed397c5af18eb744d6e2d3839266ff	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	108.162.227.37	2026-03-13 02:38:33.814
210	/	Home	656c15f17bd7ce7e83a35253c2cb71d0	\N	vercel-screenshot/1.0	137.184.37.40	2026-03-13 02:40:03.281
211	/	Home	6eca5866d975f8dd8512dfa04b805286	\N	vercel-screenshot/1.0	137.184.85.43	2026-03-13 02:40:03.814
212	/	Home	bac9d978a12c3988443c54e3cb57472b	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.71.124.224	2026-03-13 02:43:38.524
213	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 02:44:04.487
214	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 02:44:04.49
215	/prestige-event	Prestige Events	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 02:44:08.524
216	/prestige-event	Prestige Events	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 02:44:08.528
217	/	Home	6eca5866d975f8dd8512dfa04b805286	\N	vercel-screenshot/1.0	137.184.85.43	2026-03-13 02:52:31.703
218	/	Home	656c15f17bd7ce7e83a35253c2cb71d0	\N	vercel-screenshot/1.0	137.184.37.40	2026-03-13 02:52:31.752
219	/	Home	3819f4eaeae1fac71f2a9e54285aedf0	https://vercel.com/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.71.82.15	2026-03-13 02:53:36.896
220	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 03:27:46.394
221	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 03:28:17.135
222	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 03:28:17.138
223	/prestige-event	Prestige Events	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 03:28:21.169
224	/prestige-event	Prestige Events	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 03:28:21.171
225	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 03:28:34.117
226	/	Home	565b2d351206e4bd41afc6598e271d18	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	104.22.66.185	2026-03-13 03:46:32.611
227	/	Home	e607c3d5ff36bbc7d295f2f94f034ceb	https://www.google.com/	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	172.69.166.116	2026-03-13 04:04:56.563
228	/	Home	cbaf668c4449055da9781ae2eb87e6b5	https://www.google.com/	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	172.70.108.174	2026-03-13 04:27:11.419
229	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 04:46:50.14
230	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 04:49:12.451
231	/	Home	1a40847b4e8c839e060b4aca52a3c1b9	android-app://com.google.android.googlequicksearchbox/	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	172.68.225.244	2026-03-13 04:53:38.764
232	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 04:59:33.003
233	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 05:40:31.395
234	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	http://localhost:3000/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 05:52:53.739
235	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	http://localhost:3000/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 06:04:24.925
236	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	http://localhost:3000/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 06:04:53.86
237	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	http://localhost:3000/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 06:08:46.043
238	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	http://localhost:3000/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 06:14:18.71
239	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	http://localhost:3000/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 06:17:08.726
240	/our-inspiration	Our Inspiration	3f0dc78b8eefd550ca7ff88caf8b7873	http://localhost:3000/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 06:26:05.08
241	/our-inspiration	Our Inspiration	3f0dc78b8eefd550ca7ff88caf8b7873	http://localhost:3000/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 06:26:05.083
242	/	Home	cea2533e1f1f23a6fb078f8991408881	https://www.google.com/	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	162.159.122.52	2026-03-13 06:35:29.972
243	/signature-voyage	Signature Voyage	cea2533e1f1f23a6fb078f8991408881	https://www.takshaka.id/	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	162.159.122.52	2026-03-13 07:26:45.632
244	/our-inspiration	Our Inspiration	cea2533e1f1f23a6fb078f8991408881	https://www.takshaka.id/	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	162.159.122.52	2026-03-13 07:26:57.659
245	/prestige-event	Prestige Events	e11dd9b2181c63eb80674fd2b8de19e9	https://www.takshaka.id/	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	172.68.164.118	2026-03-13 07:27:30.373
246	/prestige-event	Prestige Events	f5d49a4cc4bfdd75dd6f5c3986f40bb9	https://www.takshaka.id/	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	162.158.106.131	2026-03-13 07:27:40.333
247	/our-inspiration	Our Inspiration	f5d49a4cc4bfdd75dd6f5c3986f40bb9	https://www.takshaka.id/	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	162.158.106.131	2026-03-13 07:28:01.392
248	/prestige-event	Prestige Events	70580e2cf44ddba75a7c97d102688bd3	https://www.takshaka.id/	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	162.158.107.92	2026-03-13 07:28:04.184
249	/signature-voyage	Signature Voyage	f5d49a4cc4bfdd75dd6f5c3986f40bb9	https://www.takshaka.id/	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	162.158.106.131	2026-03-13 07:28:05.647
250	/prestige-event	Prestige Events	f5d49a4cc4bfdd75dd6f5c3986f40bb9	https://www.takshaka.id/	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	162.158.106.131	2026-03-13 07:28:07.175
251	/our-inspiration	Our Inspiration	f5d49a4cc4bfdd75dd6f5c3986f40bb9	https://www.takshaka.id/	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	162.158.106.131	2026-03-13 07:28:08.767
252	/	Home	1f5f6468d1e895abfa4872c36989135d	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	172.69.89.196	2026-03-13 07:39:08.852
253	/	Home	d1ba4fc149ee477eb2da3f03afa10c42	https://werkudara.com/	Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.7339.0 Safari/537.36	172.69.176.66	2026-03-13 07:42:50.077
254	/	Home	fe8a63d32d56fba87bea10763ae48f21	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	162.158.170.123	2026-03-13 08:49:15.46
255	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 08:59:36.653
256	/	Home	31b18f69ccff315c83acdc705f32ef2c	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.69.166.117	2026-03-13 09:19:58.93
257	/	Home	23abb7d1cf69c355c9d102938eefefc4	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 CloudflareObservatory/1.0	172.70.126.51	2026-03-13 09:21:15.834
258	/	Home	8a107145d69951b21c2b7262ce5f1b97	\N	Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36 CloudflareObservatory/1.0	172.70.100.174	2026-03-13 09:21:16.596
259	/	Home	3d96d8ad70407f6a7785fbedc1809c58	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 CloudflareObservatory/1.0	172.70.126.62	2026-03-13 09:21:28.829
260	/	Home	84b3530cdfead7a49a25b83b832ff6f5	\N	Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36 CloudflareObservatory/1.0	108.162.216.161	2026-03-13 09:21:29.925
261	/	Home	d962b033a49c885dd9366480f481f48a	\N	Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Mobile Safari/537.36 Chrome-Lighthouse	172.68.87.4	2026-03-13 09:21:39.93
262	/	Home	ba0bfa99263ff48c16fb31d6246e2410	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36 Chrome-Lighthouse	172.68.87.4	2026-03-13 09:21:39.993
263	/	Home	3d96d8ad70407f6a7785fbedc1809c58	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 CloudflareObservatory/1.0	172.70.126.62	2026-03-13 09:21:40.879
264	/	Home	84b3530cdfead7a49a25b83b832ff6f5	\N	Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36 CloudflareObservatory/1.0	108.162.216.161	2026-03-13 09:21:42.804
265	/	Home	21791504bace87e7d3019dfc5dc897a4	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/138.0.7204.23 Safari/537.36	104.23.209.211	2026-03-13 10:34:52.992
266	/our-inspiration	Our Inspiration	8ac721ccfc4268b78e2c37f4e045f8c8	https://www.takshaka.id/signature-voyage	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	172.71.124.225	2026-03-13 11:11:21.203
267	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 13:28:18.218
268	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 13:32:46.55
269	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 13:32:50.053
270	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 13:33:08.917
271	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 13:33:24.432
272	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 13:38:39.297
273	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 13:42:26.326
274	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 13:57:04.562
275	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 13:59:00.419
276	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 14:00:26.592
277	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 14:07:25.111
278	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 14:07:35.974
279	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 14:10:04.403
280	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 14:13:17.279
281	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 14:15:19.58
282	/our-inspiration	Our Inspiration	533bdee2c407d966a6d5269167173d29	https://www.takshaka.id/signature-voyage	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	104.23.175.147	2026-03-13 17:31:27.839
283	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 19:02:32.459
284	/	Home	1c27679d8e0c88239e521ca76441a747	\N	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	::1	2026-03-13 19:19:09.772
285	/	Home	1c27679d8e0c88239e521ca76441a747	\N	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	::1	2026-03-13 19:21:31.2
286	/	Home	1c27679d8e0c88239e521ca76441a747	\N	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	::1	2026-03-13 19:27:37.055
287	/	Home	1c27679d8e0c88239e521ca76441a747	\N	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	::1	2026-03-13 19:35:54.886
288	/	Home	1c27679d8e0c88239e521ca76441a747	\N	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	::1	2026-03-13 19:57:10.802
289	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 20:03:23.527
290	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 20:03:23.534
291	/	Home	3f0dc78b8eefd550ca7ff88caf8b7873	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-13 20:05:26.372
292	/	Home	ca885af68595368e3a126e0909443807	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/138.0.7204.23 Safari/537.36	172.68.138.130	2026-03-14 10:43:30.516
293	/	Home	ea72ff528a411259391f302e8a728355	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/138.0.7204.23 Safari/537.36	104.23.211.30	2026-03-14 10:55:40.211
294	/	Home	8867103f5e717dc2411495c403f0b985	\N	Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm) Chrome/100.0.4896.127 Safari/537.36	172.68.22.54	2026-03-14 15:33:27.678
295	/our-inspiration	Our Inspiration	1c27126aa052441be3c7ccfe9409c361	https://www.takshaka.id/signature-voyage	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	162.158.88.120	2026-03-15 03:23:04.967
296	/	Home	558c601b04f2c31d782b485de55e5a3a	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	162.158.88.120	2026-03-15 19:36:51.198
297	/	Home	558c601b04f2c31d782b485de55e5a3a	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	162.158.88.120	2026-03-15 19:37:09.173
298	/	Home	6bfe28737bfedeca6c939862c69f28b8	\N	vercel-screenshot/1.0	64.23.148.34	2026-03-15 19:46:58.509
299	/	Home	cc92b10808f3e87ad636a358d9bf73a5	\N	vercel-screenshot/1.0	164.92.121.12	2026-03-15 19:46:59.074
300	/	Home	dc53b554eaaeef2695d2efb89b6e0c84	https://vercel.com/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	162.158.108.67	2026-03-15 19:50:51.84
301	/prestige-event	Prestige Events	dc53b554eaaeef2695d2efb89b6e0c84	https://vercel.com/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	162.158.108.67	2026-03-15 19:51:13.219
302	/	Home	239f15a1cb4cfb26caeeaafb78a7b3fb	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	172.70.188.79	2026-03-15 19:51:38.02
303	/	Home	652c3c03d939c945e357c8480118b7dc	\N	vercel-screenshot/1.0	143.198.135.87	2026-03-15 19:52:25.79
304	/	Home	375e1decf914184ca4838dad075a1c32	\N	vercel-screenshot/1.0	24.199.119.30	2026-03-15 19:52:25.875
305	/	Home	dd951ceb5cf0d2e01c30df0775c13215	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	162.158.108.98	2026-03-16 01:55:35.688
306	/	Home	69755ecddbf52f6b5164d222bc326d52	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	162.158.108.66	2026-03-16 01:56:17.276
307	/	Home	391d0dd4e025bb7d59194eeaddc47a7e	https://www.takshaka.id/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	162.158.108.66	2026-03-16 02:01:13.67
308	/	Home	e3de6868c8366131bb602ebc77c96525	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	172.71.81.47	2026-03-16 02:33:44.32
309	/	Home	e3de6868c8366131bb602ebc77c96525	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	172.71.81.47	2026-03-16 02:33:55.339
310	/	Home	e3de6868c8366131bb602ebc77c96525	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	172.71.81.47	2026-03-16 02:34:20.365
311	/	Home	e3de6868c8366131bb602ebc77c96525	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	172.71.81.47	2026-03-16 02:34:40.212
312	/	Home	591d94969b7a7f0150ce30cf3442dadc	android-app://com.google.android.googlequicksearchbox/	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	172.70.208.24	2026-03-16 02:40:05.927
313	/	Home	8c5872e1391b6d8d4ebcb065e8c47524	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	108.162.227.53	2026-03-16 02:44:42.206
314	/	Home	bfc28c00168a04126fb3f4df7f82db8c	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	162.159.122.52	2026-03-16 02:46:52.859
315	/	Home	bfc28c00168a04126fb3f4df7f82db8c	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	162.159.122.52	2026-03-16 02:47:30.41
316	/	Home	bfc28c00168a04126fb3f4df7f82db8c	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	162.159.122.52	2026-03-16 02:47:44.692
317	/	Home	bfc28c00168a04126fb3f4df7f82db8c	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	162.159.122.52	2026-03-16 02:47:54.872
318	/	Home	bfc28c00168a04126fb3f4df7f82db8c	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	162.159.122.52	2026-03-16 02:47:56.748
319	/	Home	bfc28c00168a04126fb3f4df7f82db8c	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	162.159.122.52	2026-03-16 02:47:58.856
320	/	Home	bfc28c00168a04126fb3f4df7f82db8c	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	162.159.122.52	2026-03-16 02:48:13.652
321	/	Home	5cf98ce4a43582fb199a7c87dd58c73a	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	162.158.22.130	2026-03-16 03:04:11.345
322	/	Home	d4a230e1700d6bbcd95e8522d761e27a	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36 (compatible; Google-Read-Aloud; +https://support.google.com/webmasters/answer/1061943)	162.158.106.131	2026-03-16 03:04:12.596
323	/	Home	5d8ac1193043366625c6ae62e94dbe80	https://www.google.com/	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	162.158.106.131	2026-03-16 03:04:18.761
324	/	Home	08d8de77f158602ccae902e4576fd53c	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	172.69.166.116	2026-03-16 04:13:03.296
325	/	Home	d2e3ed9425f5967dfce08c9c51829fc7	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	172.68.164.118	2026-03-16 04:25:17.851
326	/	Home	a68edf0077766e282612f0b6cc3c7915	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	172.69.165.42	2026-03-16 04:30:39.874
327	/	Home	a68edf0077766e282612f0b6cc3c7915	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	172.69.165.42	2026-03-16 04:30:48.587
328	/our-inspiration	Our Inspiration	a68edf0077766e282612f0b6cc3c7915	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	172.69.165.42	2026-03-16 04:31:05.237
329	/	Home	b4e006dd6c5319188001be4a97b6411f	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	172.71.124.225	2026-03-16 04:50:59.269
330	/	Home	1170b0a72c5067af40a85569f33e3e6f	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	172.69.166.117	2026-03-16 04:59:55.196
331	/	Home	1170b0a72c5067af40a85569f33e3e6f	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	172.69.166.117	2026-03-16 05:00:00.616
332	/our-inspiration	Our Inspiration	9828a05f823dfa096cf38987cf27bd76	https://www.takshaka.id/signature-voyage	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	104.22.66.185	2026-03-16 05:33:53.518
333	/	Home	784c93dfac4cd1dcce6976d1846281a1	https://www.takshaka.id/our-inspiration	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	104.22.66.184	2026-03-16 05:33:59.437
334	/	Home	9828a05f823dfa096cf38987cf27bd76	https://www.takshaka.id/our-inspiration	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	104.22.66.185	2026-03-16 05:34:21.768
335	/	Home	6eee0dbb41837c9bd808fc24cd21dd18	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	172.68.164.119	2026-03-16 06:12:07.194
336	/	Home	a8c9ab683e78d2448497b584b8519094	\N	Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.7632.116 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)	172.71.126.150	2026-03-16 07:13:26.137
337	/	Home	a723f6f8309f39b221bfcac7795563c7	\N	Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.7632.116 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)	172.68.22.54	2026-03-16 08:03:16.725
338	/	Home	79006ffb7e38c5d19029c918b4293a5f	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	162.158.88.98	2026-03-16 08:46:28.63
339	/	Home	ba0bfa99263ff48c16fb31d6246e2410	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36 Chrome-Lighthouse	172.68.87.4	2026-03-16 08:46:49.349
340	/	Home	d962b033a49c885dd9366480f481f48a	\N	Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Mobile Safari/537.36 Chrome-Lighthouse	172.68.87.4	2026-03-16 08:46:50.192
341	/	Home	fec7b818c8a7ecc90ab12dd8cdf74bdb	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	172.69.166.116	2026-03-16 09:04:03.352
342	/	Home	e804d343044fbb6934c64f2a0055006c	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	172.69.166.116	2026-03-16 09:04:31.662
343	/	Home	018d10573895f8ef05cb15c18c6fb518	\N	vercel-screenshot/1.0	147.182.228.81	2026-03-16 09:08:43.047
344	/	Home	c8782180a5168f48d1ecdbbb5c58991b	\N	vercel-screenshot/1.0	143.110.235.112	2026-03-16 09:08:43.705
345	/	Home	8964cc737ae4e58c395f64e412636201	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	172.71.124.210	2026-03-16 09:10:27.323
346	/	Home	81d7de3a61c80686bff8f5803ecd9f18	\N	vercel-screenshot/1.0	146.190.52.253	2026-03-16 09:13:46.624
347	/	Home	bb6e2bf5e28c521102352d47bb479f83	\N	vercel-screenshot/1.0	137.184.5.60	2026-03-16 09:13:47.236
348	/	Home	b92810f045f2352b78640bfed9612c27	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	172.69.176.67	2026-03-16 09:17:36.335
349	/	Home	4f151c7e19866c064359155cf9334557	\N	Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.7632.116 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)	172.68.22.55	2026-03-16 16:17:46.296
350	/	Home	4e2614d2b179132ed047c59516e26feb	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	162.158.163.239	2026-03-17 01:18:24.066
351	/prestige-event	Prestige Events	4e2614d2b179132ed047c59516e26feb	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	162.158.163.239	2026-03-17 01:19:05.176
352	/	Home	4e2614d2b179132ed047c59516e26feb	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	162.158.163.239	2026-03-17 01:19:51.649
353	/	Home	4e2614d2b179132ed047c59516e26feb	https://www.takshaka.id/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	162.158.163.239	2026-03-17 01:19:54.545
354	/	Home	102814e54b080cae2520913b2735e9b9	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	172.70.208.34	2026-03-17 01:39:59.144
355	/	Home	11e7ef5f892c589e292e14711459df09	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	172.71.81.68	2026-03-17 01:44:05.879
356	/	Home	11e7ef5f892c589e292e14711459df09	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	172.71.81.68	2026-03-17 01:44:11.401
357	/	Home	11e7ef5f892c589e292e14711459df09	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	172.71.81.68	2026-03-17 01:44:33.862
358	/	Home	f2401f5d38e8131990bbf0dc3dbbfb2d	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	104.23.175.60	2026-03-17 01:45:35.988
359	/	Home	f2401f5d38e8131990bbf0dc3dbbfb2d	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	104.23.175.60	2026-03-17 01:45:47.075
360	/	Home	513e2d155b085d31672ff975fb630dce	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	172.69.176.131	2026-03-17 01:55:43.863
361	/	Home	201b82ec6c852d63810b7dc042d2bcf9	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	172.71.214.155	2026-03-17 01:59:52.158
362	/	Home	c89ca78cdf97b181fc4e4b94e4012cd7	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	172.71.219.90	2026-03-17 02:01:19.921
363	/	Home	1f5f6468d1e895abfa4872c36989135d	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	172.69.89.196	2026-03-17 02:03:06.701
364	/	Home	e17ed8e311849bfe406591ff6c44db5b	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	172.70.143.231	2026-03-17 04:03:37.27
365	/	Home	c58295fc978ad3f4fe4670e921e148dc	https://www.google.com/	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	172.68.105.141	2026-03-17 06:04:30.308
366	/	Home	8fbac8a272ac3a9656cbe88ba34eb452	https://werkudara.com/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	172.69.166.116	2026-03-17 06:20:31.266
367	/	Home	6ff8e303008202468b52471b62164891	https://werkudara.com/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	104.22.66.54	2026-03-17 06:29:04.485
368	/	Home	d3a7c2760e0f983d3b0b18920ce25157	https://www.google.com/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	172.68.229.53	2026-03-17 07:07:52.014
369	/	Home	58bcd82ef16f2c374057df15ecf08575	https://www.google.com/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	172.70.162.103	2026-03-17 07:07:59.239
370	/	Home	82b74f9e2b18a734f29e273b1507a304	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	172.71.190.158	2026-03-17 07:32:23.845
371	/	Home	5664e6088e87f5480b5f1d7f389d76ab	https://www.google.com/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	172.64.192.124	2026-03-17 07:41:46.479
372	/prestige-event	Prestige Events	483218fa81f7ab7b79055106dabfdd71	https://www.google.com/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	172.64.192.125	2026-03-17 07:41:53.413
373	/	Home	9e96f4ccfbc7f98ff7cb302e040a848a	https://www.google.com/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_3_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3.1 Mobile/15E148 Safari/604.1	172.68.105.141	2026-03-17 09:55:51.361
374	/	Home	283942df3005c104ed3ee4bf3bb37702	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	162.158.88.68	2026-03-18 00:55:56.099
375	/	Home	787afbb68f67b54721a411ceecb950ec	https://www.google.com/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_3_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3.1 Mobile/15E148 Safari/604.1	172.68.105.140	2026-03-18 02:11:29
376	/	Home	46e28db03ea19279d16439ec927a5260	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/146.0.0.0 Safari/537.36	162.158.79.231	2026-03-18 06:02:19.539
377	/	Home	440af5032a9035f149e14b1484cfca29	https://l.wl.co/	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	104.23.175.87	2026-03-18 06:38:41.17
378	/	Home	3b20d4ee2dcfc6a3c26e3e74050cdfd2	https://l.wl.co/	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	162.158.22.133	2026-03-18 06:42:00.72
379	/	Home	fab6a6773b628dc2a98beb3689818c83	https://l.wl.co/	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	162.158.107.91	2026-03-18 06:43:18.498
380	/	Home	f5d49a4cc4bfdd75dd6f5c3986f40bb9	https://l.wl.co/	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	162.158.106.131	2026-03-18 06:43:28.06
381	/our-inspiration	Our Inspiration	f5d49a4cc4bfdd75dd6f5c3986f40bb9	https://www.takshaka.id/	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	162.158.106.131	2026-03-18 06:43:32.775
382	/signature-voyage	Signature Voyage	f5d49a4cc4bfdd75dd6f5c3986f40bb9	https://www.takshaka.id/our-inspiration	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	162.158.106.131	2026-03-18 06:44:08.635
383	/	Home	d5cba89d2194941880cc2e0aa7f1a615	https://www.google.com/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36	172.69.165.43	2026-03-18 09:52:43.603
384	/	Home	8d0e1af54c4816a7864505a2d2716e30	https://www.facebook.com/	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	172.71.144.155	2026-03-18 15:06:33.729
385	/	Home	ee496f67ce18480e9fa8cc614a7d9a22	https://www.facebook.com/	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	172.69.65.62	2026-03-18 15:07:35.045
386	/	Home	655a401023e564d11dbe7f8487eb2c02	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	172.68.211.5	2026-03-19 18:16:56.779
387	/	Home	e47457de48b7f8d93747aa5b2d273455	\N	Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.7632.159 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)	198.41.227.13	2026-03-20 05:48:01.709
388	/	Home	87bed94ece8dae84b74118b06f935c5e	https://www.facebook.com/	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/15E148 Safari/604.1	172.68.23.174	2026-03-20 09:23:55.464
389	/	Home	7ca60f51af2a24ed411cbbffe87bc807	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	162.158.155.80	2026-03-20 10:28:59.398
390	/	Home	2ec56d9630f79d6a9974247559c5cb73	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/142.0.0.0 Safari/537.36	104.23.160.122	2026-03-22 03:10:11.051
391	/	Home	cb4c842c1c5432b1cee50ca61086c53d	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	172.69.165.43	2026-03-22 09:34:32.292
392	/	Home	34fc38c66a0bc68d884adb53c00c4b5c	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	172.68.164.118	2026-03-22 09:37:38.942
393	/	Home	34fc38c66a0bc68d884adb53c00c4b5c	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	172.68.164.118	2026-03-22 09:37:43.265
394	/	Home	34fc38c66a0bc68d884adb53c00c4b5c	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	172.68.164.118	2026-03-22 09:37:48.78
395	/prestige-event	Prestige Events	34fc38c66a0bc68d884adb53c00c4b5c	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	172.68.164.118	2026-03-22 09:37:57.099
396	/	Home	794cbb3fece5870d2b3591de16db9556	\N	Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm) Chrome/100.0.4896.127 Safari/537.36	172.71.147.135	2026-03-22 16:27:50.294
397	/	Home	96a777593aeafaae73f8dda8b629b400	https://www.google.com/	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	172.70.108.175	2026-03-23 07:51:45.384
398	/	Home	f757986c6f13b92874ef90668639abe0	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	172.71.124.211	2026-03-23 09:39:36.07
399	/	Home	15393c620492722fe23856879652b3f3	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	162.158.162.143	2026-03-24 04:02:55.848
400	/	Home	752c462d81895ba791196579670e8ebe	https://www.facebook.com/	Dalvik/2.1.0 (Linux; U; Android 14; Quest 2 Build/UP1A.231005.007.A1)	172.69.65.150	2026-03-25 02:04:11.137
\.


--
-- Data for Name: pages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.pages (id, title, slug, content, status, meta_title, meta_description, created_by, created_at, updated_at, deleted_at, scheduled_at, published_at) FROM stdin;
1	About us	about-us	{"blocks":[{"id":"block-1773122917896","columns":1,"content":[{"id":"col-1773122917896-0","type":"text","content":"<p><em><span style=\\"font-size: 20px;\\">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum</span></em></p>"}]}]}	published			1	2026-03-10 06:08:48.447	2026-03-10 06:08:48.447	\N	\N	\N
\.


--
-- Data for Name: settings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.settings (id, key, value, type, description, created_at, updated_at) FROM stdin;
1	site_name	Takshaka Indonesia	string	\N	2026-03-06 07:34:12.086	2026-03-06 07:43:22.491
2	site_description	Our Curated Travel Experience with Meaningful Impact	string	\N	2026-03-06 07:34:12.504	2026-03-06 07:43:22.69
3	site_url	http://localhost:3000/	string	\N	2026-03-06 07:34:12.726	2026-03-06 07:43:22.877
4	admin_email		string	\N	2026-03-06 07:34:12.912	2026-03-06 07:43:23.112
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, name, email, password, role, created_at, deleted_at) FROM stdin;
1	Admin User	admin@example.com	24298b3fd1a769edbf2f1e7019b531cf:2b63269cfe58645e5bc6c4cb37bca5a880124e0c58c865b98ba41d7f6c0d01e2b7b549520d2bd14ecf37a26253d8cfd46c5a56df44c78e2b8f39f153fef230ee	editor	2026-03-04 19:00:22.164	\N
\.


--
-- Data for Name: visitors; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.visitors (id, visitor_id, referer_domain, country, city, user_agent, ip_address, first_visit, last_visit, page_views_count) FROM stdin;
27	5febf67f00cc117b1b2b135827041e4f	\N	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	162.159.102.149	2026-03-12 07:30:54.799	2026-03-12 07:30:54.799	1
28	dd0ceab340d06d90772cbf98ee67f36f	\N	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	162.158.88.120	2026-03-12 07:35:24.928	2026-03-12 07:35:24.928	1
74	d1ba4fc149ee477eb2da3f03afa10c42	werkudara.com	\N	\N	Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.7339.0 Safari/537.36	172.69.176.66	2026-03-13 07:42:51.228	2026-03-13 07:42:51.228	1
73	1f5f6468d1e895abfa4872c36989135d	\N	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	172.69.89.196	2026-03-13 07:39:10.033	2026-03-17 02:03:07.86	2
4	b9f3348b2b4e6c98e046228f2d9b68e0	takshaka-project-fj6we71k9-takshakabaliwebsite-6496s-projects.vercel.app	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	103.171.146.56	2026-03-11 14:02:29.684	2026-03-11 14:02:29.684	1
5	2af78c7389a361b6f8bfaded74b2831f	\N	\N	\N	Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/144.0.7559.95 Mobile/15E148 Safari/604.1	104.22.17.121	2026-03-11 14:24:42.773	2026-03-11 14:24:42.773	1
6	143f5035b2316b60391619283265e65e	\N	\N	\N	Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/144.0.7559.95 Mobile/15E148 Safari/604.1	162.159.104.152	2026-03-11 14:24:42.773	2026-03-11 14:24:42.773	1
7	a49536e036865c053464536e88eb811f	www.google.com	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0	172.69.194.242	2026-03-11 16:21:35.071	2026-03-11 16:21:35.071	1
8	e7a848eff7d785f79db73ab2e77980a7	\N	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36	162.158.38.194	2026-03-11 17:24:02.209	2026-03-11 17:24:02.209	1
9	2a9178240aa698ac67dd2c5ea4988c9b	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.7680.71 Safari/537.36	104.23.160.42	2026-03-11 17:58:05.535	2026-03-11 17:58:05.535	1
10	5223c35fd6c9cec41bfb8390854fffde	\N	\N	\N	Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1	108.162.245.232	2026-03-11 17:58:12.625	2026-03-11 17:58:12.625	1
12	590bbe3676d9b99808de5f97f3d3e060	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	162.158.170.63	2026-03-11 19:07:11.869	2026-03-11 19:07:17.341	2
11	0a1f58a867b8dbed75db578652a0e79c	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	162.158.170.62	2026-03-11 19:07:05.668	2026-03-11 19:07:29.158	3
20	20b7f9b37830dcfa49f33a0cf86265f7	\N	\N	\N	vercel-screenshot/1.0	137.184.12.43	2026-03-12 04:52:05.31	2026-03-12 23:25:51.877	2
3	656c15f17bd7ce7e83a35253c2cb71d0	\N	\N	\N	vercel-screenshot/1.0	137.184.37.40	2026-03-11 14:02:03.974	2026-03-13 02:52:32.896	4
13	703c916427175df8d52db5f6452665ee	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	162.158.190.18	2026-03-11 19:16:21.571	2026-03-11 19:16:25.668	5
15	77fb187d3f15bad35c90a7f0f21b726f	\N	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	104.23.175.146	2026-03-12 01:29:30.724	2026-03-12 01:29:58.125	3
16	1e89ccafd6de8ca01442e70f7f1e853b	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15	104.23.175.132	2026-03-12 02:06:41.045	2026-03-12 02:06:41.045	1
17	8d76ff55ce7b21ace96d1b2beacaac54	www.google.com	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15	104.23.175.146	2026-03-12 02:07:03.646	2026-03-12 02:07:03.646	1
29	82fcd9b928326cea6501d2bc6e45ec12	\N	\N	\N	Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36	162.158.95.141	2026-03-12 08:02:14.762	2026-03-12 08:02:14.762	1
18	158403fc36a9c85f172f7c0f84bc2df9	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.69.176.67	2026-03-12 02:26:35.105	2026-03-12 02:27:19.833	5
30	5c7d7ba30d6b0fae25348a5e6613d8df	\N	\N	\N	vercel-screenshot/1.0	143.198.63.243	2026-03-12 08:44:38.193	2026-03-12 08:44:38.193	1
31	5e261d12c2cca4e1cf0a2c335dee6132	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	104.22.66.54	2026-03-12 08:57:37.541	2026-03-12 08:57:37.541	1
32	258896a5e944ab66e57bd999418b0c71	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	104.22.66.184	2026-03-12 08:57:55.248	2026-03-12 08:57:55.248	1
34	f26b7c7028ada054a4d0308a50e3bd1b	www.takshaka.id	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	104.22.66.184	2026-03-12 09:15:40.866	2026-03-12 09:15:41.634	2
35	eeeff2ff4d225f276d599b69de081eaa	www.takshaka.id	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	172.70.188.68	2026-03-12 09:16:33.737	2026-03-12 09:16:33.737	1
2	2ecea537a54c33ea169f774420db3e64	\N	\N	\N	vercel-screenshot/1.0	146.190.133.82	2026-03-11 14:02:03.053	2026-03-12 09:23:47.551	2
19	8ed7c16d68e5569b61519389ad1b5811	\N	\N	\N	vercel-screenshot/1.0	64.23.178.209	2026-03-12 04:52:05.323	2026-03-12 04:52:05.323	1
21	77703603fe774f95cf5a6f3aa4d563d0	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.69.176.97	2026-03-12 04:52:55.488	2026-03-12 04:52:55.488	1
22	606106c53fc4469b816b1048c5d6ada3	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.69.176.66	2026-03-12 04:53:03.712	2026-03-12 04:53:05.031	2
23	120f8ee4fbd01059045c153ac975b829	\N	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.5938.132 Safari/537.36	172.68.27.95	2026-03-12 05:30:20.997	2026-03-12 05:30:20.997	1
24	3916615f0d86ee8a7c4547a2b4acc878	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.68.164.119	2026-03-12 06:06:15.158	2026-03-12 06:06:15.158	1
25	e7a1e81b715a820ccf9c61635f71a239	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.71.81.47	2026-03-12 06:13:53.262	2026-03-12 06:13:54.599	2
26	5cecfcbda5f2e1ba94edf1c5dcbfbff9	\N	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	172.71.124.224	2026-03-12 07:10:21.597	2026-03-12 07:11:26.306	7
48	4339b8c1f32ff9d0bfa80529007d8a62	\N	\N	\N	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.7.3 Mobile/15E148 Safari/604.1	172.69.166.117	2026-03-12 10:05:08.477	2026-03-12 10:05:09.858	2
36	d21202af1b1aa8f74c5d8f907832acbb	www.takshaka.id	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	172.71.124.225	2026-03-12 09:19:21.895	2026-03-12 09:19:21.895	1
37	dc8297ced045cba803aecc186ae2273e	www.takshaka.id	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	162.158.88.120	2026-03-12 09:19:27.748	2026-03-12 09:19:27.748	1
38	a2d288b2eddaa7773355618da8ec1327	\N	\N	\N	vercel-screenshot/1.0	143.110.147.18	2026-03-12 09:23:48.24	2026-03-12 09:23:48.24	1
49	fcb7b9007c2d91649ed142f3a76816e6	\N	\N	\N	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.7.3 Mobile/15E148 Safari/604.1	172.71.214.95	2026-03-12 12:46:12.23	2026-03-12 12:46:12.23	1
39	9f12d59870d8e4f628ba09adee695550	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.70.189.97	2026-03-12 09:24:50.968	2026-03-12 09:24:55.396	2
33	65af2fd5fa856771509ddf0798f74de7	www.takshaka.id	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	104.23.175.147	2026-03-12 08:59:33.193	2026-03-12 09:41:05.518	3
40	e3865ed28c9598b42e26b189dda43ec0	www.takshaka.id	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	172.68.164.119	2026-03-12 09:42:40.411	2026-03-12 09:42:40.411	1
41	29d5a21600fb713055fd320b1119edc1	\N	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	172.70.248.41	2026-03-12 09:46:21.697	2026-03-12 09:46:21.697	1
42	2090bd6d1b1e943eab5fa1ca1e3b4e76	\N	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	172.71.148.122	2026-03-12 09:46:29.873	2026-03-12 09:46:29.873	1
75	fe8a63d32d56fba87bea10763ae48f21	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	162.158.170.123	2026-03-13 08:49:16.831	2026-03-13 08:49:16.831	1
50	182469a7505c0260f1e1f09caf40755b	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	104.23.175.132	2026-03-12 14:07:13.385	2026-03-12 14:07:13.803	2
90	6bfe28737bfedeca6c939862c69f28b8	\N	\N	\N	vercel-screenshot/1.0	64.23.148.34	2026-03-15 19:46:59.667	2026-03-15 19:46:59.667	1
52	015b75bd46b704e798c19d67e202ef1a	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	104.23.175.207	2026-03-12 14:10:11.601	2026-03-12 14:10:11.601	1
43	9066042fc90b0b1658cf09f1ae0004e2	\N	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	172.70.208.24	2026-03-12 09:55:06.459	2026-03-12 09:56:37.636	10
44	0dc3d0464a39e72fe843ec9b1a9aa843	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	172.69.165.42	2026-03-12 09:57:15.938	2026-03-12 09:57:15.938	1
45	b498251159d50f20c65b209251f0f2dc	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	172.71.124.225	2026-03-12 09:57:28.719	2026-03-12 09:57:28.719	1
51	8031e83149b030dc445a606263627699	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	104.23.175.146	2026-03-12 14:07:15.081	2026-03-12 14:11:12.557	7
53	b0f782072b6f243232f3098b75c3a3fb	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	104.23.175.147	2026-03-12 14:11:09.19	2026-03-12 14:11:19.019	2
46	b0e709518d972e70890db9ad626b2fda	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.69.165.42	2026-03-12 09:57:48.402	2026-03-12 10:00:18.683	5
54	2d8fc9b5725e30f7a3ca1ac3712c86bd	\N	\N	\N	vercel-screenshot/1.0	165.232.154.185	2026-03-12 23:25:51.389	2026-03-12 23:25:51.389	1
55	f59427535db2a7f3b51594ad148dc89e	\N	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	104.23.175.146	2026-03-13 00:48:51.102	2026-03-13 00:48:51.102	1
56	c276fba0efc452afea59187df83d1b7f	www.takshaka.id	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	172.71.81.48	2026-03-13 00:49:37.474	2026-03-13 00:49:37.474	1
57	b328e658ca5fe4c2f817c9b0efd25352	www.takshaka.id	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	172.70.93.16	2026-03-13 00:50:12.741	2026-03-13 00:50:37.195	2
58	17c181dd0b48a2659e78be14a7bd8429	www.takshaka.id	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	172.70.93.16	2026-03-13 00:50:44.063	2026-03-13 00:50:44.063	1
59	083d490a4d2636ec046fb8c27bbf26ca	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	162.158.189.89	2026-03-13 02:01:26.8	2026-03-13 02:01:26.8	1
60	65348e3778ac5392c0cf5d9e3838c336	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	162.158.190.18	2026-03-13 02:36:19.804	2026-03-13 02:36:38.024	4
61	19ed397c5af18eb744d6e2d3839266ff	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	108.162.227.37	2026-03-13 02:38:34.95	2026-03-13 02:38:34.95	1
63	bac9d978a12c3988443c54e3cb57472b	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.71.124.224	2026-03-13 02:43:39.681	2026-03-13 02:43:39.681	1
62	6eca5866d975f8dd8512dfa04b805286	\N	\N	\N	vercel-screenshot/1.0	137.184.85.43	2026-03-13 02:40:05.06	2026-03-13 02:52:32.869	2
64	3819f4eaeae1fac71f2a9e54285aedf0	vercel.com	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.71.82.15	2026-03-13 02:53:38.057	2026-03-13 02:53:38.057	1
65	565b2d351206e4bd41afc6598e271d18	\N	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	104.22.66.185	2026-03-13 03:46:33.779	2026-03-13 03:46:33.779	1
66	e607c3d5ff36bbc7d295f2f94f034ceb	www.google.com	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	172.69.166.116	2026-03-13 04:04:57.81	2026-03-13 04:04:57.81	1
67	cbaf668c4449055da9781ae2eb87e6b5	www.google.com	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	172.70.108.174	2026-03-13 04:27:12.587	2026-03-13 04:27:12.587	1
47	31b18f69ccff315c83acdc705f32ef2c	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	172.69.166.117	2026-03-12 10:01:17.34	2026-03-13 09:20:00.099	7
68	1a40847b4e8c839e060b4aca52a3c1b9	com.google.android.googlequicksearchbox	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	172.68.225.244	2026-03-13 04:53:40.007	2026-03-13 04:53:40.007	1
76	23abb7d1cf69c355c9d102938eefefc4	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 CloudflareObservatory/1.0	172.70.126.51	2026-03-13 09:21:17.068	2026-03-13 09:21:17.068	1
77	8a107145d69951b21c2b7262ce5f1b97	\N	\N	\N	Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36 CloudflareObservatory/1.0	172.70.100.174	2026-03-13 09:21:17.736	2026-03-13 09:21:17.736	1
78	3d96d8ad70407f6a7785fbedc1809c58	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 CloudflareObservatory/1.0	172.70.126.62	2026-03-13 09:21:29.204	2026-03-13 09:21:41.253	2
79	84b3530cdfead7a49a25b83b832ff6f5	\N	\N	\N	Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36 CloudflareObservatory/1.0	108.162.216.161	2026-03-13 09:21:30.3	2026-03-13 09:21:43.178	2
82	21791504bace87e7d3019dfc5dc897a4	\N	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/138.0.7204.23 Safari/537.36	104.23.209.211	2026-03-13 10:34:54.151	2026-03-13 10:34:54.151	1
83	8ac721ccfc4268b78e2c37f4e045f8c8	www.takshaka.id	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	172.71.124.225	2026-03-13 11:11:22.364	2026-03-13 11:11:22.364	1
69	cea2533e1f1f23a6fb078f8991408881	www.google.com	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	162.159.122.52	2026-03-13 06:35:31.144	2026-03-13 07:26:58.042	3
70	e11dd9b2181c63eb80674fd2b8de19e9	www.takshaka.id	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	172.68.164.118	2026-03-13 07:27:31.51	2026-03-13 07:27:31.51	1
72	70580e2cf44ddba75a7c97d102688bd3	www.takshaka.id	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	162.158.107.92	2026-03-13 07:28:04.561	2026-03-13 07:28:04.561	1
14	533bdee2c407d966a6d5269167173d29	\N	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	104.23.175.147	2026-03-12 01:29:03.031	2026-03-13 17:31:29.031	8
84	1c27679d8e0c88239e521ca76441a747	\N	\N	\N	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	::1	2026-03-13 19:19:10.502	2026-03-13 19:57:12.137	5
1	3f0dc78b8eefd550ca7ff88caf8b7873	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	::1	2026-03-10 22:18:21.018	2026-03-13 20:05:27.076	114
85	ca885af68595368e3a126e0909443807	\N	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/138.0.7204.23 Safari/537.36	172.68.138.130	2026-03-14 10:43:31.683	2026-03-14 10:43:31.683	1
86	ea72ff528a411259391f302e8a728355	\N	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/138.0.7204.23 Safari/537.36	104.23.211.30	2026-03-14 10:55:41.365	2026-03-14 10:55:41.365	1
87	8867103f5e717dc2411495c403f0b985	\N	\N	\N	Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm) Chrome/100.0.4896.127 Safari/537.36	172.68.22.54	2026-03-14 15:33:28.911	2026-03-14 15:33:28.911	1
88	1c27126aa052441be3c7ccfe9409c361	www.takshaka.id	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	162.158.88.120	2026-03-15 03:23:06.142	2026-03-15 03:23:06.142	1
89	558c601b04f2c31d782b485de55e5a3a	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	162.158.88.120	2026-03-15 19:36:52.37	2026-03-15 19:37:09.549	2
91	cc92b10808f3e87ad636a358d9bf73a5	\N	\N	\N	vercel-screenshot/1.0	164.92.121.12	2026-03-15 19:47:00.227	2026-03-15 19:47:00.227	1
92	dc53b554eaaeef2695d2efb89b6e0c84	vercel.com	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	162.158.108.67	2026-03-15 19:50:52.99	2026-03-15 19:51:13.599	2
93	239f15a1cb4cfb26caeeaafb78a7b3fb	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	172.70.188.79	2026-03-15 19:51:38.397	2026-03-15 19:51:38.397	1
94	652c3c03d939c945e357c8480118b7dc	\N	\N	\N	vercel-screenshot/1.0	143.198.135.87	2026-03-15 19:52:26.935	2026-03-15 19:52:26.935	1
95	375e1decf914184ca4838dad075a1c32	\N	\N	\N	vercel-screenshot/1.0	24.199.119.30	2026-03-15 19:52:26.999	2026-03-15 19:52:26.999	1
96	dd951ceb5cf0d2e01c30df0775c13215	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	162.158.108.98	2026-03-16 01:55:36.868	2026-03-16 01:55:36.868	1
97	69755ecddbf52f6b5164d222bc326d52	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	162.158.108.66	2026-03-16 01:56:18.415	2026-03-16 01:56:18.415	1
98	391d0dd4e025bb7d59194eeaddc47a7e	www.takshaka.id	\N	\N	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	162.158.108.66	2026-03-16 02:01:14.837	2026-03-16 02:01:14.837	1
99	e3de6868c8366131bb602ebc77c96525	\N	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	172.71.81.47	2026-03-16 02:33:45.486	2026-03-16 02:34:40.588	4
100	591d94969b7a7f0150ce30cf3442dadc	com.google.android.googlequicksearchbox	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	172.70.208.24	2026-03-16 02:40:07.067	2026-03-16 02:40:07.067	1
81	ba0bfa99263ff48c16fb31d6246e2410	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36 Chrome-Lighthouse	172.68.87.4	2026-03-13 09:21:41.116	2026-03-16 08:46:49.726	2
80	d962b033a49c885dd9366480f481f48a	\N	\N	\N	Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Mobile Safari/537.36 Chrome-Lighthouse	172.68.87.4	2026-03-13 09:21:40.304	2026-03-16 08:46:51.338	2
71	f5d49a4cc4bfdd75dd6f5c3986f40bb9	www.takshaka.id	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	162.158.106.131	2026-03-13 07:27:40.709	2026-03-18 06:44:09.875	8
101	8c5872e1391b6d8d4ebcb065e8c47524	\N	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	108.162.227.53	2026-03-16 02:44:43.336	2026-03-16 02:44:43.336	1
102	bfc28c00168a04126fb3f4df7f82db8c	\N	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	162.159.122.52	2026-03-16 02:46:53.994	2026-03-16 02:48:14.026	7
103	5cf98ce4a43582fb199a7c87dd58c73a	\N	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	162.158.22.130	2026-03-16 03:04:12.523	2026-03-16 03:04:12.523	1
104	d4a230e1700d6bbcd95e8522d761e27a	\N	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36 (compatible; Google-Read-Aloud; +https://support.google.com/webmasters/answer/1061943)	162.158.106.131	2026-03-16 03:04:13.726	2026-03-16 03:04:13.726	1
105	5d8ac1193043366625c6ae62e94dbe80	www.google.com	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	162.158.106.131	2026-03-16 03:04:19.136	2026-03-16 03:04:19.136	1
106	08d8de77f158602ccae902e4576fd53c	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	172.69.166.116	2026-03-16 04:13:04.478	2026-03-16 04:13:04.478	1
107	d2e3ed9425f5967dfce08c9c51829fc7	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	172.68.164.118	2026-03-16 04:25:19.008	2026-03-16 04:25:19.008	1
108	a68edf0077766e282612f0b6cc3c7915	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	172.69.165.42	2026-03-16 04:30:41.029	2026-03-16 04:31:05.614	3
109	b4e006dd6c5319188001be4a97b6411f	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	172.71.124.225	2026-03-16 04:51:00.439	2026-03-16 04:51:00.439	1
110	1170b0a72c5067af40a85569f33e3e6f	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	172.69.166.117	2026-03-16 04:59:56.362	2026-03-16 05:00:00.992	2
112	784c93dfac4cd1dcce6976d1846281a1	www.takshaka.id	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	104.22.66.184	2026-03-16 05:33:59.812	2026-03-16 05:33:59.812	1
111	9828a05f823dfa096cf38987cf27bd76	www.takshaka.id	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	104.22.66.185	2026-03-16 05:33:54.733	2026-03-16 05:34:22.142	2
113	6eee0dbb41837c9bd808fc24cd21dd18	\N	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	172.68.164.119	2026-03-16 06:12:08.369	2026-03-16 06:12:08.369	1
114	a8c9ab683e78d2448497b584b8519094	\N	\N	\N	Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.7632.116 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)	172.71.126.150	2026-03-16 07:13:27.314	2026-03-16 07:13:27.314	1
115	a723f6f8309f39b221bfcac7795563c7	\N	\N	\N	Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.7632.116 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)	172.68.22.54	2026-03-16 08:03:17.883	2026-03-16 08:03:17.883	1
116	79006ffb7e38c5d19029c918b4293a5f	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	162.158.88.98	2026-03-16 08:46:29.811	2026-03-16 08:46:29.811	1
117	fec7b818c8a7ecc90ab12dd8cdf74bdb	\N	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	172.69.166.116	2026-03-16 09:04:04.507	2026-03-16 09:04:04.507	1
118	e804d343044fbb6934c64f2a0055006c	\N	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	172.69.166.116	2026-03-16 09:04:32.038	2026-03-16 09:04:32.038	1
119	018d10573895f8ef05cb15c18c6fb518	\N	\N	\N	vercel-screenshot/1.0	147.182.228.81	2026-03-16 09:08:44.2	2026-03-16 09:08:44.2	1
120	c8782180a5168f48d1ecdbbb5c58991b	\N	\N	\N	vercel-screenshot/1.0	143.110.235.112	2026-03-16 09:08:44.978	2026-03-16 09:08:44.978	1
121	8964cc737ae4e58c395f64e412636201	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	172.71.124.210	2026-03-16 09:10:28.489	2026-03-16 09:10:28.489	1
122	81d7de3a61c80686bff8f5803ecd9f18	\N	\N	\N	vercel-screenshot/1.0	146.190.52.253	2026-03-16 09:13:47.883	2026-03-16 09:13:47.883	1
123	bb6e2bf5e28c521102352d47bb479f83	\N	\N	\N	vercel-screenshot/1.0	137.184.5.60	2026-03-16 09:13:48.389	2026-03-16 09:13:48.389	1
124	b92810f045f2352b78640bfed9612c27	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	172.69.176.67	2026-03-16 09:17:37.575	2026-03-16 09:17:37.575	1
152	655a401023e564d11dbe7f8487eb2c02	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	172.68.211.5	2026-03-19 18:16:57.943	2026-03-19 18:16:57.943	1
125	4f151c7e19866c064359155cf9334557	\N	\N	\N	Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.7632.116 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)	172.68.22.55	2026-03-16 16:17:47.458	2026-03-16 16:17:47.458	1
126	4e2614d2b179132ed047c59516e26feb	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	162.158.163.239	2026-03-17 01:18:25.231	2026-03-17 01:19:54.946	4
127	102814e54b080cae2520913b2735e9b9	\N	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	172.70.208.34	2026-03-17 01:40:00.303	2026-03-17 01:40:00.303	1
128	11e7ef5f892c589e292e14711459df09	\N	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	172.71.81.68	2026-03-17 01:44:07.056	2026-03-17 01:44:34.238	3
129	f2401f5d38e8131990bbf0dc3dbbfb2d	\N	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	104.23.175.60	2026-03-17 01:45:37.117	2026-03-17 01:45:47.449	2
130	513e2d155b085d31672ff975fb630dce	\N	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	172.69.176.131	2026-03-17 01:55:45.027	2026-03-17 01:55:45.027	1
131	201b82ec6c852d63810b7dc042d2bcf9	\N	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	172.71.214.155	2026-03-17 01:59:53.306	2026-03-17 01:59:53.306	1
132	c89ca78cdf97b181fc4e4b94e4012cd7	\N	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	172.71.219.90	2026-03-17 02:01:21.081	2026-03-17 02:01:21.081	1
133	e17ed8e311849bfe406591ff6c44db5b	\N	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36	172.70.143.231	2026-03-17 04:03:38.542	2026-03-17 04:03:38.542	1
134	c58295fc978ad3f4fe4670e921e148dc	www.google.com	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	172.68.105.141	2026-03-17 06:04:31.61	2026-03-17 06:04:31.61	1
135	8fbac8a272ac3a9656cbe88ba34eb452	werkudara.com	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	172.69.166.116	2026-03-17 06:20:32.437	2026-03-17 06:20:32.437	1
136	6ff8e303008202468b52471b62164891	werkudara.com	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	104.22.66.54	2026-03-17 06:29:05.645	2026-03-17 06:29:05.645	1
137	d3a7c2760e0f983d3b0b18920ce25157	www.google.com	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	172.68.229.53	2026-03-17 07:07:53.269	2026-03-17 07:07:53.269	1
138	58bcd82ef16f2c374057df15ecf08575	www.google.com	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	172.70.162.103	2026-03-17 07:07:59.644	2026-03-17 07:07:59.644	1
139	82b74f9e2b18a734f29e273b1507a304	\N	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	172.71.190.158	2026-03-17 07:32:25.019	2026-03-17 07:32:25.019	1
140	5664e6088e87f5480b5f1d7f389d76ab	www.google.com	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	172.64.192.124	2026-03-17 07:41:47.662	2026-03-17 07:41:47.662	1
141	483218fa81f7ab7b79055106dabfdd71	www.google.com	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	172.64.192.125	2026-03-17 07:41:53.792	2026-03-17 07:41:53.792	1
142	9e96f4ccfbc7f98ff7cb302e040a848a	www.google.com	\N	\N	Mozilla/5.0 (iPhone; CPU iPhone OS 18_3_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3.1 Mobile/15E148 Safari/604.1	172.68.105.141	2026-03-17 09:55:52.606	2026-03-17 09:55:52.606	1
143	283942df3005c104ed3ee4bf3bb37702	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	162.158.88.68	2026-03-18 00:55:57.268	2026-03-18 00:55:57.268	1
144	787afbb68f67b54721a411ceecb950ec	www.google.com	\N	\N	Mozilla/5.0 (iPhone; CPU iPhone OS 18_3_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3.1 Mobile/15E148 Safari/604.1	172.68.105.140	2026-03-18 02:11:30.239	2026-03-18 02:11:30.239	1
145	46e28db03ea19279d16439ec927a5260	\N	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/146.0.0.0 Safari/537.36	162.158.79.231	2026-03-18 06:02:20.728	2026-03-18 06:02:20.728	1
146	440af5032a9035f149e14b1484cfca29	l.wl.co	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	104.23.175.87	2026-03-18 06:38:42.516	2026-03-18 06:38:42.516	1
147	3b20d4ee2dcfc6a3c26e3e74050cdfd2	l.wl.co	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	162.158.22.133	2026-03-18 06:42:01.953	2026-03-18 06:42:01.953	1
148	fab6a6773b628dc2a98beb3689818c83	l.wl.co	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	162.158.107.91	2026-03-18 06:43:19.804	2026-03-18 06:43:19.804	1
149	d5cba89d2194941880cc2e0aa7f1a615	www.google.com	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36	172.69.165.43	2026-03-18 09:52:44.891	2026-03-18 09:52:44.891	1
150	8d0e1af54c4816a7864505a2d2716e30	www.facebook.com	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	172.71.144.155	2026-03-18 15:06:34.896	2026-03-18 15:06:34.896	1
151	ee496f67ce18480e9fa8cc614a7d9a22	www.facebook.com	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	172.69.65.62	2026-03-18 15:07:36.215	2026-03-18 15:07:36.215	1
153	e47457de48b7f8d93747aa5b2d273455	\N	\N	\N	Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.7632.159 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)	198.41.227.13	2026-03-20 05:48:02.988	2026-03-20 05:48:02.988	1
154	87bed94ece8dae84b74118b06f935c5e	www.facebook.com	\N	\N	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/15E148 Safari/604.1	172.68.23.174	2026-03-20 09:23:56.768	2026-03-20 09:23:56.768	1
155	7ca60f51af2a24ed411cbbffe87bc807	\N	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	162.158.155.80	2026-03-20 10:29:00.75	2026-03-20 10:29:00.75	1
156	2ec56d9630f79d6a9974247559c5cb73	\N	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/142.0.0.0 Safari/537.36	104.23.160.122	2026-03-22 03:10:12.215	2026-03-22 03:10:12.215	1
157	cb4c842c1c5432b1cee50ca61086c53d	\N	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	172.69.165.43	2026-03-22 09:34:33.541	2026-03-22 09:34:33.541	1
158	34fc38c66a0bc68d884adb53c00c4b5c	\N	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	172.68.164.118	2026-03-22 09:37:40.19	2026-03-22 09:37:57.507	4
159	794cbb3fece5870d2b3591de16db9556	\N	\N	\N	Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm) Chrome/100.0.4896.127 Safari/537.36	172.71.147.135	2026-03-22 16:27:51.475	2026-03-22 16:27:51.475	1
160	96a777593aeafaae73f8dda8b629b400	www.google.com	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	172.70.108.175	2026-03-23 07:51:46.55	2026-03-23 07:51:46.55	1
161	f757986c6f13b92874ef90668639abe0	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	172.71.124.211	2026-03-23 09:39:37.369	2026-03-23 09:39:37.369	1
162	15393c620492722fe23856879652b3f3	\N	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	162.158.162.143	2026-03-24 04:02:57.054	2026-03-24 04:02:57.054	1
163	752c462d81895ba791196579670e8ebe	www.facebook.com	\N	\N	Dalvik/2.1.0 (Linux; U; Android 14; Quest 2 Build/UP1A.231005.007.A1)	172.69.65.150	2026-03-25 02:04:12.312	2026-03-25 02:04:12.312	1
\.


--
-- Name: analytics_daily_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.analytics_daily_id_seq', 1, false);


--
-- Name: audit_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.audit_logs_id_seq', 1, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.categories_id_seq', 6, true);


--
-- Name: comment_replies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.comment_replies_id_seq', 1, false);


--
-- Name: comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.comments_id_seq', 1, true);


--
-- Name: contact_submissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.contact_submissions_id_seq', 1, true);


--
-- Name: contents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.contents_id_seq', 26, true);


--
-- Name: faqs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.faqs_id_seq', 2, true);


--
-- Name: gallery_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.gallery_categories_id_seq', 4, true);


--
-- Name: gallery_of_works_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.gallery_of_works_id_seq', 4, true);


--
-- Name: login_attempts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.login_attempts_id_seq', 46, true);


--
-- Name: login_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.login_logs_id_seq', 5, true);


--
-- Name: media_gallery_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.media_gallery_id_seq', 46, true);


--
-- Name: navigation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.navigation_id_seq', 12, true);


--
-- Name: page_sections_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.page_sections_id_seq', 6, true);


--
-- Name: page_views_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.page_views_id_seq', 400, true);


--
-- Name: pages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.pages_id_seq', 1, true);


--
-- Name: settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.settings_id_seq', 4, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- Name: visitors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.visitors_id_seq', 163, true);


--
-- Name: analytics_daily analytics_daily_date_page_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analytics_daily
    ADD CONSTRAINT analytics_daily_date_page_slug_key UNIQUE (date, page_slug);


--
-- Name: analytics_daily analytics_daily_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analytics_daily
    ADD CONSTRAINT analytics_daily_pkey PRIMARY KEY (id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: comment_replies comment_replies_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comment_replies
    ADD CONSTRAINT comment_replies_pkey PRIMARY KEY (id);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: contact_submissions contact_submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_submissions
    ADD CONSTRAINT contact_submissions_pkey PRIMARY KEY (id);


--
-- Name: contents contents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contents
    ADD CONSTRAINT contents_pkey PRIMARY KEY (id);


--
-- Name: faqs faqs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faqs
    ADD CONSTRAINT faqs_pkey PRIMARY KEY (id);


--
-- Name: gallery_categories gallery_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gallery_categories
    ADD CONSTRAINT gallery_categories_pkey PRIMARY KEY (id);


--
-- Name: gallery_categories gallery_categories_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gallery_categories
    ADD CONSTRAINT gallery_categories_slug_key UNIQUE (slug);


--
-- Name: gallery_of_works gallery_of_works_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gallery_of_works
    ADD CONSTRAINT gallery_of_works_pkey PRIMARY KEY (id);


--
-- Name: login_attempts login_attempts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.login_attempts
    ADD CONSTRAINT login_attempts_pkey PRIMARY KEY (id);


--
-- Name: login_logs login_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.login_logs
    ADD CONSTRAINT login_logs_pkey PRIMARY KEY (id);


--
-- Name: media_gallery media_gallery_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media_gallery
    ADD CONSTRAINT media_gallery_pkey PRIMARY KEY (id);


--
-- Name: navigation navigation_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.navigation
    ADD CONSTRAINT navigation_pkey PRIMARY KEY (id);


--
-- Name: page_sections page_sections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.page_sections
    ADD CONSTRAINT page_sections_pkey PRIMARY KEY (id);


--
-- Name: page_views page_views_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.page_views
    ADD CONSTRAINT page_views_pkey PRIMARY KEY (id);


--
-- Name: pages pages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages
    ADD CONSTRAINT pages_pkey PRIMARY KEY (id);


--
-- Name: settings settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: visitors visitors_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visitors
    ADD CONSTRAINT visitors_pkey PRIMARY KEY (id);


--
-- Name: visitors visitors_visitor_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visitors
    ADD CONSTRAINT visitors_visitor_id_key UNIQUE (visitor_id);


--
-- Name: categories_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX categories_slug_idx ON public.categories USING btree (slug) WHERE (deleted_at IS NULL);


--
-- Name: contents_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX contents_slug_idx ON public.contents USING btree (slug) WHERE (deleted_at IS NULL);


--
-- Name: idx_analytics_daily_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_analytics_daily_date ON public.analytics_daily USING btree (date);


--
-- Name: idx_analytics_daily_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_analytics_daily_slug ON public.analytics_daily USING btree (page_slug);


--
-- Name: idx_audit_logs_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_logs_created_at ON public.audit_logs USING btree (created_at);


--
-- Name: idx_audit_logs_entity; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_logs_entity ON public.audit_logs USING btree (entity_type, entity_id);


--
-- Name: idx_audit_logs_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_logs_user_id ON public.audit_logs USING btree (user_id);


--
-- Name: idx_gallery_cat_deleted; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_gallery_cat_deleted ON public.gallery_categories USING btree (deleted_at);


--
-- Name: idx_gallery_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_gallery_category ON public.gallery_of_works USING btree (category_id);


--
-- Name: idx_gallery_deleted; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_gallery_deleted ON public.gallery_of_works USING btree (deleted_at);


--
-- Name: idx_gallery_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_gallery_order ON public.gallery_of_works USING btree (display_order);


--
-- Name: idx_login_attempts_identifier_time; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_login_attempts_identifier_time ON public.login_attempts USING btree (identifier, attempted_at DESC);


--
-- Name: idx_login_logs_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_login_logs_created_at ON public.login_logs USING btree (created_at);


--
-- Name: idx_login_logs_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_login_logs_user_id ON public.login_logs USING btree (user_id);


--
-- Name: idx_page_views_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_page_views_created_at ON public.page_views USING btree (created_at);


--
-- Name: idx_page_views_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_page_views_slug ON public.page_views USING btree (page_slug);


--
-- Name: idx_page_views_visitor; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_page_views_visitor ON public.page_views USING btree (visitor_id);


--
-- Name: idx_visitors_first_visit; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_visitors_first_visit ON public.visitors USING btree (first_visit);


--
-- Name: idx_visitors_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_visitors_id ON public.visitors USING btree (visitor_id);


--
-- Name: idx_visitors_last_visit; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_visitors_last_visit ON public.visitors USING btree (last_visit);


--
-- Name: page_sections_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX page_sections_slug_idx ON public.page_sections USING btree (page_slug) WHERE (deleted_at IS NULL);


--
-- Name: pages_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX pages_slug_idx ON public.pages USING btree (slug) WHERE (deleted_at IS NULL);


--
-- Name: settings_key_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX settings_key_idx ON public.settings USING btree (key);


--
-- Name: users_email_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_email_idx ON public.users USING btree (email);


--
-- Name: login_logs fk_login_logs_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.login_logs
    ADD CONSTRAINT fk_login_logs_user_id FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: gallery_of_works gallery_of_works_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gallery_of_works
    ADD CONSTRAINT gallery_of_works_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.gallery_categories(id);


--
-- Name: login_attempts Service role can manage login attempts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role can manage login attempts" ON public.login_attempts USING ((auth.role() = 'service_role'::text)) WITH CHECK ((auth.role() = 'service_role'::text));


--
-- Name: analytics_daily; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.analytics_daily ENABLE ROW LEVEL SECURITY;

--
-- Name: login_attempts; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.login_attempts ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--

\unrestrict eZvHtEudGT3WwYJyNfe2cFI4oWGqmeEL34McwzzcRINyl19Emtelry8mGF4qUEe

