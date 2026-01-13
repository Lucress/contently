# Apply Pillar Migration to Supabase

To add pillar support to the inspirations table, run the following SQL in your Supabase SQL Editor:

```sql
-- Add pillar_id column to inspirations table
ALTER TABLE public.inspirations
ADD COLUMN pillar_id UUID REFERENCES public.content_pillars(id) ON DELETE SET NULL;

-- Create index for pillar_id
CREATE INDEX idx_inspirations_pillar_id ON public.inspirations(pillar_id);
```

This migration will:
1. Add a `pillar_id` column to the `inspirations` table
2. Create a foreign key relationship with the `content_pillars` table
3. Add an index for better query performance

After running this migration, you can:
- Select a content pillar when creating an inspiration
- View the pillar badge on inspiration cards
- The pillar will be displayed with its custom color
