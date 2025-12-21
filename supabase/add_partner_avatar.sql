-- Add avatar_url to partners table
ALTER TABLE public.partners 
ADD COLUMN IF NOT EXISTS avatar_url text;

-- Ensure storage bucket 'avatars' exists and is public (idempotent check)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- RLS for avatars bucket (simplistic for now allow authenticated uploads)
CREATE POLICY "Avatar Insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Avatar Select"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');
