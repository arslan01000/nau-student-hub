-- Drop the reviews_view since it depends on professor_name
DROP VIEW IF EXISTS public.reviews_view;

-- Now we can drop the professor_name column
ALTER TABLE public.reviews
DROP COLUMN IF EXISTS professor_name;

-- Recreate reviews_view without professor_name
CREATE OR REPLACE VIEW public.reviews_view AS
SELECT 
  r.id,
  r.user_id,
  r.professor_id,
  r.course_code,
  r.text,
  r.rating,
  r.overall_rating,
  r.difficulty_rating,
  r.grade_received,
  r.would_take_again,
  r.is_anonymous,
  r.created_at,
  p.full_name as professor_name
FROM public.reviews r
LEFT JOIN public.professors p ON r.professor_id = p.id;