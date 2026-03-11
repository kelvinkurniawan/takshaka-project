-- Analytics Tables Setup

-- Table untuk tracking page views
CREATE TABLE IF NOT EXISTS page_views (
  id SERIAL PRIMARY KEY,
  page_slug TEXT NOT NULL,
  page_title TEXT,
  visitor_id TEXT NOT NULL, -- unique identifier untuk visitor
  referrer TEXT,
  user_agent TEXT,
  ip_address TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes untuk page_views
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

-- Create indexes untuk visitors
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

-- Create indexes untuk analytics_daily
CREATE INDEX IF NOT EXISTS idx_analytics_daily_date ON analytics_daily(date);
CREATE INDEX IF NOT EXISTS idx_analytics_daily_slug ON analytics_daily(page_slug);
