-- Enable RLS on profiles table (if not already enabled)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Allow users to insert their own profile during signup
CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Allow users to view their own profile
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Enable RLS on saas_companies table
ALTER TABLE public.saas_companies ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can insert their own company" ON public.saas_companies;
DROP POLICY IF EXISTS "Users can view their own company" ON public.saas_companies;
DROP POLICY IF EXISTS "Users can update their own company" ON public.saas_companies;

-- Allow users to insert their own company
CREATE POLICY "Users can insert their own company"
ON public.saas_companies
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = owner_id);

-- Allow users to view their own company
CREATE POLICY "Users can view their own company"
ON public.saas_companies
FOR SELECT
TO authenticated
USING (auth.uid() = owner_id);

-- Allow users to update their own company
CREATE POLICY "Users can update their own company"
ON public.saas_companies
FOR UPDATE
TO authenticated
USING (auth.uid() = owner_id)
WITH CHECK (auth.uid() = owner_id);

-- Enable RLS on partners table
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can insert their own partner profile" ON public.partners;
DROP POLICY IF EXISTS "Users can view their own partner profile" ON public.partners;
DROP POLICY IF EXISTS "Users can update their own partner profile" ON public.partners;

-- Allow users to insert their own partner profile
CREATE POLICY "Users can insert their own partner profile"
ON public.partners
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = profile_id);

-- Allow users to view their own partner profile
CREATE POLICY "Users can view their own partner profile"
ON public.partners
FOR SELECT
TO authenticated
USING (auth.uid() = profile_id);

-- Allow users to update their own partner profile
CREATE POLICY "Users can update their own partner profile"
ON public.partners
FOR UPDATE
TO authenticated
USING (auth.uid() = profile_id)
WITH CHECK (auth.uid() = profile_id);
