-- ============================================
-- Fix 1: Add 'idea' to idea_status ENUM
-- The new pipeline uses 'idea' as the first step (absorbing draft/planned).
-- PostgreSQL requires explicit ALTER TYPE to add enum values.
-- ============================================
ALTER TYPE idea_status ADD VALUE IF NOT EXISTS 'idea';

-- ============================================
-- Fix 2: Remove dangerous RLS policy that lets users
-- update their own subscription directly.
-- Only the service role (Stripe webhook) should write subscriptions.
-- ============================================
DROP POLICY IF EXISTS "Users can update their own subscription" ON public.subscriptions;

-- Re-create a read-only policy for users (they can view but not change their plan)
-- Service role policy already covers all operations for the webhook.
-- ============================================
-- Verify: users can still SELECT their own subscription
-- "Users can view their own subscription" policy already exists — no change needed.
