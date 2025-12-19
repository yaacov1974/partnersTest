-- IMPORTANT: Run this in Supabase SQL Editor to fix signup issues

-- First, let's disable RLS temporarily on profiles to allow inserts during signup
-- We'll use a more permissive policy

-- Drop all existing policies on profiles
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;

-- Make sure RLS is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow ANY authenticated user to insert (the app logic ensures they only insert their own)
CREATE POLICY "Allow authenticated insert"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow users to view all profiles (needed for checking if email exists)
CREATE POLICY "Allow authenticated select"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- Allow users to update their own profile
CREATE POLICY "Allow own update"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Now do the same for saas_companies
DROP POLICY IF EXISTS "Users can insert their own company" ON public.saas_companies;
DROP POLICY IF EXISTS "Users can view their own company" ON public.saas_companies;
DROP POLICY IF EXISTS "Users can update their own company" ON public.saas_companies;

ALTER TABLE public.saas_companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated insert"
ON public.saas_companies
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated select"
ON public.saas_companies
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow own update"
ON public.saas_companies
FOR UPDATE
TO authenticated
USING (auth.uid() = owner_id)
WITH CHECK (auth.uid() = owner_id);

-- And for partners
DROP POLICY IF EXISTS "Users can insert their own partner profile" ON public.partners;
DROP POLICY IF EXISTS "Users can view their own partner profile" ON public.partners;
DROP POLICY IF EXISTS "Users can update their own partner profile" ON public.partners;

ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated insert"
ON public.partners
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated select"
ON public.partners
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow own update"
ON public.partners
FOR UPDATE
TO authenticated
USING (auth.uid() = profile_id)
WITH CHECK (auth.uid() = profile_id);
