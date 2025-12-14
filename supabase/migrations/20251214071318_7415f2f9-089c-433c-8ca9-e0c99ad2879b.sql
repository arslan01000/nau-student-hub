-- Add is_anonymous column to replies table
ALTER TABLE public.replies 
ADD COLUMN is_anonymous boolean DEFAULT false;

-- Update existing replies to be non-anonymous
UPDATE public.replies SET is_anonymous = false WHERE is_anonymous IS NULL;