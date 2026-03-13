-- Seed data for Curated Experiences
-- This file contains categories and articles for the Curated Experiences section

-- Set created_by to 1 (assuming admin user with ID 1 exists)
-- If you need a different user ID, replace 1 with the correct user ID in all queries below

-- ============================================
-- INSERT CATEGORIES
-- ============================================

INSERT INTO categories (name, slug, description, created_by, created_at, updated_at) VALUES
('Adventure Tours', 'adventure-tours', 'Thrilling outdoor adventures and expedition experiences around the world', 1, NOW(), NOW()),
('Beach Escapes', 'beach-escapes', 'Relaxing beach vacations and seaside resort experiences', 1, NOW(), NOW()),
('Cultural Heritage', 'cultural-heritage', 'Immersive cultural experiences and historical tour packages', 1, NOW(), NOW()),
('Luxury Retreats', 'luxury-retreats', 'Exclusive luxury vacation experiences and high-end accommodations', 1, NOW(), NOW()),
('Wellness & Spa', 'wellness-spa', 'Rejuvenating wellness retreats and spa packages', 1, NOW(), NOW());

-- ============================================
-- INSERT CONTENT ARTICLES - ADVENTURE TOURS
-- ============================================

INSERT INTO contents (title, slug, content, excerpt, type, category_id, featured_image, status, published_at, meta_title, meta_description, meta_keywords, created_by, created_at, updated_at) VALUES
(
	'Mountain Climbing Expedition to Peak Adventures',
	'mountain-climbing-expedition',
	'<p>Experience the thrill of conquering some of the world''s most spectacular peaks. Our expert guides will lead you through challenging terrain and breathtaking landscapes. This 10-day expedition includes professional mountaineering training, high-altitude acclimatization, and summit attempts with full safety equipment and support.</p><p>Perfect for adventurers seeking an unforgettable challenge and stunning views from the top of the world.</p>',
	'Join us on an epic mountain climbing expedition to conquer challenging peaks with expert guides and comprehensive safety support.',
	'article',
	1,
	'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
	'published',
	NOW(),
	'Mountain Climbing Expedition | Adventure Tours',
	'Join our mountain climbing expedition with expert guides. Conquer peaks and experience breathtaking landscapes.',
	'mountain climbing, expedition, adventure, trekking, peaks',
	1,
	NOW(),
	NOW()
),
(
	'Jungle Safari Through Rainforest Wonders',
	'jungle-safari-rainforest',
	'<p>Explore the most biodiverse regions on Earth with our guided jungle safari expeditions. Navigate pristine rainforests, spot exotic wildlife, and discover hidden waterfalls. Our experienced naturalist guides will teach you about the ecosystem while you stay in comfortable eco-lodges.</p><p>This immersive 8-day adventure includes daily jungle treks, wildlife observation, indigenous community interactions, and photography opportunities.</p>',
	'Discover the untamed beauty of rainforests with guided wildlife safari through pristine jungle landscapes.',
	'article',
	1,
	'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop',
	'published',
	NOW(),
	'Jungle Safari Rainforest Adventure | Explore Wildlife',
	'Experience jungle safari through pristine rainforests. Spot exotic wildlife and discover hidden natural wonders.',
	'jungle safari, rainforest, wildlife, adventure, nature',
	1,
	NOW(),
	NOW()
),
(
	'Rock Climbing & Rappelling in Dramatic Canyons',
	'rock-climbing-canyons',
	'<p>Test your climbing skills and conquer vertical rock faces in some of the world''s most dramatic canyon systems. Our certified climbing instructors provide comprehensive training and safety briefings for climbers of all skill levels. Experience the rush of ascending challenging routes with panoramic canyon views.</p><p>The 5-day program includes rope management, safety protocols, technical climbing instruction, and spectacular rappelling descents.</p>',
	'Master rock climbing and rappelling techniques while exploring stunning canyon landscapes with professional instructors.',
	'article',
	1,
	'https://images.unsplash.com/photo-1522163182402-834ff146da16?w=800&h=600&fit=crop',
	'published',
	NOW(),
	'Rock Climbing Canyon Adventure | Technical Climbing',
	'Learn rock climbing and rappelling in dramatic canyons. World-class instruction for all skill levels.',
	'rock climbing, rappelling, canyons, adventure, outdoors',
	1,
	NOW(),
	NOW()
),
(
	'White Water Rafting Down Roaring Rivers',
	'white-water-rafting-rivers',
	'<p>Experience the adrenaline rush of navigating class IV and V white water rapids through pristine river canyons. Professional river guides accompany every raft, ensuring safety while delivering maximum excitement. Navigate through stunning geological formations and untamed wilderness.</p><p>Our 6-day white water adventure includes multiple rivers, varying difficulty levels, riverside camping, and gourmet meal preparation in the wilderness.</p>',
	'Navigate thrilling white water rapids through scenic river canyons with expert guides and comprehensive safety gear.',
	'article',
	1,
	'https://images.unsplash.com/photo-1541625602330-2277a4647d6e?w=800&h=600&fit=crop',
	'published',
	NOW(),
	'White Water Rafting Adventure | River Tours',
	'Experience white water rafting through exciting rapids and scenic canyons with professional guides.',
	'white water rafting, rivers, adventure, rapids, outdoor',
	1,
	NOW(),
	NOW()
),
(
	'Desert Expedition & Star Gazing Experience',
	'desert-expedition-stargazing',
	'<p>Journey into vast desert landscapes under some of the clearest night skies on Earth. Our desert expeditions combine camel trekking, dune exploration, and luxury Bedouin-style tent camping. As the sun sets, experience world-class stargazing with our astronomy guides who reveal the wonders of the cosmos.</p><p>This 7-day desert experience includes daily camel treks, sandboard lessons, traditional desert cuisine, and nightly astronomy sessions.</p>',
	'Explore vast desert landscapes and experience exceptional stargazing under pristine night skies with expert astronomers.',
	'article',
	1,
	'https://images.unsplash.com/photo-1467270351994-14ae9a54c3f1?w=800&h=600&fit=crop',
	'published',
	NOW(),
	'Desert Expedition Stargazing | Adventure Tours',
	'Desert trekking and astronomy experience. Explore endless dunes and gaze at the stars with expert guides.',
	'desert expedition, stargazing, astronomy, adventure, trekking',
	1,
	NOW(),
	NOW()
);

-- ============================================
-- INSERT CONTENT ARTICLES - BEACH ESCAPES
-- ============================================

INSERT INTO contents (title, slug, content, excerpt, type, category_id, featured_image, status, published_at, meta_title, meta_description, meta_keywords, created_by, created_at, updated_at) VALUES
(
	'Tropical Island Paradise with Crystal Waters',
	'tropical-island-paradise',
	'<p>Escape to pristine tropical islands surrounded by crystal-clear turquoise waters and white sand beaches. Our all-inclusive island packages feature luxury beachfront resorts, water sports, snorkeling, and private island excursions. Immerse yourself in tropical paradise with perfect weather, exotic cuisine, and world-class hospitality.</p><p>The 5-day tropical escape includes beachfront accommodation, daily water sports, spa treatments, and gourmet dining experiences.</p>',
	'Discover tropical island paradise with pristine beaches, crystal waters, and luxury resort accommodations.',
	'article',
	2,
	'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
	'published',
	NOW(),
	'Tropical Island Paradise | Beach Resort Escape',
	'Experience tropical island paradise with luxury resorts, crystal waters, and white sandy beaches.',
	'tropical islands, beach, paradise, vacation, resort',
	1,
	NOW(),
	NOW()
),
(
	'Luxury Beachfront Villa Retreat',
	'luxury-beachfront-villa',
	'<p>Indulge in ultimate luxury at an exclusive beachfront villa with private beach access and ocean views. These stunning villas feature infinity pools, premium amenities, private chefs, and personalized concierge services. Perfect for couples seeking romance or families wanting an exclusive beach experience.</p><p>Our villa packages include luxury accommodation, private beach, infinity pool, gourmet dining, spa services, and water sports activities.</p>',
	'Stay in exclusive luxury beachfront villas with private pools, personal chefs, and pristine beach access.',
	'article',
	2,
	'https://images.unsplash.com/photo-1520250497591-112f2980fc06?w=800&h=600&fit=crop',
	'published',
	NOW(),
	'Luxury Beachfront Villa Retreat | Exclusive Getaway',
	'Exclusive luxury beachfront villas with private amenities, gourmet dining, and pristine ocean views.',
	'luxury villa, beachfront, resort, vacation, private beach',
	1,
	NOW(),
	NOW()
),
(
	'Coral Reef Snorkeling Adventure',
	'coral-reef-snorkeling',
	'<p>Explore vibrant coral reefs teeming with colorful fish and marine life. Our guided snorkeling excursions take you to protected marine reserves where you''ll encounter sea turtles, tropical fish, and pristine coral ecosystems. Professional guides ensure your safety while providing fascinating insights into marine biology and conservation.</p><p>The 4-day snorkeling adventure includes daily reef excursions, marine biology briefings, beach relaxation, and sunset sailing.</p>',
	'Snorkel vibrant coral reefs and encounter exotic marine life in protected underwater sanctuaries.',
	'article',
	2,
	'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
	'published',
	NOW(),
	'Coral Reef Snorkeling | Marine Adventure',
	'Guided snorkeling in pristine coral reefs with marine biologists. Encounter sea turtles and tropical fish.',
	'snorkeling, coral reef, beach, marine life, water sports',
	1,
	NOW(),
	NOW()
),
(
	'Sunset Sailing & Seaside Dining',
	'sunset-sailing-dining',
	'<p>Experience romantic sunset sailing on luxury yacht vessels with gourmet dining at sea. Glide across calm ocean waters as the sun paints the sky in golden hues, enjoying fine dining prepared by award-winning chefs. Perfect for romantic getaways, anniversaries, or special celebrations with unforgettable ocean vistas.</p><p>Evening packages include sunset sail, gourmet multi-course dinner, premium beverages, live music, and private deck access.</p>',
	'Enjoy romantic sunset sailing on luxury yachts with gourmet dining and ocean panoramas.',
	'article',
	2,
	'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
	'published',
	NOW(),
	'Sunset Sailing & Seaside Dining | Romantic Escape',
	'Romantic sunset sailing with gourmet dining, live music, and luxurious yacht experience.',
	'sailing, sunset, yacht, dining, romantic vacation',
	1,
	NOW(),
	NOW()
),
(
	'Beach Spa Wellness Retreat',
	'beach-spa-wellness',
	'<p>Rejuvenate your body and mind at our beachfront spa wellness retreat. Enjoy daily yoga and meditation sessions with ocean views, professional spa treatments using natural ingredients, and nutritious cuisine focused on health and wellness. The healing sound of waves combined with expert therapists creates the perfect environment for renewal and relaxation.</p><p>The 6-day wellness retreat includes accommodation, daily yoga, meditation, spa treatments, healthy cuisine, and wellness workshops.</p>',
	'Rejuvenate at beachfront wellness retreat with yoga, spa treatments, and healthy cuisine.',
	'article',
	2,
	'https://images.unsplash.com/photo-1543862475-eb785736ad0f?w=800&h=600&fit=crop',
	'published',
	NOW(),
	'Beach Spa Wellness Retreat | Relaxation Vacation',
	'Beachfront wellness retreat with yoga, spa treatments, meditation, and restorative wellness programs.',
	'wellness, spa, beach, yoga, relaxation, retreat',
	1,
	NOW(),
	NOW()
);

-- ============================================
-- INSERT CONTENT ARTICLES - CULTURAL HERITAGE
-- ============================================

INSERT INTO contents (title, slug, content, excerpt, type, category_id, featured_image, status, published_at, meta_title, meta_description, meta_keywords, created_by, created_at, updated_at) VALUES
(
	'Ancient Temple Tour Through Sacred Sites',
	'ancient-temple-tour',
	'<p>Journey through centuries of history exploring magnificent ancient temples and sacred sites. Our expert historians and local guides provide deep insights into the cultural significance, architectural brilliance, and spiritual importance of each location. Visit intricately carved temples, monasteries, and religious monuments that have stood for millennia.</p><p>The 8-day cultural tour includes guided temple visits, expert lectures, local community interactions, photography opportunities, and cultural workshops.</p>',
	'Explore magnificent ancient temples and sacred sites with expert historians and local cultural guides.',
	'article',
	3,
	'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
	'published',
	NOW(),
	'Ancient Temple Tour | Cultural Heritage Sites',
	'Expert-guided tours through ancient temples, sacred sites, and historical monuments with cultural insights.',
	'temples, cultural heritage, history, archaeology, ancient sites',
	1,
	NOW(),
	NOW()
),
(
	'Traditional Art & Craft Master Classes',
	'traditional-art-craft',
	'<p>Learn authentic traditional arts and crafts directly from master artisans. Participate in hands-on workshops creating textiles, pottery, paintings, and sculptures using centuries-old techniques passed down through generations. Gain deep appreciation for cultural traditions while creating your own artistic masterpieces to take home.</p><p>The 5-day craft workshop includes daily master classes, art supplies, material costs, artisan interactions, and gallery visit.</p>',
	'Master traditional arts and crafts through hands-on workshops with expert local artisans and craftspeople.',
	'article',
	3,
	'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&h=600&fit=crop',
	'published',
	NOW(),
	'Traditional Art & Craft Classes | Cultural Learning',
	'Learn traditional arts and crafts from master artisans. Hands-on workshops in textile, pottery, and painting.',
	'traditional art, craft, workshops, cultural learning, artisan',
	1,
	NOW(),
	NOW()
),
(
	'Culinary Heritage Food Tour',
	'culinary-heritage-food',
	'<p>Discover authentic culinary traditions through immersive food tours and cooking classes. Visit local markets, meet traditional cooks, and learn to prepare signature dishes using family recipes and local ingredients. Experience the cultural significance of food in different regions through market exploration, cooking classes, and festive meals with local families.</p><p>The 6-day culinary tour includes market visits, cooking classes, restaurant experiences, local family dinners, and food history lessons.</p>',
	'Explore authentic culinary traditions through markets, cooking classes, and meals with local families.',
	'article',
	3,
	'https://images.unsplash.com/photo-1496627666981-5047e0db3b37?w=800&h=600&fit=crop',
	'published',
	NOW(),
	'Culinary Heritage Food Tour | Authentic Cuisine',
	'Explore authentic culinary traditions through cooking classes, markets, and local family dinners.',
	'food tour, culinary, cooking class, local cuisine, heritage',
	1,
	NOW(),
	NOW()
),
(
	'Historical Museum & Archive Expedition',
	'historical-museum-archive',
	'<p>Access restricted museum archives and behind-the-scenes collections with expert curators. Explore rare artifacts, historical documents, and museum storage areas typically closed to the public. Learn the stories behind priceless collections and understand how museums preserve cultural heritage for future generations.</p><p>The 4-day museum expedition includes curator-guided tours, archive access, conservation demonstrations, and exclusive lectures.</p>',
	'Explore rare artifacts and museum archives with expert curators during exclusive behind-the-scenes tours.',
	'article',
	3,
	'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&h=600&fit=crop',
	'published',
	NOW(),
	'Historical Museum & Archive Expedition | Cultural Access',
	'Exclusive museum archive tours with rare artifacts and curator-guided historical exploration.',
	'museum, history, archives, artifacts, cultural heritage',
	1,
	NOW(),
	NOW()
),
(
	'Indigenous Culture & Community Experience',
	'indigenous-culture-community',
	'<p>Experience authentic indigenous cultures through respectful, community-based tourism. Live with indigenous families, participate in daily activities, learn traditional languages, and understand spiritual practices. Support local communities directly while gaining genuine cultural insights and building meaningful cross-cultural connections.</p><p>The 7-day cultural immersion includes homestay accommodation, daily activities, language lessons, spiritual ceremonies, and community meals.</p>',
	'Experience authentic indigenous cultures through homestays, daily activities, and meaningful community connections.',
	'article',
	3,
	'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop',
	'published',
	NOW(),
	'Indigenous Culture Experience | Community Tourism',
	'Authentic indigenous culture immersion with community homestays and respectful cultural exchange.',
	'indigenous culture, community, travel, cultural exchange, linguistics',
	1,
	NOW(),
	NOW()
);

-- ============================================
-- INSERT CONTENT ARTICLES - LUXURY RETREATS
-- ============================================

INSERT INTO contents (title, slug, content, excerpt, type, category_id, featured_image, status, published_at, meta_title, meta_description, meta_keywords, created_by, created_at, updated_at) VALUES
(
	'Five-Star Private Island Resort',
	'five-star-private-island',
	'<p>Escape to an exclusive private island resort accessible only to guests. Experience ultra-luxury accommodations with personal butlers, Michelin-star dining, infinity pools overlooking pristine waters, and world-class spa facilities. Every detail is meticulously crafted for absolute comfort and indulgence with unparalleled privacy and service excellence.</p><p>Private island packages include luxury villa accommodation, personal butler service, gourmet dining, water sports, spa, and helicopter transfers.</p>',
	'Exclusive private island resort with luxury villas, personal butler service, and five-star amenities.',
	'article',
	4,
	'https://images.unsplash.com/photo-1553531088-eef8a64da54e?w=800&h=600&fit=crop',
	'published',
	NOW(),
	'Five-Star Private Island Resort | Luxury Escape',
	'Ultra-luxury private island resort with personal butler, gourmet dining, and exclusive beach access.',
	'luxury resort, private island, five-star, vacation, exclusive',
	1,
	NOW(),
	NOW()
),
(
	'Alpine Mountain Luxury Chalet Experience',
	'alpine-mountain-chalet',
	'<p>Indulge in ultimate Alpine luxury at exclusive mountain chalets with breathtaking peak views. These stunning properties feature roaring fireplaces, premium furnishings, private hot tubs, wine cellars, and gourmet kitchens. Enjoy mountain activities by day and cozy luxury by night with world-class spa services and fine dining experiences.</p><p>Alpine chalet packages include luxury accommodation, concierge services, spa treatments, fine dining, and mountain activities.</p>',
	'Alpine luxury chalets with premium amenities, private hot tubs, and gourmet mountain dining experiences.',
	'article',
	4,
	'https://images.unsplash.com/photo-1566576722541-b34c7f37141d?w=800&h=600&fit=crop',
	'published',
	NOW(),
	'Alpine Mountain Luxury Chalet | Premium Retreat',
	'Luxury Alpine chalets with premium furnishings, spa services, and fine dining mountain experiences.',
	'alpine chalet, luxury, mountain resort, vacation, skiing',
	1,
	NOW(),
	NOW()
),
(
	'Palace Hotel Grand Heritage Experience',
	'palace-hotel-heritage',
	'<p>Stay in magnificently restored palace hotels that blend historic grandeur with modern luxury. These iconic properties showcase original architectural details, period furnishings, and cultural significance while offering contemporary comfort and amenities. Experience timeless elegance in locations rich with history and royal heritage.</p><p>Palace hotel stays include historic suite accommodation, heritage tours, gourmet dining, spa access, and concierge service.</p>',
	'Stay in historic palace hotels blending royal heritage with modern luxury and cultural significance.',
	'article',
	4,
	'https://images.unsplash.com/photo-1631336344892-54dc1a9a5d69?w=800&h=600&fit=crop',
	'published',
	NOW(),
	'Palace Hotel Grand Heritage | Historic Luxury',
	'Historic palace hotels with royal heritage, luxury suites, and cultural significance.',
	'palace hotel, heritage, luxury, historic, vacation',
	1,
	NOW(),
	NOW()
),
(
	'Exclusive Golf Course & Resort Package',
	'exclusive-golf-resort',
	'<p>Access world-renowned private golf courses at exclusive resorts. Enjoy championship-level courses designed by legendary architects, professional coaching from PGA instructors, and luxurious on-course accommodations. Perfect for golf enthusiasts seeking the finest courses combined with premium resort facilities and amenities.</p><p>Golf resort packages include luxury accommodation, unlimited golf rounds, PGA instruction, caddy service, spa, and fine dining.</p>',
	'Exclusive private golf courses with championship designs and luxury resort facilities combined.',
	'article',
	4,
	'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=600&fit=crop',
	'published',
	NOW(),
	'Exclusive Golf Course & Resort | Premium Golf',
	'Private championship golf courses with luxury resorts, PGA instruction, and premium amenities.',
	'golf resort, luxury, private course, championship, vacation',
	1,
	NOW(),
	NOW()
),
(
	'Helicopter Tour & Luxury Dinner Experience',
	'helicopter-luxury-dinner',
	'<p>Experience ultimate luxury with private helicopter tours showcasing spectacular landscapes, followed by gourmet dinners in exclusive venues. Combine breathtaking aerial sightseeing with Michelin-star dining and champagne celebrations. Perfect for special occasions, anniversaries, or those seeking unforgettable luxury experiences combining adventure and fine dining.</p><p>Helicopter packages include private helicopter charter, scenic tour, luxury dinner, premium beverages, and ground transfers.</p>',
	'Private helicopter tours with aerial sightseeing followed by gourmet dinners in exclusive venues.',
	'article',
	4,
	'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop',
	'published',
	NOW(),
	'Helicopter Tour & Luxury Dinner | Premium Experience',
	'Private helicopter tours with luxury dinner experiences, scenic flights, and Michelin-star dining.',
	'helicopter tour, luxury, dining, scenic, exclusive',
	1,
	NOW(),
	NOW()
);

-- ============================================
-- INSERT CONTENT ARTICLES - WELLNESS & SPA
-- ============================================

INSERT INTO contents (title, slug, content, excerpt, type, category_id, featured_image, status, published_at, meta_title, meta_description, meta_keywords, created_by, created_at, updated_at) VALUES
(
	'Ayurvedic Healing & Traditional Medicine Retreat',
	'ayurvedic-healing-retreat',
	'<p>Discover ancient Ayurvedic healing practices and traditional medicine through immersive wellness retreats. Work with certified Ayurvedic practitioners to create personalized wellness plans, receive authentic treatments, and learn traditional healing techniques. Experience rejuvenation through massage, herbal remedies, yoga, meditation, and dietary plans aligned with your individual constitution.</p><p>Ayurvedic retreat includes accommodation, personalized consultations, daily treatments, yoga classes, and herbal meals.</p>',
	'Authentic Ayurvedic healing and traditional medicine retreat with personalized wellness plans.',
	'article',
	5,
	'https://images.unsplash.com/photo-1526495124232-a04b0903ba3d?w=800&h=600&fit=crop',
	'published',
	NOW(),
	'Ayurvedic Healing Retreat | Traditional Wellness',
	'Authentic Ayurvedic retreat with traditional healing, personalized treatments, and wellness plans.',
	'ayurveda, healing, wellness, traditional medicine, retreat',
	1,
	NOW(),
	NOW()
),
(
	'Yoga & Meditation Intensive Program',
	'yoga-meditation-intensive',
	'<p>Immerse yourself in comprehensive yoga and meditation programs with world-renowned instructors. Daily asana classes, pranayama breathing techniques, meditation sessions, philosophy lectures, and lifestyle coaching guide you toward inner peace and physical vitality. Programs cater to all levels from beginners to advanced practitioners seeking deeper spiritual connection.</p><p>Yoga intensive includes accommodation, daily classes, group meditation, philosophy lectures, vegetarian meals, and materials.</p>',
	'Intensive yoga and meditation programs with world-renowned instructors and daily spiritual practices.',
	'article',
	5,
	'https://images.unsplash.com/photo-1544993795-c4da6ffb5e51?w=800&h=600&fit=crop',
	'published',
	NOW(),
	'Yoga & Meditation Intensive | Spiritual Wellness',
	'Intensive yoga and meditation programs with expert instruction, daily practices, and spiritual guidance.',
	'yoga, meditation, wellness, instruction, mindfulness',
	1,
	NOW(),
	NOW()
),
(
	'Detox & Organic Cleansing Retreat',
	'detox-cleansing-retreat',
	'<p>Reset your body and mind through comprehensive detox and cleansing programs. Supervised by wellness doctors, these programs include organic juice cleanses, nutritious meals, herbal treatments, body therapies, and lifestyle coaching. Experience energy renewal and toxin elimination through evidence-based practices in beautiful, health-focused environments.</p><p>Detox retreat includes accommodation, daily detox meals, juice cleanses, spa treatments, consultations, and wellness education.</p>',
	'Comprehensive detox and cleansing retreat with organic nutrition and professional wellness supervision.',
	'article',
	5,
	'https://images.unsplash.com/photo-1506797048baad5f3caf91e7876e4f5e8?w=800&h=600&fit=crop',
	'published',
	NOW(),
	'Detox & Cleansing Retreat | Health Wellness',
	'Supervised detox retreat with organic nutrition, cleansing programs, and wellness restoration.',
	'detox, cleansing, wellness, organic, health retreat',
	1,
	NOW(),
	NOW()
),
(
	'Holistic Wellness Spa Package',
	'holistic-wellness-spa',
	'<p>Experience comprehensive holistic wellness through integrated spa and wellness packages. Receive Swedish massage, aromatherapy, facials, body treatments, reflexology, and energy healing sessions from certified therapists. Complementary wellness consultations guide personalized wellness journeys combining ancient practices with modern therapeutic techniques.</p><p>Holistic spa packages include accommodation, daily treatments, wellness consultations, healthy meals, and access to wellness facilities.</p>',
	'Holistic wellness spa combining massage, aromatherapy, energy healing, and personalized wellness care.',
	'article',
	5,
	'https://images.unsplash.com/photo-1600334089393-b70033a65718?w=800&h=600&fit=crop',
	'published',
	NOW(),
	'Holistic Wellness Spa | Therapeutic Treatments',
	'Holistic spa with massage, aromatherapy, energy healing, and comprehensive wellness treatments.',
	'spa, wellness, massage, aromatherapy, holistic health',
	1,
	NOW(),
	NOW()
),
(
	'Fitness Transformation Bootcamp',
	'fitness-transformation-bootcamp',
	'<p>Achieve your fitness goals through intensive transformation bootcamps led by elite fitness trainers. Personalized training programs, nutritional counseling, group fitness classes, and wellness coaching combine to create lasting lifestyle changes. Programs accommodate all fitness levels with adaptable intensity and focus on sustainable health improvements.</p><p>Fitness bootcamp includes accommodation, daily training sessions, nutritional guidance, meal planning, and fitness assessments.</p>',
	'Elite fitness bootcamp with personalized training, nutritional coaching, and transformation programs.',
	'article',
	5,
	'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop',
	'published',
	NOW(),
	'Fitness Transformation Bootcamp | Health Training',
	'Intensive fitness bootcamp with elite trainers, personalized programs, and nutritional coaching.',
	'fitness, bootcamp, training, transformation, wellness',
	1,
	NOW(),
	NOW()
);

-- ============================================
-- VERIFICATION QUERIES (Optional - for checking the inserted data)
-- ============================================

-- Uncomment these queries to verify your data after insertion:
-- SELECT COUNT(*) as total_categories FROM categories WHERE deleted_at IS NULL;
-- SELECT COUNT(*) as total_articles FROM contents WHERE status = 'published' AND deleted_at IS NULL;
-- SELECT c.name, COUNT(ar.id) as article_count FROM categories c LEFT JOIN contents ar ON ar.category_id = c.id AND ar.deleted_at IS NULL WHERE c.deleted_at IS NULL GROUP BY c.id, c.name;
