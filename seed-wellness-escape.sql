-- Seed data for Wellness Escape page sections

INSERT INTO page_sections (page_name, page_slug, page_data, created_by, created_at, updated_at)
VALUES (
  'Wellness Escape',
  'wellness-escape',
  '{
    "hero": {
      "contents": [
        {
          "title": "WELLNESS ESCAPE",
          "description": "Reconnect with yourself through transformative wellness experiences",
          "background": "https://images.unsplash.com/photo-1544367567-0d6fcffe11b6?w=1920&q=80"
        }
      ]
    },
    "introSection": {
      "title": "MIND BODY & SOUL",
      "description": "Wellness retreat designed for those seeking rejuvenation and mindful transformation. Our curated wellness experiences blend ancient wisdom with modern wellness practices, creating sanctuary moments that nourish your body, calm your mind, and elevate your spirit.\n\nEach wellness escape is thoughtfully designed to provide a complete reset - from restorative yoga and meditation sessions, to holistic spa treatments, healthy cuisine, and transformative wellness programs. Reconnect with yourself in serene natural settings across Indonesia''s most peaceful destinations.",
      "image": "https://images.unsplash.com/photo-1545389336-cf090694cb59?w=800&q=80"
    },
    "topDestinations": {
      "title": "WELLNESS RETREATS",
      "subtitle": "Discover our carefully curated wellness escape destinations, each offering unique healing and rejuvenation experiences.",
      "selectedCategoryIds": [2, 3, 5, 4, 6],
      "destinations": [
        {
          "title": "BALI RETREAT",
          "subtitle": "Spiritual healing in the heart of Balinese culture",
          "description": "Experience authentic Balinese wellness traditions in a serene yoga and meditation retreat setting surrounded by rice terraces and ancient temples.",
          "image": "https://images.unsplash.com/photo-1544367567-0d6fcffe11b6?w=600&q=80"
        },
        {
          "title": "LOMBOK SANCTUARY",
          "subtitle": "Coastal wellness retreat with pristine beach healing energy",
          "description": "Rejuvenate at our beachfront wellness sanctuary offering ocean-inspired treatments, sunset yoga, and holistic healing practices.",
          "image": "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=600&q=80"
        },
        {
          "title": "MOUNTAIN RETREAT",
          "subtitle": "Forest immersion wellness program in natural harmony",
          "description": "Escape to the mountains for forest bathing, breathwork sessions, and grounding wellness practices surrounded by nature''s healing energy.",
          "image": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80"
        },
        {
          "title": "HOT SPRING SPA",
          "subtitle": "Thermal wellness experience with natural mineral treatments",
          "description": "Immerse yourself in geothermal spa experiences blended with traditional healing therapies and holistic wellness programs.",
          "image": "https://images.unsplash.com/photo-1544161515-81efb1cb29da?w=600&q=80"
        },
        {
          "title": "SILENT RETREAT",
          "subtitle": "Silent meditation retreat for deep inner peace",
          "description": "Join our transformative silent retreat focused on meditation, introspection, and finding clarity through mindful stillness.",
          "image": "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=600&q=80"
        },
        {
          "title": "JUNGLE WELLNESS",
          "subtitle": "Immersive jungle retreat with nature-based healing",
          "description": "Deep dive into nature with jungle trekking, plant-based healing, and wilderness wellness therapies in pristine natural settings.",
          "image": "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=600&q=80"
        },
        {
          "title": "DETOX RETREAT",
          "subtitle": "Complete wellness reset through holistic detoxification",
          "description": "Comprehensive detox program combining clean cuisine, wellness treatments, and rejuvenation therapies for complete renewal.",
          "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80"
        },
        {
          "title": "WOMEN WELLNESS",
          "subtitle": "Feminine wellness retreat honoring women''s health journey",
          "description": "Specialized wellness program designed for women, focusing on hormonal balance, self-care, and feminine energy cultivation.",
          "image": "https://images.unsplash.com/photo-1544238527-2ae42998b5ad?w=600&q=80"
        }
      ]
    },
    "exclusiveExperiences": {
      "title": "SIGNATURE WELLNESS EXPERIENCES",
      "experiences": [
        {
          "id": "1",
          "title": "SUNRISE YOGA",
          "description": "Begin your day with guided yoga sessions welcoming the dawn''s healing energy.",
          "image": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80"
        },
        {
          "id": "2",
          "title": "HERBAL TREATMENTS",
          "description": "Traditional herbal spa treatments using Indonesia''s finest wellness botanicals.",
          "image": "https://images.unsplash.com/photo-1544367567-0d6fcffe11b6?w=400&q=80"
        },
        {
          "id": "3",
          "title": "MEDITATION SESSIONS",
          "description": "Deep meditation practices guided by experienced wellness facilitators for inner peace.",
          "image": "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400&q=80"
        },
        {
          "id": "4",
          "title": "WELLNESS CUISINE",
          "description": "Nourishing organic meals designed to support your wellness journey and healing process.",
          "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80"
        },
        {
          "id": "5",
          "title": "SOUND HEALING",
          "description": "Transformative sound bath sessions for deep relaxation and energy balancing.",
          "image": "https://images.unsplash.com/photo-1544238527-2ae42998b5ad?w=400&q=80"
        },
        {
          "id": "6",
          "title": "FOREST BATHING",
          "description": "Mindful nature walks immersed in forest energy for natural healing and grounding.",
          "image": "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&q=80"
        },
        {
          "id": "7",
          "title": "HOLISTIC MASSAGE",
          "description": "Traditional therapeutic massage blending ancient healing techniques with modern wellness.",
          "image": "https://images.unsplash.com/photo-1580281658550-2173dba999ef?w=400&q=80"
        },
        {
          "id": "8",
          "title": "MOON CIRCLE",
          "description": "Evening ceremony celebrating lunar cycles and feminine wellness wisdom.",
          "image": "https://images.unsplash.com/photo-1500628346881-b72b27e84530?w=400&q=80"
        }
      ]
    }
  }',
  1,
  NOW(),
  NOW()
);
