-- Seed data for Indonesia Journal page sections

INSERT INTO page_sections (page_name, page_slug, page_data, created_by, created_at, updated_at)
VALUES (
  'Indonesia Journal',
  'indonesia-journal',
  '{
    "hero": {
      "title": "INDONESIA JOURNAL",
      "description": "Jelajahi cerita, petualangan, dan inspirasi dari setiap sudut kepulauan tropis Indonesia",
      "background": "https://images.unsplash.com/photo-1537225228614-b4fad34a0b60?w=1920&q=80"
    },
    "editorPicks": {
      "title": "EDITOR PICKS",
      "description": "Pilihan terbaik kami untuk petualangan sempurna Anda",
      "items": [
        {
          "title": "Bali Birds Paradise",
          "excerpt": "Discover the diverse bird species thriving in Bali''s natural habitats",
          "image": "https://images.unsplash.com/photo-1444464666175-1642a9c67b0d?w=600&q=80",
          "category": "Wildlife",
          "date": "1 April 2026",
          "link": "/blog/bali-birds"
        },
        {
          "title": "Bali Birds Paradise",
          "excerpt": "Discover the diverse bird species thriving in Bali''s natural habitats",
          "image": "https://images.unsplash.com/photo-1444464666175-1642a9c67b0d?w=600&q=80",
          "category": "Wildlife",
          "date": "1 April 2026",
          "link": "/blog/bali-birds"
        },
        {
          "title": "Bali Birds Paradise",
          "excerpt": "Discover the diverse bird species thriving in Bali''s natural habitats",
          "image": "https://images.unsplash.com/photo-1444464666175-1642a9c67b0d?w=600&q=80",
          "category": "Wildlife",
          "date": "1 April 2026",
          "link": "/blog/bali-birds"
        }
      ]
    },
    "articlesList": {
      "fixedImage": "https://images.unsplash.com/photo-1501785888041-af3ee9c470a0?w=600&q=80",
      "items": [
        {
          "title": "Spa and Body Care in Bali",
          "excerpt": "Experience traditional Balinese spa treatments and wellness practices that rejuvenate body and soul",
          "category": "Wellness",
          "date": "22 April 2026",
          "link": "/blog/bali-spa"
        },
        {
          "title": "Forest and Nature Adventures",
          "excerpt": "Immerse yourself in Indonesia''s lush forests and discover the wonders of nature",
          "category": "Adventure",
          "date": "20 April 2026",
          "link": "/blog/forest-nature"
        },
        {
          "title": "Cultural Experiences",
          "excerpt": "Dive deep into Indonesia''s rich cultural heritage and traditional practices",
          "category": "Culture",
          "date": "18 April 2026",
          "link": "/blog/cultural-exp"
        }
      ]
    }
  }',
  1,
  NOW(),
  NOW()
);
