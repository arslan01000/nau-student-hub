-- Add soft moderation columns to professors table
ALTER TABLE public.professors 
ADD COLUMN IF NOT EXISTS name_normalized text,
ADD COLUMN IF NOT EXISTS created_by_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS source text DEFAULT 'system';

-- Create index on normalized name for fast duplicate lookups
CREATE INDEX IF NOT EXISTS idx_professors_name_normalized ON public.professors(name_normalized);

-- Create function to normalize professor names (lowercase, trim, remove extra spaces/punctuation)
CREATE OR REPLACE FUNCTION public.normalize_professor_name(name text)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT lower(trim(regexp_replace(regexp_replace(name, '[^a-zA-Z\s]', '', 'g'), '\s+', ' ', 'g')))
$$;

-- Create trigger to auto-populate name_normalized on insert/update
CREATE OR REPLACE FUNCTION public.set_professor_name_normalized()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.name_normalized := normalize_professor_name(NEW.full_name);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS professor_normalize_name_trigger ON public.professors;
CREATE TRIGGER professor_normalize_name_trigger
  BEFORE INSERT OR UPDATE ON public.professors
  FOR EACH ROW
  EXECUTE FUNCTION public.set_professor_name_normalized();

-- Backfill existing professors with normalized names
UPDATE public.professors 
SET name_normalized = normalize_professor_name(full_name)
WHERE name_normalized IS NULL;

-- Add unique constraint on normalized name to prevent exact duplicates
ALTER TABLE public.professors 
ADD CONSTRAINT professors_name_normalized_unique UNIQUE (name_normalized);