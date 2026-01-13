-- Create a test user for Contently
-- Run this in Supabase SQL Editor BEFORE running seed.sql

-- This creates a user with:
-- Email: test@contently.app
-- Password: Test123456!

-- Step 1: Create the user in auth.users
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role,
  aud,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change
)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890', -- Fixed UUID for easy reference
  '00000000-0000-0000-0000-000000000000',
  'test@contently.app',
  crypt('Test123456!', gen_salt('bf')), -- Password: Test123456!
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Test Creator"}',
  false,
  'authenticated',
  'authenticated',
  '',
  '',
  '',
  ''
);

-- Step 2: Create identity for the user
INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  provider_id,
  created_at,
  updated_at,
  last_sign_in_at
)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  jsonb_build_object('sub', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'email', 'test@contently.app'),
  'email',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  NOW(),
  NOW(),
  NOW()
);

-- Step 3: The profile will be created automatically by the trigger
-- But let's make sure it exists with the right data
INSERT INTO public.profiles (id, email, full_name, onboarding_completed)
VALUES ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'test@contently.app', 'Test Creator', true)
ON CONFLICT (id) DO UPDATE SET 
  full_name = 'Test Creator',
  onboarding_completed = true;

-- =====================================================
-- NOW YOU CAN RUN seed.sql WITH THIS USER ID:
-- a1b2c3d4-e5f6-7890-abcd-ef1234567890
-- =====================================================

SELECT 'Test user created successfully!' AS status, 
       'Email: test@contently.app' AS email,
       'Password: Test123456!' AS password,
       'a1b2c3d4-e5f6-7890-abcd-ef1234567890' AS user_id;
