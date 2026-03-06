-- Seed data for page_sections table
-- This file contains the initial homepage section data

-- Insert homepage sections
INSERT INTO page_sections (page_name, page_slug, page_data, created_by, created_at, updated_at)
VALUES (
  'Homepage',
  'home',
  '{
    "hero": {
      "title": "SIGNATURE VOYAGE",
      "subtitle": "Our Curated Travel Experience with Meaningful Impact",
      "background": "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80"
    },
    "threeItemSection": {
      "heading": "Rooted in cultural wisdom, we curate bespoke experiences that are meaningful, transformative, and timeless.",
      "images": [
        {
          "image": "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80",
          "alt": "Impactful Experience",
          "title": "Impactful Experience",
          "description": "Every journey designed with intention, precision, and meaning."
        },
        {
          "image": "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80",
          "alt": "Cultural Wisdom",
          "title": "Cultural Wisdom",
          "description": "Inspired by the depth of cultural wisdom, we design experiences that transcend beauty, harmony, and transformation."
        },
        {
          "image": "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80",
          "alt": "Bespoke Services",
          "title": "Bespoke Services",
          "description": "We curate bespoke experiences, meticulously crafted for each client, transforming vision into moments of lasting meaning."
        }
      ]
    },
    "imagesSection": {
      "images": [
        {
          "src": "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80",
          "alt": "Indonesian cultural heritage"
        },
        {
          "src": "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80",
          "alt": "Indonesian traditions and arts"
        },
        {
          "src": "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80",
          "alt": "Indonesian immersive experiences"
        }
      ],
      "description": "A curated collection of Indonesia''s most inspiring destinations and immersive experiences. From cultural heritage and gastronomy to marine exploration, wildlife, and adventure, each journey is thoughtfully designed to reveal the richness of Indonesia while creating meaningful and memorable moments."
    },
    "curatedExperiences": {
      "tabs": [
        {
          "id": "cultural-heritage",
          "label": "CULTURAL HERITAGE",
          "items": [
            {
              "id": "1",
              "title": "Bali Ancient Culture",
              "description": "An exclusive journey timeless heritage and sacred traditions.",
              "image": "https://images.unsplash.com/photo-1537225228614-b19960110871?w=800&q=80"
            },
            {
              "id": "2",
              "title": "Papua Ancient Culture",
              "description": "An exclusive journey timeless heritage and sacred traditions.",
              "image": "https://images.unsplash.com/photo-1548013146-72d72c85fd0d?w=800&q=80"
            },
            {
              "id": "3",
              "title": "Yogyakarta Ancient Culture",
              "description": "An exclusive journey timeless heritage and sacred traditions.",
              "image": "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80"
            },
            {
              "id": "4",
              "title": "Borneo Ancient Culture",
              "description": "An exclusive journey timeless heritage and sacred traditions.",
              "image": "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80"
            }
          ]
        },
        {
          "id": "gastronomy",
          "label": "GASTRONOMY",
          "items": [
            {
              "id": "5",
              "title": "Java Culinary Journey",
              "description": "Taste authentic flavors and learn traditional cooking methods.",
              "image": "https://images.unsplash.com/photo-1504674900306-873dddd74b1f?w=800&q=80"
            },
            {
              "id": "6",
              "title": "Bali Food Culture",
              "description": "Discover the essence of Balinese culinary traditions.",
              "image": "https://images.unsplash.com/photo-1537225228614-b19960110871?w=800&q=80"
            },
            {
              "id": "7",
              "title": "Sumatra Spices",
              "description": "Explore the aromatic spice routes of Sumatra.",
              "image": "https://images.unsplash.com/photo-1548013146-72d72c85fd0d?w=800&q=80"
            },
            {
              "id": "8",
              "title": "Street Food Adventure",
              "description": "Experience the vibrant street food culture.",
              "image": "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80"
            }
          ]
        },
        {
          "id": "sea-marine",
          "label": "SEA & MARINE",
          "items": [
            {
              "id": "9",
              "title": "Raja Ampat Diving",
              "description": "Dive into the world''s most biodiverse marine ecosystem.",
              "image": "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80"
            },
            {
              "id": "10",
              "title": "Coral Triangle",
              "description": "Explore the heart of marine biodiversity.",
              "image": "https://images.unsplash.com/photo-1504674900306-873dddd74b1f?w=800&q=80"
            },
            {
              "id": "11",
              "title": "Island Hopping",
              "description": "Discover pristine islands and hidden beaches.",
              "image": "https://images.unsplash.com/photo-1537225228614-b19960110871?w=800&q=80"
            },
            {
              "id": "12",
              "title": "Underwater Photography",
              "description": "Capture the beauty of Indonesia''s marine life.",
              "image": "https://images.unsplash.com/photo-1548013146-72d72c85fd0d?w=800&q=80"
            }
          ]
        },
        {
          "id": "wildlife",
          "label": "WILDLIFE",
          "items": [
            {
              "id": "13",
              "title": "Komodo Dragons",
              "description": "Get close with the world''s largest living lizards.",
              "image": "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80"
            },
            {
              "id": "14",
              "title": "Orangutan Sanctuary",
              "description": "Meet Indonesia''s most iconic apes.",
              "image": "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80"
            },
            {
              "id": "15",
              "title": "Bird Watching",
              "description": "Discover tropical bird species in their natural habitat.",
              "image": "https://images.unsplash.com/photo-1537225228614-b19960110871?w=800&q=80"
            },
            {
              "id": "16",
              "title": "Marine Turtles",
              "description": "Witness the incredible turtle nesting season.",
              "image": "https://images.unsplash.com/photo-1504674900306-873dddd74b1f?w=800&q=80"
            }
          ]
        },
        {
          "id": "adventure",
          "label": "ADVENTURE",
          "items": [
            {
              "id": "17",
              "title": "Mount Climbing",
              "description": "Conquer Indonesia''s majestic mountain peaks.",
              "image": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"
            },
            {
              "id": "18",
              "title": "Jungle Trekking",
              "description": "Trek through dense rainforests and discover hidden waterfalls.",
              "image": "https://images.unsplash.com/photo-1548013146-72d72c85fd0d?w=800&q=80"
            },
            {
              "id": "19",
              "title": "White Water Rafting",
              "description": "Experience adrenaline-pumping rapids.",
              "image": "https://images.unsplash.com/photo-1537225228614-b19960110871?w=800&q=80"
            },
            {
              "id": "20",
              "title": "Rock Climbing",
              "description": "Scale the rock formations of Indonesia.",
              "image": "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80"
            }
          ]
        }
      ]
    },
    "experiencesShared": {
      "experiences": [
        {
          "id": "1",
          "title": "YACHT BALI",
          "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam eu condimentum arcu, a fermentum magna. Donec rutrum quis massa sit amet viverra. Integer pretium nunc ut diam tempus feugiat.",
          "image": "https://images.unsplash.com/photo-1537225228614-b19960110871?w=800&q=80"
        },
        {
          "id": "2",
          "title": "GRAND CANYON",
          "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam eu condimentum arcu, a fermentum magna. Donec rutrum quis massa sit amet viverra. Integer pretium nunc ut diam tempus feugiat.",
          "image": "https://images.unsplash.com/photo-1548013146-72d72c85fd0d?w=800&q=80"
        },
        {
          "id": "3",
          "title": "PHI PHI ISLAND",
          "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam eu condimentum arcu, a fermentum magna. Donec rutrum quis massa sit amet viverra. Integer pretium nunc ut diam tempus feugiat.",
          "image": "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80"
        }
      ]
    }
  }',
  1,
  NOW(),
  NOW()
);
