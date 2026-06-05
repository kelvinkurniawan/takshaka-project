-- Add Portfolio page sections
INSERT INTO page_sections (slug, section_name, content, created_at, updated_at) VALUES
('portfolio', 'hero', '{"contents": [{"title": "Portfolio", "description": "Jelajahi portofolio proyek dan karya terbaik kami", "background": null}]}', NOW(), NOW()),
('portfolio', 'editorPicks', '{"title": "Editor Picks", "description": "Koleksi terpilih dari karya-karya terbaik kami", "items": []}', NOW(), NOW()),
('portfolio', 'articlesList', '{"fixedImage": null, "items": []}', NOW(), NOW())
ON CONFLICT DO NOTHING;
