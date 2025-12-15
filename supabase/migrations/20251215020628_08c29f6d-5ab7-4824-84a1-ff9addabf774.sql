-- Create courses table
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Everyone can view courses
CREATE POLICY "Courses viewable by everyone"
ON public.courses
FOR SELECT
USING (true);

-- Seed initial courses
INSERT INTO public.courses (code, name, department) VALUES
  ('COMP 1301', 'Introduction to Computer Science', 'Computer Science'),
  ('COMP 1302', 'Discrete Mathematics', 'Computer Science'),
  ('COMP 2301', 'Data Structures', 'Computer Science'),
  ('COMP 2302', 'Computer Organization', 'Computer Science'),
  ('COMP 3301', 'Algorithms', 'Computer Science'),
  ('COMP 3302', 'Database Systems', 'Computer Science'),
  ('COMP 3303', 'Operating Systems', 'Computer Science'),
  ('COMP 3322', 'Software Engineering', 'Computer Science'),
  ('COMP 4301', 'Computer Networks', 'Computer Science'),
  ('COMP 4302', 'Artificial Intelligence', 'Computer Science'),
  ('COMP 4303', 'Machine Learning', 'Computer Science'),
  ('COMP 4399', 'Senior Project', 'Computer Science'),
  ('BUSN 1301', 'Introduction to Business', 'Business Administration'),
  ('BUSN 2301', 'Principles of Management', 'Business Administration'),
  ('BUSN 2302', 'Principles of Marketing', 'Business Administration'),
  ('BUSN 3301', 'Business Law', 'Business Administration'),
  ('BUSN 3302', 'Organizational Behavior', 'Business Administration'),
  ('BUSN 4301', 'Strategic Management', 'Business Administration'),
  ('ACCT 2301', 'Financial Accounting', 'Accounting'),
  ('ACCT 2302', 'Managerial Accounting', 'Accounting'),
  ('ACCT 3301', 'Intermediate Accounting I', 'Accounting'),
  ('ACCT 3302', 'Intermediate Accounting II', 'Accounting'),
  ('FINC 3301', 'Corporate Finance', 'Finance'),
  ('FINC 3302', 'Investments', 'Finance'),
  ('FINC 4301', 'Financial Markets', 'Finance'),
  ('MATH 1301', 'College Algebra', 'Mathematics'),
  ('MATH 1302', 'Precalculus', 'Mathematics'),
  ('MATH 2301', 'Calculus I', 'Mathematics'),
  ('MATH 2302', 'Calculus II', 'Mathematics'),
  ('MATH 3301', 'Linear Algebra', 'Mathematics'),
  ('MATH 3302', 'Probability and Statistics', 'Mathematics'),
  ('ENGL 1301', 'English Composition I', 'English'),
  ('ENGL 1302', 'English Composition II', 'English'),
  ('ENGL 2301', 'World Literature I', 'English'),
  ('ENGL 2302', 'World Literature II', 'English'),
  ('EDUC 2301', 'Foundations of Education', 'Education'),
  ('EDUC 3301', 'Educational Psychology', 'Education'),
  ('EDUC 3302', 'Curriculum Development', 'Education'),
  ('EDUC 4301', 'Classroom Management', 'Education'),
  ('EDUC 4302', 'Student Teaching', 'Education'),
  ('COMM 1301', 'Public Speaking', 'Communications'),
  ('COMM 2301', 'Interpersonal Communication', 'Communications'),
  ('PHYS 1301', 'General Physics I', 'General Education'),
  ('PHYS 1302', 'General Physics II', 'General Education'),
  ('HIST 1301', 'US History I', 'General Education'),
  ('HIST 1302', 'US History II', 'General Education'),
  ('GOVT 2301', 'American Government', 'General Education'),
  ('ECON 2301', 'Principles of Macroeconomics', 'General Education'),
  ('ECON 2302', 'Principles of Microeconomics', 'General Education');