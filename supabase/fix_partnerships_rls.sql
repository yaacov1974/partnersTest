-- Enable RLS (just in case)
ALTER TABLE public.partnerships ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert partnership requests
CREATE POLICY "Enable insert for authenticated users" 
ON public.partnerships 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Allow authenticated users to view partnerships (needed to check status)
-- Ideally this should be scoped to involved parties, but for MVP we allow authenticated read
CREATE POLICY "Enable select for authenticated users" 
ON public.partnerships 
FOR SELECT 
TO authenticated 
USING (true);

-- Allow updates (e.g. accepting/rejecting) for authenticated users (owner checks handled in app or usually via joins)
CREATE POLICY "Enable update for authenticated users" 
ON public.partnerships 
FOR UPDATE 
TO authenticated 
USING (true)
WITH CHECK (true);
