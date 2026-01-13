-- Add pillar_id column to inspirations table
ALTER TABLE public.inspirations
ADD COLUMN pillar_id UUID REFERENCES public.content_pillars(id) ON DELETE SET NULL;

-- Create index for pillar_id
CREATE INDEX idx_inspirations_pillar_id ON public.inspirations(pillar_id);

-- Add status column if it doesn't exist (it should already exist from previous migrations)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'inspirations' 
        AND column_name = 'status'
    ) THEN
        CREATE TYPE inspiration_status AS ENUM ('pending', 'reviewing', 'approved', 'converted', 'archived');
        ALTER TABLE public.inspirations ADD COLUMN status inspiration_status DEFAULT 'pending';
    END IF;
END $$;
