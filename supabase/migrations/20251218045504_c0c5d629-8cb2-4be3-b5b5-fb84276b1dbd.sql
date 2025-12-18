-- Create table for course suggestions
CREATE TABLE public.course_suggestions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  department TEXT,
  submitted_by_user_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.course_suggestions ENABLE ROW LEVEL SECURITY;

-- Users can submit course suggestions
CREATE POLICY "Authenticated users can submit course suggestions"
ON public.course_suggestions
FOR INSERT
WITH CHECK (auth.uid() = submitted_by_user_id);

-- Users can view their own suggestions
CREATE POLICY "Users can view their own suggestions"
ON public.course_suggestions
FOR SELECT
USING (auth.uid() = submitted_by_user_id);

-- Admins can view all suggestions
CREATE POLICY "Admins can view all course suggestions"
ON public.course_suggestions
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role));

-- Admins can update suggestions (approve/reject)
CREATE POLICY "Admins can update course suggestions"
ON public.course_suggestions
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role));