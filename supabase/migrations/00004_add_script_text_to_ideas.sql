-- Add script_text column to ideas table for simple script writing
ALTER TABLE ideas ADD COLUMN IF NOT EXISTS script_text text;

-- Add comment
COMMENT ON COLUMN ideas.script_text IS 'Full script text for simple script writing without blocks';
