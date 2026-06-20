-- Add platforms array to ideas (stores which platforms the content is posted on)
ALTER TABLE public.ideas ADD COLUMN IF NOT EXISTS platforms TEXT[] DEFAULT '{}';

-- Video analytics: one row per idea × platform, capturing metrics at point of entry
CREATE TABLE IF NOT EXISTS public.video_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  idea_id UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,        -- e.g. 'youtube_shorts', 'tiktok', 'instagram_reels'
  posted_at DATE,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  saves INTEGER DEFAULT 0,
  reach INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  watch_time_minutes INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.video_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own video analytics" ON public.video_analytics
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_video_analytics_user_id ON public.video_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_video_analytics_idea_id ON public.video_analytics(idea_id);
CREATE INDEX IF NOT EXISTS idx_video_analytics_platform ON public.video_analytics(platform);
CREATE INDEX IF NOT EXISTS idx_video_analytics_posted_at ON public.video_analytics(posted_at);
