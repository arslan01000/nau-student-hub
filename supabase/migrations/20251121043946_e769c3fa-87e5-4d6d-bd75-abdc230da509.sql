-- Step 1: Clean up duplicate reviews (keep only the most recent review per user-professor pair)
DELETE FROM public.reviews
WHERE id IN (
  SELECT id
  FROM (
    SELECT id,
           ROW_NUMBER() OVER (PARTITION BY user_id, professor_id ORDER BY created_at DESC) as row_num
    FROM public.reviews
  ) ranked
  WHERE row_num > 1
);

-- Step 2: Now add the unique constraint
ALTER TABLE public.reviews
  ADD CONSTRAINT reviews_user_professor_unique UNIQUE (user_id, professor_id);

-- Step 3: Update playbooks table for approval flow
ALTER TABLE public.playbooks
  RENAME COLUMN reviewed_by TO approved_by;

ALTER TABLE public.playbooks
  RENAME COLUMN reviewed_at TO approved_at;

-- Update status check constraint
ALTER TABLE public.playbooks
  DROP CONSTRAINT IF EXISTS playbooks_status_check;

ALTER TABLE public.playbooks
  ADD CONSTRAINT playbooks_status_check CHECK (status IN ('pending', 'approved', 'rejected'));

-- Step 4: Create contact_messages table
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Step 5: Update RLS policies

-- Playbooks policies
DROP POLICY IF EXISTS "Admins can view all playbooks" ON public.playbooks;
CREATE POLICY "Admins can view all playbooks"
  ON public.playbooks
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role));

DROP POLICY IF EXISTS "Admins can update playbooks" ON public.playbooks;
CREATE POLICY "Admins can update playbooks"
  ON public.playbooks
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role));

DROP POLICY IF EXISTS "Anyone can view published playbooks" ON public.playbooks;
CREATE POLICY "Anyone can view approved playbooks"
  ON public.playbooks
  FOR SELECT
  USING (status = 'approved');

-- Reviews policies
CREATE POLICY "Admins can view all reviews"
  ON public.reviews
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role));

CREATE POLICY "Admins can delete reviews"
  ON public.reviews
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role));

-- Contact messages policies
CREATE POLICY "Anyone can submit contact messages"
  ON public.contact_messages
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view contact messages"
  ON public.contact_messages
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role));

-- TODO: To make yourself admin, run this in the SQL editor:
-- INSERT INTO public.user_roles (user_id, role)
-- VALUES ('YOUR-USER-ID-HERE', 'admin'::app_role)
-- ON CONFLICT DO NOTHING;