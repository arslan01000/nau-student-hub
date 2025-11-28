-- Drop existing posts_view
DROP VIEW IF EXISTS public.posts_view;

-- Recreate posts_view with display_name from profiles
CREATE VIEW public.posts_view AS
SELECT 
  p.id,
  p.title,
  p.content,
  p.category,
  p.is_anonymous,
  p.upvotes,
  p.user_id,
  p.created_at,
  CASE 
    WHEN p.is_anonymous THEN NULL 
    ELSE pr.display_name 
  END as display_name,
  (SELECT COUNT(*) FROM public.replies WHERE post_id = p.id) as reply_count
FROM public.posts p
LEFT JOIN public.profiles pr ON p.user_id = pr.id;

-- Grant access to authenticated and anon roles
GRANT SELECT ON public.posts_view TO authenticated;
GRANT SELECT ON public.posts_view TO anon;