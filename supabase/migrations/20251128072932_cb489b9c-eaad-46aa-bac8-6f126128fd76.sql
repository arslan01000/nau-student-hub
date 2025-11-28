-- ==========================================
-- SECURITY FIX PART 2: Handle views properly
-- ==========================================

-- Views inherit RLS from their base tables, so we need to ensure
-- the base table policies are correct

-- Drop the problematic views and recreate them with security in mind
DROP VIEW IF EXISTS public.posts_view CASCADE;
DROP VIEW IF EXISTS public.reviews_view CASCADE;

-- Recreate posts_view - it will inherit RLS from posts table
CREATE VIEW public.posts_view AS
SELECT 
  id,
  title,
  content,
  category,
  user_id,
  is_anonymous,
  upvotes,
  created_at
FROM public.posts;

-- Recreate reviews_view with professor name join
CREATE VIEW public.reviews_view AS
SELECT 
  r.id,
  r.course_code,
  r.text,
  r.rating,
  r.overall_rating,
  r.difficulty_rating,
  r.grade_received,
  r.would_take_again,
  r.is_anonymous,
  r.user_id,
  r.professor_id,
  r.created_at,
  p.full_name as professor_name
FROM public.reviews r
LEFT JOIN public.professors p ON r.professor_id = p.id;

-- Grant access to authenticated users
GRANT SELECT ON public.posts_view TO authenticated;
GRANT SELECT ON public.reviews_view TO authenticated;
GRANT SELECT ON public.posts_view TO anon;
GRANT SELECT ON public.reviews_view TO anon;