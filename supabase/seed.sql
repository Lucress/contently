-- Seed Data for Contently
-- Run this after running create_test_user.sql

-- Test user ID (created by create_test_user.sql)
-- Email: test@contently.app | Password: Test123456!

DO $$
DECLARE
  v_user_id uuid := 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'; -- Test user
  v_pillar_tech uuid;
  v_pillar_lifestyle uuid;
  v_pillar_education uuid;
  v_category_smartphones uuid;
  v_category_apps uuid;
  v_category_travel uuid;
  v_type_short uuid;
  v_type_vlog uuid;
  v_type_tutorial uuid;
  v_idea_1 uuid;
  v_idea_2 uuid;
  v_idea_3 uuid;
  v_brand_1 uuid;
  v_brand_2 uuid;
BEGIN
  -- Clean up existing data for this user (to allow re-running)
  DELETE FROM revenues WHERE user_id = v_user_id;
  DELETE FROM deals WHERE user_id = v_user_id;
  DELETE FROM brands WHERE user_id = v_user_id;
  DELETE FROM planner_items WHERE user_id = v_user_id;
  DELETE FROM broll_items WHERE user_id = v_user_id;
  DELETE FROM script_blocks WHERE user_id = v_user_id;
  DELETE FROM ideas WHERE user_id = v_user_id;
  DELETE FROM inspirations WHERE user_id = v_user_id;
  DELETE FROM hashtags WHERE user_id = v_user_id;
  DELETE FROM hashtag_groups WHERE user_id = v_user_id;
  DELETE FROM filming_setups WHERE user_id = v_user_id;
  DELETE FROM content_types WHERE user_id = v_user_id;
  DELETE FROM categories WHERE user_id = v_user_id;
  DELETE FROM content_pillars WHERE user_id = v_user_id;

  -- =====================
  -- CONTENT PILLARS
  -- =====================
  INSERT INTO content_pillars (id, user_id, name, color, description)
  VALUES 
    (gen_random_uuid(), v_user_id, 'Tech & Gadgets', '#3B82F6', 'Tech product tests, smartphones, accessories'),
    (gen_random_uuid(), v_user_id, 'Lifestyle', '#22C55E', 'Daily vlogs, travel, lifestyle'),
    (gen_random_uuid(), v_user_id, 'Education', '#8B5CF6', 'Tutorials, tips, courses');
  
  SELECT id INTO v_pillar_tech FROM content_pillars WHERE user_id = v_user_id AND name = 'Tech & Gadgets' LIMIT 1;
  SELECT id INTO v_pillar_lifestyle FROM content_pillars WHERE user_id = v_user_id AND name = 'Lifestyle' LIMIT 1;
  SELECT id INTO v_pillar_education FROM content_pillars WHERE user_id = v_user_id AND name = 'Education' LIMIT 1;

  -- =====================
  -- CATEGORIES (table is called "categories" not "content_categories")
  -- =====================
  INSERT INTO categories (id, user_id, name, pillar_id, description)
  VALUES 
    (gen_random_uuid(), v_user_id, 'Smartphones', v_pillar_tech, 'Phone tests and comparisons'),
    (gen_random_uuid(), v_user_id, 'Applications', v_pillar_tech, 'Best apps and tips'),
    (gen_random_uuid(), v_user_id, 'Travel', v_pillar_lifestyle, 'Destinations and experiences'),
    (gen_random_uuid(), v_user_id, 'Productivity', v_pillar_education, 'Tips for being more efficient');

  SELECT id INTO v_category_smartphones FROM categories WHERE user_id = v_user_id AND name = 'Smartphones' LIMIT 1;
  SELECT id INTO v_category_apps FROM categories WHERE user_id = v_user_id AND name = 'Applications' LIMIT 1;
  SELECT id INTO v_category_travel FROM categories WHERE user_id = v_user_id AND name = 'Travel' LIMIT 1;

  -- =====================
  -- CONTENT TYPES
  -- =====================
  INSERT INTO content_types (id, user_id, name, icon, description)
  VALUES 
    (gen_random_uuid(), v_user_id, 'YouTube Short', 'video', 'Short-form vertical content'),
    (gen_random_uuid(), v_user_id, 'Long Video', 'film', 'Long-form YouTube content'),
    (gen_random_uuid(), v_user_id, 'Tutorial', 'book-open', 'Educational content'),
    (gen_random_uuid(), v_user_id, 'Vlog', 'camera', 'Personal vlog content'),
    (gen_random_uuid(), v_user_id, 'TikTok', 'music', 'TikTok content');

  SELECT id INTO v_type_short FROM content_types WHERE user_id = v_user_id AND name = 'YouTube Short' LIMIT 1;
  SELECT id INTO v_type_vlog FROM content_types WHERE user_id = v_user_id AND name = 'Vlog' LIMIT 1;
  SELECT id INTO v_type_tutorial FROM content_types WHERE user_id = v_user_id AND name = 'Tutorial' LIMIT 1;

  -- =====================
  -- FILMING SETUPS
  -- =====================
  INSERT INTO filming_setups (user_id, name, description)
  VALUES 
    (v_user_id, 'Main Studio', 'Fixed setup for face-to-camera videos'),
    (v_user_id, 'Mobile Vlog', 'Light setup for vlogs and travel'),
    (v_user_id, 'Top Shot', 'Overhead view for unboxings');

  -- =====================
  -- HASHTAG GROUPS
  -- =====================
  INSERT INTO hashtag_groups (user_id, name, description)
  VALUES 
    (v_user_id, 'Tech General', 'General tech hashtags'),
    (v_user_id, 'iPhone', 'Apple/iPhone hashtags'),
    (v_user_id, 'Productivity', 'Productivity hashtags'),
    (v_user_id, 'YouTube Creator', 'Creator hashtags');

  -- =====================
  -- INSPIRATIONS
  -- =====================
  INSERT INTO inspirations (user_id, title, source_url, notes, is_processed)
  VALUES 
    (v_user_id, 'Interesting video format', 'https://www.youtube.com/watch?v=example1', 'Love the intro + quick demo format', false),
    (v_user_id, 'Viral tech reel', 'https://www.instagram.com/reel/example', 'Cool transition to recreate', true),
    (v_user_id, 'Tech trends thread', 'https://twitter.com/mkbhd/status/123', 'Good smartphone market analysis', false),
    (v_user_id, 'Productivity hack', 'https://www.tiktok.com/@example/video/123', 'Effective short format for explaining concepts', true);

  -- =====================
  -- IDEAS
  -- =====================
  INSERT INTO ideas (id, user_id, title, description, pillar_id, category_id, content_type_id, status, priority, hook)
  VALUES 
    (gen_random_uuid(), v_user_id, 'iPhone 16 Pro Review: What Actually Changed', 
     'Complete review of the new iPhone focusing on the real important changes for users.', 
     v_pillar_tech, v_category_smartphones, v_type_vlog, 'draft', 3,
     'Is the iPhone 16 Pro really worth its price? After 2 weeks of intensive testing, here is my answer...');

  INSERT INTO ideas (id, user_id, title, description, pillar_id, category_id, content_type_id, status, priority, hook)
  VALUES 
    (gen_random_uuid(), v_user_id, '5 Free Apps That Changed My Productivity',
     'Selection of the best free apps to be more productive daily.',
     v_pillar_education, v_category_apps, v_type_tutorial, 'scripted', 2,
     'These 5 apps completely transformed how I work. The last one will surprise you...'),
    (gen_random_uuid(), v_user_id, 'My 2024 Setup: Complete Home Office Tour',
     'Presentation of my workspace with all the details on the equipment used.',
     v_pillar_lifestyle, NULL, v_type_vlog, 'filmed', 1,
     'Here is the setup that allows me to create all my videos from home...');

  SELECT id INTO v_idea_1 FROM ideas WHERE user_id = v_user_id AND title LIKE '%iPhone 16%' LIMIT 1;
  SELECT id INTO v_idea_2 FROM ideas WHERE user_id = v_user_id AND title LIKE '%Free Apps%' LIMIT 1;
  SELECT id INTO v_idea_3 FROM ideas WHERE user_id = v_user_id AND title LIKE '%2024 Setup%' LIMIT 1;

  -- =====================
  -- SCRIPT BLOCKS (for scripted idea)
  -- =====================
  IF v_idea_2 IS NOT NULL THEN
    INSERT INTO script_blocks (user_id, idea_id, block_type, content, sort_order)
    VALUES 
      (v_user_id, v_idea_2, 'hook', 'These 5 apps completely transformed how I work. And the best part? They are all free.', 0),
      (v_user_id, v_idea_2, 'intro', 'Let me show you 5 apps I use every day that saved me hours of work each week.', 1),
      (v_user_id, v_idea_2, 'main', 'App #1: Notion - My second brain to organize everything. Let me show you exactly how I use it...', 2),
      (v_user_id, v_idea_2, 'main', 'The secret is to create templates for everything you do regularly.', 3),
      (v_user_id, v_idea_2, 'transition', 'But Notion is not enough for one essential thing...', 4),
      (v_user_id, v_idea_2, 'main', 'App #2: Todoist - The perfect task management. Here is why I tried 20 apps before settling on this one...', 5),
      (v_user_id, v_idea_2, 'cta', 'If this video was helpful, consider liking and subscribing. See you in the next one!', 6);
  END IF;

  -- =====================
  -- B-ROLL ITEMS (for filmed idea)
  -- =====================
  IF v_idea_3 IS NOT NULL THEN
    INSERT INTO broll_items (user_id, idea_id, description, status, sort_order)
    VALUES 
      (v_user_id, v_idea_3, 'Wide shot of complete desk', 'filmed', 0),
      (v_user_id, v_idea_3, 'Detail on mechanical keyboard', 'filmed', 1),
      (v_user_id, v_idea_3, 'Screen with editing interface', 'filmed', 2),
      (v_user_id, v_idea_3, 'Camera + lenses rotation', 'needed', 3),
      (v_user_id, v_idea_3, 'Lighting setup shot', 'needed', 4),
      (v_user_id, v_idea_3, 'Morning setup timelapse', 'needed', 5);
  END IF;

  -- =====================
  -- PLANNER ITEMS
  -- =====================
  INSERT INTO planner_items (user_id, idea_id, date, item_type, title, is_completed)
  VALUES 
    (v_user_id, v_idea_1, CURRENT_DATE + INTERVAL '2 days', 'filming', 'Film iPhone 16 Review', false),
    (v_user_id, v_idea_1, CURRENT_DATE + INTERVAL '3 days', 'editing', 'Edit iPhone 16 Review', false),
    (v_user_id, v_idea_2, CURRENT_DATE + INTERVAL '5 days', 'publishing', 'Publish 5 Apps Video', false);

  -- =====================
  -- BRANDS
  -- =====================
  INSERT INTO brands (id, user_id, name, industry, contact_name, contact_email, website, notes)
  VALUES 
    (gen_random_uuid(), v_user_id, 'TechBrand', 'Technology', 'John Smith', 'john@techbrand.com', 'https://techbrand.com', 'Contact through their agency MediaConnect'),
    (gen_random_uuid(), v_user_id, 'EcoLife', 'Lifestyle', 'Sarah Johnson', 'partnerships@ecolife.com', 'https://ecolife.com', 'Interested in lifestyle/travel content');

  SELECT id INTO v_brand_1 FROM brands WHERE user_id = v_user_id AND name = 'TechBrand' LIMIT 1;
  SELECT id INTO v_brand_2 FROM brands WHERE user_id = v_user_id AND name = 'EcoLife' LIMIT 1;

  -- =====================
  -- DEALS
  -- =====================
  INSERT INTO deals (user_id, brand_id, title, budget, currency, status, deadline, notes)
  VALUES 
    (v_user_id, v_brand_1, 'Product Test Q1 2026', 1500, 'EUR', 'negotiating', 
     CURRENT_DATE + INTERVAL '30 days',
     'Waiting for final proposal'),
    (v_user_id, v_brand_2, 'Annual Partnership', 5000, 'EUR', 'proposal_sent',
     CURRENT_DATE + INTERVAL '60 days',
     '6-month renewable contract'),
    (v_user_id, v_brand_1, 'Previous Video Sponsorship', 800, 'EUR', 'completed',
     CURRENT_DATE - INTERVAL '15 days',
     'Successful collaboration');

  -- =====================
  -- REVENUES
  -- =====================
  INSERT INTO revenues (user_id, source, amount, currency, date, description)
  VALUES 
    (v_user_id, 'sponsorship', 800, 'EUR', CURRENT_DATE - INTERVAL '15 days', 'TechBrand Sponsorship'),
    (v_user_id, 'adsense', 450, 'EUR', CURRENT_DATE - INTERVAL '1 month', 'AdSense Revenue December'),
    (v_user_id, 'adsense', 520, 'EUR', CURRENT_DATE - INTERVAL '2 months', 'AdSense Revenue November'),
    (v_user_id, 'affiliate', 180, 'EUR', CURRENT_DATE - INTERVAL '20 days', 'Amazon Commissions'),
    (v_user_id, 'sponsorship', 1200, 'EUR', CURRENT_DATE - INTERVAL '2 months', 'Other brand collaboration'),
    (v_user_id, 'product', 350, 'EUR', CURRENT_DATE - INTERVAL '3 months', 'Lightroom Presets Sales');

  RAISE NOTICE 'Seed data created successfully for user %', v_user_id;
END $$;
