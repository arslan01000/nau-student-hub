-- Create post_likes table for tracking discussion likes
CREATE TABLE public.post_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, post_id)
);

-- Create review_likes table for tracking review likes
CREATE TABLE public.review_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  review_id UUID NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, review_id)
);

-- Enable RLS on both tables
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_likes ENABLE ROW LEVEL SECURITY;

-- RLS policies for post_likes
CREATE POLICY "Anyone can view post likes"
ON public.post_likes FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can like posts"
ON public.post_likes FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike their own likes"
ON public.post_likes FOR DELETE
USING (auth.uid() = user_id);

-- RLS policies for review_likes
CREATE POLICY "Anyone can view review likes"
ON public.review_likes FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can like reviews"
ON public.review_likes FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike their own likes"
ON public.review_likes FOR DELETE
USING (auth.uid() = user_id);

-- Add likes_count column to reviews table (posts already has upvotes column)
ALTER TABLE public.reviews ADD COLUMN likes_count INTEGER NOT NULL DEFAULT 0;

-- Function to toggle post like and update count
CREATE OR REPLACE FUNCTION public.toggle_post_like(p_post_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_exists BOOLEAN;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT EXISTS(SELECT 1 FROM post_likes WHERE user_id = v_user_id AND post_id = p_post_id) INTO v_exists;

  IF v_exists THEN
    -- Unlike: remove the like and decrement count
    DELETE FROM post_likes WHERE user_id = v_user_id AND post_id = p_post_id;
    UPDATE posts SET upvotes = GREATEST(upvotes - 1, 0) WHERE id = p_post_id;
    RETURN FALSE;
  ELSE
    -- Like: add the like and increment count
    INSERT INTO post_likes (user_id, post_id) VALUES (v_user_id, p_post_id);
    UPDATE posts SET upvotes = upvotes + 1 WHERE id = p_post_id;
    RETURN TRUE;
  END IF;
END;
$$;

-- Function to toggle review like and update count
CREATE OR REPLACE FUNCTION public.toggle_review_like(p_review_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_exists BOOLEAN;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT EXISTS(SELECT 1 FROM review_likes WHERE user_id = v_user_id AND review_id = p_review_id) INTO v_exists;

  IF v_exists THEN
    -- Unlike: remove the like and decrement count
    DELETE FROM review_likes WHERE user_id = v_user_id AND review_id = p_review_id;
    UPDATE reviews SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = p_review_id;
    RETURN FALSE;
  ELSE
    -- Like: add the like and increment count
    INSERT INTO review_likes (user_id, review_id) VALUES (v_user_id, p_review_id);
    UPDATE reviews SET likes_count = likes_count + 1 WHERE id = p_review_id;
    RETURN TRUE;
  END IF;
END;
$$;