-- Add status field to inspirations table
-- ============================================

-- Create inspiration_status enum type
CREATE TYPE inspiration_status AS ENUM (
    'pending',      -- Just captured, needs review
    'reviewing',    -- Being reviewed for potential
    'approved',     -- Approved, ready to convert to idea
    'converted',    -- Already converted to an idea
    'archived'      -- Not relevant anymore
);

-- Add status column to inspirations table
ALTER TABLE public.inspirations 
ADD COLUMN status inspiration_status DEFAULT 'pending';

-- Create index for status filtering
CREATE INDEX idx_inspirations_status ON public.inspirations(status);

-- Update existing rows to have 'converted' status if they were processed
UPDATE public.inspirations 
SET status = 'converted' 
WHERE is_processed = TRUE;

-- Update existing rows to have 'pending' status if they were not processed
UPDATE public.inspirations 
SET status = 'pending' 
WHERE is_processed = FALSE;
