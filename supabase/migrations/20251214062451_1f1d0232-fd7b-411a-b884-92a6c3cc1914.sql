-- Fix search_path for normalize_professor_name function
CREATE OR REPLACE FUNCTION public.normalize_professor_name(name text)
RETURNS text
LANGUAGE sql
IMMUTABLE
SET search_path = public
AS $$
  SELECT lower(trim(regexp_replace(regexp_replace(name, '[^a-zA-Z\s]', '', 'g'), '\s+', ' ', 'g')))
$$;