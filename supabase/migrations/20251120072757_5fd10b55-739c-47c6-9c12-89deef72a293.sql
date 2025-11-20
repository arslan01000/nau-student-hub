-- Create professors table
CREATE TABLE public.professors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  department TEXT NOT NULL,
  school TEXT NOT NULL DEFAULT 'North American University',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on professors
ALTER TABLE public.professors ENABLE ROW LEVEL SECURITY;

-- Everyone can view professors
CREATE POLICY "Professors viewable by everyone"
ON public.professors
FOR SELECT
USING (true);

-- Authenticated users can create professors (when submitting first review)
CREATE POLICY "Authenticated users can create professors"
ON public.professors
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Add new columns to reviews table
ALTER TABLE public.reviews 
ADD COLUMN IF NOT EXISTS professor_id UUID REFERENCES public.professors(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS overall_rating INTEGER,
ADD COLUMN IF NOT EXISTS difficulty_rating INTEGER CHECK (difficulty_rating >= 1 AND difficulty_rating <= 5),
ADD COLUMN IF NOT EXISTS grade_received TEXT,
ADD COLUMN IF NOT EXISTS would_take_again BOOLEAN;

-- Migrate existing rating to overall_rating and set defaults for new reviews
UPDATE public.reviews 
SET overall_rating = rating 
WHERE overall_rating IS NULL;

-- Add trigger for professors updated_at
CREATE TRIGGER update_professors_updated_at
BEFORE UPDATE ON public.professors
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index on professor_id for faster queries
CREATE INDEX IF NOT EXISTS idx_reviews_professor_id ON public.reviews(professor_id);