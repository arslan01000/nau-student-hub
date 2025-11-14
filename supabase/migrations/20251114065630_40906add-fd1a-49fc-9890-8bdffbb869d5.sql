-- Add display_name to profiles table
ALTER TABLE public.profiles ADD COLUMN display_name TEXT;

-- Add is_anonymous to reviews table
ALTER TABLE public.reviews ADD COLUMN is_anonymous BOOLEAN DEFAULT false;

-- Create reviews_view that masks user_id when is_anonymous is true
CREATE OR REPLACE VIEW public.reviews_view AS
SELECT
  id,
  professor_name,
  course_code,
  rating,
  text,
  created_at,
  CASE 
    WHEN is_anonymous = true THEN NULL
    ELSE user_id
  END AS user_id,
  is_anonymous
FROM public.reviews;

-- Enable RLS on reviews_view
ALTER VIEW public.reviews_view SET (security_invoker = true);

-- Grant select on reviews_view to authenticated and anon users
GRANT SELECT ON public.reviews_view TO authenticated, anon;