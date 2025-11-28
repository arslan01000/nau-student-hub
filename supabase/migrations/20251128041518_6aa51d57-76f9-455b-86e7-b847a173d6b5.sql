-- Fix reviews_view to use security_invoker instead of security_definer
-- This ensures the view uses the querying user's RLS policies

DROP VIEW IF EXISTS public.reviews_view;

CREATE VIEW public.reviews_view
WITH (security_invoker = true)
AS
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
  p.full_name AS professor_name
FROM reviews r
LEFT JOIN professors p ON r.professor_id = p.id;