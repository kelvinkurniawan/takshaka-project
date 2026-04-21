-- Seed data for Sustainability Impact page sections

DELETE FROM page_sections WHERE page_slug = 'sustainability-impact';

INSERT INTO page_sections (page_name, page_slug, page_data, created_by, created_at, updated_at)
VALUES (
  'Sustainability Impact',
  'sustainability-impact',
  '{"hero":{"contents":[{"title":"SUSTAINABILITY IMPACT","description":"Discover our commitment to environmental sustainability and social responsibility initiatives","background":"https://images.unsplash.com/photo-1559027615-cd2628902d4a?w=1920&q=80"}]},"ourImpacts":{"title":"OUR IMPACTS","description":"Our commitment to creating positive environmental and social change across Indonesia","items":[{"number":"37","label":"CSR Projects","description":"Successful community development initiatives"},{"number":"2500+","label":"Lives Touched","description":"Communities positively impacted"},{"number":"50K+","label":"Trees Planted","description":"Reforestation efforts across the nation"},{"number":"95%","label":"Goal Achievement","description":"Exceeding our sustainability targets"}]},"impactStories":{"title":"IMPACT STORIES","description":"Real stories of change from our sustainability initiatives","items":[{"title":"Coral Reef Restoration","excerpt":"Our marine conservation project has successfully restored 50 hectares of damaged coral reefs in Komodo, creating thriving habitats for marine biodiversity.","image":"https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=600&q=80","link":"/blog/coral-restoration"},{"title":"Community Empowerment","excerpt":"Through vocational training and microfinance programs, we have empowered 500+ women entrepreneurs in rural Sulawesi to build sustainable livelihoods.","image":"https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80","link":"/blog/women-empowerment"},{"title":"Renewable Energy Initiative","excerpt":"We''ve installed solar energy systems in 25 remote villages, providing clean electricity to 5000+ people and reducing carbon emissions by 1000 tons annually.","image":"https://images.unsplash.com/photo-1509391366360-2e938e3f6c5f?w=600&q=80","link":"/blog/renewable-energy"}]},"projectsSection":{"title":"OUR PROJECTS","description":"We have launched over 35 projects where our clients, collaborating with local communities to promote lasting impact. Our initiatives have two areas of focus: community and environment.","selectedCategoryIds":[2,3,4,5],"items":[]}}',
  1,
  NOW(),
  NOW()
);
