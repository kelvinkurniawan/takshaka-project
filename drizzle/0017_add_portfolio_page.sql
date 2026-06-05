-- Add Portfolio page sections
INSERT INTO page_sections (page_name, page_slug, page_data, created_by, created_at, updated_at) VALUES
(
  'Portfolio',
  'portfolio',
  '{"hero": {"contents": [{"title": "Portfolio", "description": "Jelajahi portofolio proyek dan karya terbaik kami", "background": null}]}, "editorPicks": {"title": "Editor Picks", "description": "Koleksi terpilih dari karya-karya terbaik kami", "items": []}, "articlesList": {"fixedImage": null, "items": []}}',
  1,
  NOW(),
  NOW()
)
ON CONFLICT (page_slug) WHERE deleted_at IS NULL DO NOTHING;
