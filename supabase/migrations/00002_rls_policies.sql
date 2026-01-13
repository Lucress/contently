-- ============================================
-- CONTENTLY - Row Level Security Policies
-- Migration 00002: RLS Policies
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_pillars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.filming_setups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hashtag_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hashtags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspirations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.script_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.broll_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planner_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_snapshots ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROFILES - Users can only access their own profile
-- ============================================
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Insert is handled by trigger, but allow if needed
CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- ============================================
-- SUBSCRIPTIONS
-- ============================================
CREATE POLICY "Users can view their own subscription"
    ON public.subscriptions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription"
    ON public.subscriptions FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Service role can insert/update for Stripe webhooks
CREATE POLICY "Service role can manage subscriptions"
    ON public.subscriptions FOR ALL
    USING (auth.jwt()->>'role' = 'service_role');

-- ============================================
-- CONTENT PILLARS
-- ============================================
CREATE POLICY "Users can view their own content pillars"
    ON public.content_pillars FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own content pillars"
    ON public.content_pillars FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own content pillars"
    ON public.content_pillars FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own content pillars"
    ON public.content_pillars FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- CATEGORIES
-- ============================================
CREATE POLICY "Users can view their own categories"
    ON public.categories FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own categories"
    ON public.categories FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories"
    ON public.categories FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories"
    ON public.categories FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- FILMING SETUPS
-- ============================================
CREATE POLICY "Users can view their own filming setups"
    ON public.filming_setups FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own filming setups"
    ON public.filming_setups FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own filming setups"
    ON public.filming_setups FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own filming setups"
    ON public.filming_setups FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- HASHTAG GROUPS
-- ============================================
CREATE POLICY "Users can view their own hashtag groups"
    ON public.hashtag_groups FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own hashtag groups"
    ON public.hashtag_groups FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own hashtag groups"
    ON public.hashtag_groups FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own hashtag groups"
    ON public.hashtag_groups FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- HASHTAGS
-- ============================================
CREATE POLICY "Users can view their own hashtags"
    ON public.hashtags FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own hashtags"
    ON public.hashtags FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own hashtags"
    ON public.hashtags FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own hashtags"
    ON public.hashtags FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- CONTENT TYPES (Templates)
-- ============================================
CREATE POLICY "Users can view their own content types"
    ON public.content_types FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own content types"
    ON public.content_types FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own content types"
    ON public.content_types FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own content types"
    ON public.content_types FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- INSPIRATIONS
-- ============================================
CREATE POLICY "Users can view their own inspirations"
    ON public.inspirations FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own inspirations"
    ON public.inspirations FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own inspirations"
    ON public.inspirations FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own inspirations"
    ON public.inspirations FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- IDEAS
-- ============================================
CREATE POLICY "Users can view their own ideas"
    ON public.ideas FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own ideas"
    ON public.ideas FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ideas"
    ON public.ideas FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ideas"
    ON public.ideas FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- SCRIPT BLOCKS
-- ============================================
CREATE POLICY "Users can view their own script blocks"
    ON public.script_blocks FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own script blocks"
    ON public.script_blocks FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own script blocks"
    ON public.script_blocks FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own script blocks"
    ON public.script_blocks FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- B-ROLL ITEMS
-- ============================================
CREATE POLICY "Users can view their own broll items"
    ON public.broll_items FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own broll items"
    ON public.broll_items FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own broll items"
    ON public.broll_items FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own broll items"
    ON public.broll_items FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- PLANNER ITEMS
-- ============================================
CREATE POLICY "Users can view their own planner items"
    ON public.planner_items FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own planner items"
    ON public.planner_items FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own planner items"
    ON public.planner_items FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own planner items"
    ON public.planner_items FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- BRANDS
-- ============================================
CREATE POLICY "Users can view their own brands"
    ON public.brands FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own brands"
    ON public.brands FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own brands"
    ON public.brands FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own brands"
    ON public.brands FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- DEALS
-- ============================================
CREATE POLICY "Users can view their own deals"
    ON public.deals FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own deals"
    ON public.deals FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own deals"
    ON public.deals FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own deals"
    ON public.deals FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- TASKS
-- ============================================
CREATE POLICY "Users can view their own tasks"
    ON public.tasks FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tasks"
    ON public.tasks FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks"
    ON public.tasks FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks"
    ON public.tasks FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- EMAIL ACCOUNTS
-- ============================================
CREATE POLICY "Users can view their own email accounts"
    ON public.email_accounts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own email accounts"
    ON public.email_accounts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own email accounts"
    ON public.email_accounts FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own email accounts"
    ON public.email_accounts FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- EMAIL MESSAGES
-- ============================================
CREATE POLICY "Users can view their own email messages"
    ON public.email_messages FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own email messages"
    ON public.email_messages FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own email messages"
    ON public.email_messages FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own email messages"
    ON public.email_messages FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- EMAIL TEMPLATES
-- ============================================
CREATE POLICY "Users can view their own email templates"
    ON public.email_templates FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own email templates"
    ON public.email_templates FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own email templates"
    ON public.email_templates FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own email templates"
    ON public.email_templates FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- REVENUES
-- ============================================
CREATE POLICY "Users can view their own revenues"
    ON public.revenues FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own revenues"
    ON public.revenues FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own revenues"
    ON public.revenues FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own revenues"
    ON public.revenues FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- ANALYTICS SNAPSHOTS
-- ============================================
CREATE POLICY "Users can view their own analytics"
    ON public.analytics_snapshots FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analytics"
    ON public.analytics_snapshots FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own analytics"
    ON public.analytics_snapshots FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own analytics"
    ON public.analytics_snapshots FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- STORAGE BUCKETS POLICIES
-- ============================================

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('contracts', 'contracts', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('assets', 'assets', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Contracts bucket policies
CREATE POLICY "Users can upload their own contracts"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'contracts' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can view their own contracts"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'contracts' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete their own contracts"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'contracts' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Assets bucket policies
CREATE POLICY "Users can upload their own assets"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'assets' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can view their own assets"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'assets' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete their own assets"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'assets' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Avatars bucket policies (public)
CREATE POLICY "Users can upload their own avatar"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'avatars' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Anyone can view avatars"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'avatars');

CREATE POLICY "Users can update their own avatar"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'avatars' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete their own avatar"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'avatars' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );
