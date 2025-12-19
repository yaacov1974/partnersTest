-- TEMPORARY FIX: Disable RLS entirely for debugging
-- Run this in Supabase SQL Editor

-- Disable RLS on all three tables
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.saas_companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.partners DISABLE ROW LEVEL SECURITY;

-- This will allow all operations. After signup works, we can re-enable with proper policies.
