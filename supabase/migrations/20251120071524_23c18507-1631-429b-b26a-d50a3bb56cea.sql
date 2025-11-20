-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policy: users can view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- RLS policy: admins can view all roles
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create playbooks table
CREATE TABLE public.playbooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  tags TEXT[] NOT NULL,
  author_name TEXT NOT NULL,
  author_major TEXT,
  author_grad_year TEXT,
  body TEXT NOT NULL,
  external_links TEXT[],
  views INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'published', 'rejected')),
  author_id UUID NOT NULL,
  reviewed_by UUID,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on playbooks
ALTER TABLE public.playbooks ENABLE ROW LEVEL SECURITY;

-- RLS policy: everyone can view published playbooks
CREATE POLICY "Anyone can view published playbooks"
ON public.playbooks
FOR SELECT
USING (status = 'published');

-- RLS policy: users can view their own submissions
CREATE POLICY "Users can view their own playbooks"
ON public.playbooks
FOR SELECT
TO authenticated
USING (auth.uid() = author_id);

-- RLS policy: admins can view all playbooks
CREATE POLICY "Admins can view all playbooks"
ON public.playbooks
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS policy: authenticated users can create playbooks
CREATE POLICY "Authenticated users can create playbooks"
ON public.playbooks
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = author_id);

-- RLS policy: admins can update playbooks
CREATE POLICY "Admins can update playbooks"
ON public.playbooks
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS policy: users can update their own pending playbooks
CREATE POLICY "Users can update their own pending playbooks"
ON public.playbooks
FOR UPDATE
TO authenticated
USING (auth.uid() = author_id AND status = 'pending');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for playbooks updated_at
CREATE TRIGGER update_playbooks_updated_at
BEFORE UPDATE ON public.playbooks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to increment playbook views
CREATE OR REPLACE FUNCTION public.increment_playbook_views(playbook_id UUID)
RETURNS VOID
LANGUAGE SQL
AS $$
  UPDATE public.playbooks
  SET views = views + 1
  WHERE id = playbook_id AND status = 'published';
$$;