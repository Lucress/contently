-- ============================================
-- CONTENTLY - Content Operating System
-- Migration 00001: Initial Schema
-- ============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- USER PROFILES (extends Supabase Auth)
-- ============================================
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    timezone TEXT DEFAULT 'Europe/Paris',
    onboarding_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SUBSCRIPTIONS (Stripe)
-- ============================================
CREATE TYPE subscription_status AS ENUM ('trialing', 'active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'unpaid', 'paused');
CREATE TYPE subscription_plan AS ENUM ('free', 'pro', 'creator_plus');

CREATE TABLE public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    plan subscription_plan DEFAULT 'free',
    status subscription_status DEFAULT 'active',
    price_id TEXT,
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- ============================================
-- CONTENT PILLARS
-- ============================================
CREATE TABLE public.content_pillars (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#6366f1',
    icon TEXT DEFAULT 'star',
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CATEGORIES
-- ============================================
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    pillar_id UUID REFERENCES public.content_pillars(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#8b5cf6',
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- FILMING SETUPS
-- ============================================
CREATE TYPE camera_orientation AS ENUM ('portrait', 'landscape', 'square');
CREATE TYPE camera_distance AS ENUM ('close_up', 'medium', 'wide', 'full_body');
CREATE TYPE microphone_type AS ENUM ('lav', 'shotgun', 'internal', 'wireless', 'none');

CREATE TABLE public.filming_setups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    location TEXT,
    orientation camera_orientation DEFAULT 'portrait',
    distance camera_distance DEFAULT 'medium',
    microphone microphone_type DEFAULT 'lav',
    lighting_notes TEXT,
    camera_settings TEXT,
    checklist JSONB DEFAULT '[]',
    is_default BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- HASHTAG LIBRARY
-- ============================================
CREATE TABLE public.hashtag_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#10b981',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.hashtags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    group_id UUID REFERENCES public.hashtag_groups(id) ON DELETE SET NULL,
    tag TEXT NOT NULL,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CONTENT TYPES (Templates)
-- ============================================
CREATE TABLE public.content_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT DEFAULT 'video',
    color TEXT DEFAULT '#f59e0b',
    -- Template structure
    default_structure JSONB DEFAULT '[]',
    default_cta TEXT,
    default_hashtags TEXT[],
    default_filming_setup_id UUID REFERENCES public.filming_setups(id) ON DELETE SET NULL,
    -- Estimated durations
    estimated_filming_minutes INTEGER DEFAULT 30,
    estimated_editing_minutes INTEGER DEFAULT 60,
    -- Settings
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INSPIRATIONS
-- ============================================
CREATE TYPE inspiration_source AS ENUM ('manual', 'email', 'social', 'conversation', 'article', 'other');

CREATE TABLE public.inspirations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    source inspiration_source DEFAULT 'manual',
    source_url TEXT,
    source_author TEXT,
    notes TEXT,
    tags TEXT[],
    is_processed BOOLEAN DEFAULT FALSE,
    converted_to_idea_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- IDEAS (Core content entity)
-- ============================================
CREATE TYPE idea_status AS ENUM (
    'draft',
    'scripted',
    'planned',
    'to_film',
    'filmed',
    'editing',
    'scheduled',
    'published',
    'archived'
);

CREATE TYPE content_platform AS ENUM ('tiktok', 'instagram_reels', 'youtube_shorts', 'youtube', 'linkedin', 'twitter', 'other');

CREATE TABLE public.ideas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    -- Core info
    title TEXT NOT NULL,
    hook TEXT,
    description TEXT,
    -- Classification
    pillar_id UUID REFERENCES public.content_pillars(id) ON DELETE SET NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    content_type_id UUID REFERENCES public.content_types(id) ON DELETE SET NULL,
    -- Status
    status idea_status DEFAULT 'draft',
    priority INTEGER DEFAULT 0,
    -- Content details
    cta TEXT,
    hashtags TEXT[],
    platforms content_platform[] DEFAULT ARRAY['tiktok']::content_platform[],
    -- Filming
    filming_setup_id UUID REFERENCES public.filming_setups(id) ON DELETE SET NULL,
    filming_date DATE,
    filming_notes TEXT,
    is_filmed BOOLEAN DEFAULT FALSE,
    filmed_at TIMESTAMPTZ,
    -- Publishing
    scheduled_date DATE,
    scheduled_time TIME,
    published_at TIMESTAMPTZ,
    published_url TEXT,
    -- Sponsorship
    is_sponsored BOOLEAN DEFAULT FALSE,
    deal_id UUID, -- Will reference deals table
    -- Source
    inspiration_id UUID REFERENCES public.inspirations(id) ON DELETE SET NULL,
    -- Analytics placeholder
    views_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SCRIPT BLOCKS
-- ============================================
CREATE TYPE block_type AS ENUM ('hook', 'intro', 'main', 'transition', 'cta', 'outro', 'custom');

CREATE TABLE public.script_blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    idea_id UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
    block_type block_type DEFAULT 'main',
    title TEXT,
    content TEXT NOT NULL,
    duration_seconds INTEGER,
    sort_order INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- B-ROLL ITEMS
-- ============================================
CREATE TYPE broll_status AS ENUM ('needed', 'filmed', 'found', 'edited');

CREATE TABLE public.broll_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    idea_id UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
    script_block_id UUID REFERENCES public.script_blocks(id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    status broll_status DEFAULT 'needed',
    source_url TEXT,
    duration_seconds INTEGER,
    sort_order INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PLANNER ITEMS
-- ============================================
CREATE TYPE planner_item_type AS ENUM ('filming', 'editing', 'publishing', 'task', 'meeting', 'other');

CREATE TABLE public.planner_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    idea_id UUID REFERENCES public.ideas(id) ON DELETE CASCADE,
    deal_id UUID, -- Will reference deals
    -- Scheduling
    item_type planner_item_type DEFAULT 'task',
    title TEXT NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    all_day BOOLEAN DEFAULT FALSE,
    -- Status
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    -- Recurrence (optional)
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_rule TEXT,
    -- Metadata
    color TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- BRANDS (CRM)
-- ============================================
CREATE TYPE brand_status AS ENUM ('prospect', 'contacted', 'in_discussion', 'active', 'past', 'blacklisted');

CREATE TABLE public.brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    website TEXT,
    industry TEXT,
    -- Contact
    contact_name TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    contact_role TEXT,
    -- Status
    status brand_status DEFAULT 'prospect',
    -- Social
    instagram_handle TEXT,
    tiktok_handle TEXT,
    linkedin_url TEXT,
    -- Notes
    notes TEXT,
    tags TEXT[],
    -- Stats
    total_deals INTEGER DEFAULT 0,
    total_revenue DECIMAL(12, 2) DEFAULT 0,
    -- Metadata
    logo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- DEALS / COLLABORATIONS
-- ============================================
CREATE TYPE deal_status AS ENUM (
    'lead',
    'contacted',
    'negotiating',
    'proposal_sent',
    'accepted',
    'in_progress',
    'delivered',
    'invoiced',
    'paid',
    'completed',
    'lost',
    'cancelled'
);

CREATE TYPE deal_type AS ENUM ('sponsored_post', 'ugc', 'affiliate', 'ambassador', 'gifted', 'other');
CREATE TYPE payment_status AS ENUM ('pending', 'partial', 'paid', 'overdue', 'cancelled');

CREATE TABLE public.deals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
    -- Deal info
    title TEXT NOT NULL,
    description TEXT,
    deal_type deal_type DEFAULT 'sponsored_post',
    status deal_status DEFAULT 'lead',
    -- Deliverables
    deliverables JSONB DEFAULT '[]',
    deliverables_count INTEGER DEFAULT 1,
    -- Timeline
    start_date DATE,
    end_date DATE,
    deadline DATE,
    -- Financials
    budget DECIMAL(12, 2),
    currency TEXT DEFAULT 'EUR',
    payment_status payment_status DEFAULT 'pending',
    payment_terms TEXT,
    invoice_number TEXT,
    paid_amount DECIMAL(12, 2) DEFAULT 0,
    paid_at TIMESTAMPTZ,
    -- Contract
    contract_url TEXT,
    contract_signed BOOLEAN DEFAULT FALSE,
    contract_signed_at TIMESTAMPTZ,
    -- Notes
    notes TEXT,
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Update ideas to reference deals
ALTER TABLE public.ideas 
    ADD CONSTRAINT fk_ideas_deal 
    FOREIGN KEY (deal_id) REFERENCES public.deals(id) ON DELETE SET NULL;

-- Update planner_items to reference deals
ALTER TABLE public.planner_items 
    ADD CONSTRAINT fk_planner_deal 
    FOREIGN KEY (deal_id) REFERENCES public.deals(id) ON DELETE SET NULL;

-- ============================================
-- TASKS / REMINDERS
-- ============================================
CREATE TYPE task_type AS ENUM ('respond', 'follow_up', 'filming', 'editing', 'review', 'payment', 'meeting', 'other');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');

CREATE TABLE public.tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    -- Related entities
    idea_id UUID REFERENCES public.ideas(id) ON DELETE CASCADE,
    deal_id UUID REFERENCES public.deals(id) ON DELETE CASCADE,
    brand_id UUID REFERENCES public.brands(id) ON DELETE CASCADE,
    email_id UUID, -- Will reference emails
    -- Task info
    title TEXT NOT NULL,
    description TEXT,
    task_type task_type DEFAULT 'other',
    priority task_priority DEFAULT 'medium',
    -- Scheduling
    due_date DATE,
    due_time TIME,
    reminder_at TIMESTAMPTZ,
    -- Status
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- EMAIL ACCOUNTS
-- ============================================
CREATE TYPE email_provider AS ENUM ('gmail', 'imap');

CREATE TABLE public.email_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    email_address TEXT NOT NULL,
    provider email_provider NOT NULL,
    display_name TEXT,
    -- Gmail specific
    google_access_token TEXT,
    google_refresh_token TEXT,
    google_token_expires_at TIMESTAMPTZ,
    -- IMAP specific (encrypted)
    imap_host TEXT,
    imap_port INTEGER DEFAULT 993,
    imap_username TEXT,
    imap_password_encrypted TEXT, -- Encrypted with EMAIL_ENCRYPTION_KEY
    imap_use_tls BOOLEAN DEFAULT TRUE,
    -- Sync status
    last_sync_at TIMESTAMPTZ,
    sync_enabled BOOLEAN DEFAULT TRUE,
    sync_error TEXT,
    -- Metadata
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- EMAIL MESSAGES
-- ============================================
CREATE TABLE public.email_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    email_account_id UUID NOT NULL REFERENCES public.email_accounts(id) ON DELETE CASCADE,
    -- Message identifiers
    message_id TEXT NOT NULL, -- Provider's message ID
    thread_id TEXT, -- Gmail thread ID or IMAP thread reference
    -- Headers
    from_email TEXT NOT NULL,
    from_name TEXT,
    to_emails TEXT[],
    cc_emails TEXT[],
    subject TEXT,
    -- Content
    snippet TEXT, -- Preview text
    body_text TEXT,
    body_html TEXT,
    -- Status
    is_read BOOLEAN DEFAULT FALSE,
    is_starred BOOLEAN DEFAULT FALSE,
    is_archived BOOLEAN DEFAULT FALSE,
    -- Associations
    brand_id UUID REFERENCES public.brands(id) ON DELETE SET NULL,
    deal_id UUID REFERENCES public.deals(id) ON DELETE SET NULL,
    -- Labels/folders
    labels TEXT[],
    folder TEXT,
    -- Dates
    received_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    -- Prevent duplicates
    UNIQUE(email_account_id, message_id)
);

-- Update tasks to reference emails
ALTER TABLE public.tasks 
    ADD CONSTRAINT fk_tasks_email 
    FOREIGN KEY (email_id) REFERENCES public.email_messages(id) ON DELETE SET NULL;

-- ============================================
-- EMAIL TEMPLATES (for copy/paste)
-- ============================================
CREATE TABLE public.email_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    subject TEXT,
    body TEXT NOT NULL,
    category TEXT, -- e.g., 'pitch', 'follow_up', 'negotiation', 'thank_you'
    variables TEXT[], -- Placeholder variables like {{brand_name}}
    is_active BOOLEAN DEFAULT TRUE,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- REVENUE
-- ============================================
CREATE TYPE revenue_source AS ENUM ('sponsorship', 'ugc', 'affiliate', 'adsense', 'product', 'service', 'other');

CREATE TABLE public.revenues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    deal_id UUID REFERENCES public.deals(id) ON DELETE SET NULL,
    brand_id UUID REFERENCES public.brands(id) ON DELETE SET NULL,
    -- Revenue info
    source revenue_source NOT NULL,
    description TEXT,
    amount DECIMAL(12, 2) NOT NULL,
    currency TEXT DEFAULT 'EUR',
    -- Date
    date DATE NOT NULL,
    -- Payment
    is_received BOOLEAN DEFAULT FALSE,
    received_at TIMESTAMPTZ,
    payment_method TEXT,
    invoice_number TEXT,
    -- Metadata
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ANALYTICS SNAPSHOTS (for historical tracking)
-- ============================================
CREATE TABLE public.analytics_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    idea_id UUID REFERENCES public.ideas(id) ON DELETE CASCADE,
    -- Metrics
    platform content_platform,
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    saves INTEGER DEFAULT 0,
    watch_time_seconds INTEGER DEFAULT 0,
    -- Date
    snapshot_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- User ID indexes (for RLS performance)
CREATE INDEX idx_profiles_id ON public.profiles(id);
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_content_pillars_user_id ON public.content_pillars(user_id);
CREATE INDEX idx_categories_user_id ON public.categories(user_id);
CREATE INDEX idx_filming_setups_user_id ON public.filming_setups(user_id);
CREATE INDEX idx_hashtag_groups_user_id ON public.hashtag_groups(user_id);
CREATE INDEX idx_hashtags_user_id ON public.hashtags(user_id);
CREATE INDEX idx_content_types_user_id ON public.content_types(user_id);
CREATE INDEX idx_inspirations_user_id ON public.inspirations(user_id);
CREATE INDEX idx_ideas_user_id ON public.ideas(user_id);
CREATE INDEX idx_script_blocks_user_id ON public.script_blocks(user_id);
CREATE INDEX idx_broll_items_user_id ON public.broll_items(user_id);
CREATE INDEX idx_planner_items_user_id ON public.planner_items(user_id);
CREATE INDEX idx_brands_user_id ON public.brands(user_id);
CREATE INDEX idx_deals_user_id ON public.deals(user_id);
CREATE INDEX idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX idx_email_accounts_user_id ON public.email_accounts(user_id);
CREATE INDEX idx_email_messages_user_id ON public.email_messages(user_id);
CREATE INDEX idx_email_templates_user_id ON public.email_templates(user_id);
CREATE INDEX idx_revenues_user_id ON public.revenues(user_id);
CREATE INDEX idx_analytics_snapshots_user_id ON public.analytics_snapshots(user_id);

-- Status and filtering indexes
CREATE INDEX idx_ideas_status ON public.ideas(status);
CREATE INDEX idx_ideas_pillar_id ON public.ideas(pillar_id);
CREATE INDEX idx_ideas_filming_date ON public.ideas(filming_date);
CREATE INDEX idx_ideas_scheduled_date ON public.ideas(scheduled_date);
CREATE INDEX idx_ideas_created_at ON public.ideas(created_at DESC);

CREATE INDEX idx_deals_status ON public.deals(status);
CREATE INDEX idx_deals_brand_id ON public.deals(brand_id);
CREATE INDEX idx_deals_created_at ON public.deals(created_at DESC);

CREATE INDEX idx_planner_items_date ON public.planner_items(date);
CREATE INDEX idx_planner_items_idea_id ON public.planner_items(idea_id);

CREATE INDEX idx_tasks_due_date ON public.tasks(due_date);
CREATE INDEX idx_tasks_is_completed ON public.tasks(is_completed);

CREATE INDEX idx_email_messages_received_at ON public.email_messages(received_at DESC);
CREATE INDEX idx_email_messages_from_email ON public.email_messages(from_email);
CREATE INDEX idx_email_messages_brand_id ON public.email_messages(brand_id);

CREATE INDEX idx_revenues_date ON public.revenues(date);
CREATE INDEX idx_revenues_source ON public.revenues(source);

CREATE INDEX idx_inspirations_created_at ON public.inspirations(created_at DESC);
CREATE INDEX idx_inspirations_is_processed ON public.inspirations(is_processed);

-- ============================================
-- FUNCTIONS FOR UPDATED_AT
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_pillars_updated_at BEFORE UPDATE ON public.content_pillars FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_filming_setups_updated_at BEFORE UPDATE ON public.filming_setups FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_hashtag_groups_updated_at BEFORE UPDATE ON public.hashtag_groups FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_types_updated_at BEFORE UPDATE ON public.content_types FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inspirations_updated_at BEFORE UPDATE ON public.inspirations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ideas_updated_at BEFORE UPDATE ON public.ideas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_script_blocks_updated_at BEFORE UPDATE ON public.script_blocks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_broll_items_updated_at BEFORE UPDATE ON public.broll_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_planner_items_updated_at BEFORE UPDATE ON public.planner_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_brands_updated_at BEFORE UPDATE ON public.brands FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_deals_updated_at BEFORE UPDATE ON public.deals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_email_accounts_updated_at BEFORE UPDATE ON public.email_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON public.email_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_revenues_updated_at BEFORE UPDATE ON public.revenues FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FUNCTION: Create profile on signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
        NEW.raw_user_meta_data->>'avatar_url'
    );
    
    -- Create free subscription
    INSERT INTO public.subscriptions (user_id, plan, status)
    VALUES (NEW.id, 'free', 'active');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
