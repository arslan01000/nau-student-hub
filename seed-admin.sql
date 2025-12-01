-- Seed Admin User Script
-- 
-- Instructions:
-- 1. Replace 'YOUR-USER-ID-HERE' with your actual user ID from auth.users
-- 2. Run this in your project's SQL editor (e.g., Supabase SQL Editor)
--
-- To find your user ID:
-- SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';

-- Grant admin role to your user
INSERT INTO public.user_roles (user_id, role)
VALUES (
  'YOUR-USER-ID-HERE',   -- Replace with your actual user ID
  'admin'::app_role
)
ON CONFLICT DO NOTHING;

-- Verify it worked:
-- SELECT * FROM public.user_roles WHERE user_id = 'YOUR-USER-ID-HERE';
