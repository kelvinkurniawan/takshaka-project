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

-- Insert Our Inspiration page sections
INSERT INTO page_sections (page_name, page_slug, page_data, created_by, created_at, updated_at)
VALUES (
  'Our Inspiration',
  'our-inspiration',
  '{
    "hero": {
      "title": "BOARD LETTER",
      "description": "A message from our leadership",
      "background": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&q=80"
    },
    "boardLetter": {
      "imageUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
      "paragraphs": [
        "At Taksaka, we believe that leadership is defined by the ability to adapt and innovate in an evolving landscape. This past year has tested our resolve and resilience, strengthening our commitment to our guests and partners. We reimagined experiences with a dedicated Team Taksaka to unlock transformational journeys in excellence.",
        "Our philosophy has always centered on authentic value to our clients and partners. By integrating forward-thinking strategies with a dedicated team, Taksaka is not just keeping pace with the industry—we are setting the standard for the future.",
        "We thank you for your continued trust as we embark on this next chapter of our journey."
      ],
      "signatureName": "Leadership Team",
      "signatureTitle": "Taksaka"
    },
    "fullwidthImage": {
      "src": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&q=80",
      "alt": "Inspiration"
    },
    "takskaWay": {
      "sectionTitle": "TAKSAKA WAY",
      "items": [
        {
          "id": "authenticity",
          "title": "AUTHENTICITY",
          "imageUrl": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&q=80"
        },
        {
          "id": "transformation",
          "title": "TRANSFORMATION",
          "imageUrl": "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=500&q=80"
        },
        {
          "id": "sustainability",
          "title": "SUSTAINABILITY",
          "imageUrl": "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500&q=80"
        },
        {
          "id": "harmony",
          "title": "HARMONY",
          "imageUrl": "https://images.unsplash.com/photo-1502933691298-84fc14542831?w=500&q=80"
        },
        {
          "id": "excellence",
          "title": "EXCELLENCE\nIN EXPERIENCE",
          "imageUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80"
        }
      ]
    },
    "brandStory": {
      "backgroundImage": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&q=80",
      "sectionTitle": "BRAND STORY",
      "items": [
        {
          "id": "origin",
          "title": "THE ORIGIN",
          "description": "Taksaka draws from a rich cultural heritage, weaving together ancestral wisdom with contemporary consciousness to create transformative journeys.",
          "imageUrl": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80"
        },
        {
          "id": "myth",
          "title": "MYTH & SYMBOL",
          "description": "More than mythology, Taksaka embodies the sacred connection between the ethereal and the spiritual, honoring the timeless and cherished traditions.",
          "imageUrl": "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600&q=80"
        },
        {
          "id": "meaning",
          "title": "MEANING",
          "description": "At its heart, Taksaka seeks to awaken collective revelation advancing consciousness, responsibility, and renewal to transform experience.",
          "imageUrl": "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=80"
        }
      ]
    },
    "timeline": {
      "sectionTitle": "SPIRITUAL JOURNEY",
      "items": [
        {
          "id": "mount-agung",
          "title": "MOUNT AGUNG",
          "description": "The axis of spiritual elevation."
        },
        {
          "id": "cloud",
          "title": "CLOUD",
          "description": "Aspiration beyond boundaries."
        },
        {
          "id": "air",
          "title": "AIR",
          "description": "Invisible force that connects all."
        },
        {
          "id": "fire",
          "title": "FIRE",
          "description": "Energy of transformation."
        },
        {
          "id": "water",
          "title": "WATER",
          "description": "Balance through adaptability."
        },
        {
          "id": "night-queen",
          "title": "NIGHT QUEEN",
          "description": "Timeless victory and grace."
        },
        {
          "id": "dragon",
          "title": "DRAGON",
          "description": "Directional growth and evolution."
        },
        {
          "id": "dragon-wing",
          "title": "DRAGON WING",
          "description": "Transcendental strength."
        },
        {
          "id": "gold-crown",
          "title": "GOLD CROWN",
          "description": "Illuminated authority."
        },
        {
          "id": "circle",
          "title": "CIRCLE",
          "description": "Eternal unity."
        },
        {
          "id": "gold-jewels",
          "title": "GOLD JEWELS",
          "description": "Inner prosperity and clarity."
        }
      ]
    }
  }',
  1,
  NOW(),
  NOW()
);

-- Insert Prestige Events page sections
INSERT INTO page_sections (page_name, page_slug, page_data, created_by, created_at, updated_at)
VALUES (
  'Prestige Events',
  'prestige-events',
  '{
    "hero": {
      "title": "PRESTIGE EVENTS",
      "description": "IDEAS DEMAND WORTHY STAGES",
      "background": "https://images.unsplash.com/photo-1540575467063-5f88a4ab0908?w=1920&q=80"
    },
    "heroContent": {
      "backgroundImage": "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1920&q=80",
      "alt": "Prestige Event Stage",
      "badge": "CONFERENCE & SUMMIT",
      "heading": "IDEAS DEMAND\nWORTHY STAGES",
      "description": "The world''s boldest ideas deserve a stage to match, and TakskaEvents creates experiences that turn conversation into transformation. Every event unfolds as a carefully choreographed masterpiece—from intimate roundtables to grand summits with thousands. We believe in creating powerful moments of connection and impact while building global peer communities."
    },
    "twoColumn": {
      "title": "WHERE BUSINESS",
      "titleItalic": "TRANSFORM INTO",
      "titleBold": "EXPERIENCE",
      "description": "When business gathers in the right setting, shaped by clear intention, it doesn''t just meet objectives. It transcends them. The world''s most forward-thinking organizations choose Taksaka to ensure their people experience something extraordinary and their most important conversations are held in the settings they deserve to be held in.",
      "imageUrl": "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80"
    },
    "imageGallery": {
      "images": [
        {
          "id": "1",
          "src": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
          "alt": "Mountain landscape"
        },
        {
          "id": "2",
          "src": "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600&q=80",
          "alt": "Abstract fire and light"
        },
        {
          "id": "3",
          "src": "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&q=80",
          "alt": "Aerial pattern"
        },
        {
          "id": "4",
          "src": "https://images.unsplash.com/photo-1421821537131-d7a4dcf3f7ca?w=600&q=80",
          "alt": "Galaxy stars"
        }
      ]
    }
  }',
  1,
  NOW(),
  NOW()
);
