ALTER TABLE contents ADD COLUMN excerpt TEXT;
ALTER TABLE contents ADD COLUMN status TEXT NOT NULL DEFAULT 'draft';
ALTER TABLE contents ADD COLUMN published_at INTEGER;
ALTER TABLE contents ADD COLUMN canonical_url TEXT;
ALTER TABLE contents ADD COLUMN robots TEXT;
