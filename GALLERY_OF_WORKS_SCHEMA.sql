-- Gallery Categories Table (PostgreSQL Syntax)
CREATE TABLE gallery_categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

-- Gallery of Works Table (PostgreSQL Syntax)
CREATE TABLE gallery_of_works (
  id SERIAL PRIMARY KEY,
  category_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  image_url TEXT NOT NULL,
  slug TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_by INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES gallery_categories(id)
);

-- Indexes for better query performance
CREATE INDEX idx_gallery_category ON gallery_of_works(category_id);
CREATE INDEX idx_gallery_deleted ON gallery_of_works(deleted_at);
CREATE INDEX idx_gallery_order ON gallery_of_works(display_order);
CREATE INDEX idx_gallery_cat_deleted ON gallery_categories(deleted_at);
