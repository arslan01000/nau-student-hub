-- Create a secure view that masks user_id for anonymous posts
CREATE OR REPLACE VIEW public.posts_view AS
SELECT
  id,
  title,
  content,
  category,
  CASE 
    WHEN is_anonymous = true THEN NULL
    ELSE user_id
  END AS user_id,
  is_anonymous,
  upvotes,
  created_at
FROM public.posts;

-- Enable RLS on the view
ALTER VIEW public.posts_view SET (security_invoker = true);

-- Grant select access to authenticated and anon users
GRANT SELECT ON public.posts_view TO authenticated, anon;

-- Create a function to insert posts (handles user_id automatically)
CREATE OR REPLACE FUNCTION public.create_post(
  p_title TEXT,
  p_content TEXT,
  p_category post_category,
  p_is_anonymous BOOLEAN DEFAULT false
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_post_id uuid;
BEGIN
  INSERT INTO public.posts (title, content, category, user_id, is_anonymous)
  VALUES (p_title, p_content, p_category, auth.uid(), p_is_anonymous)
  RETURNING id INTO v_post_id;
  
  RETURN v_post_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.create_post TO authenticated;