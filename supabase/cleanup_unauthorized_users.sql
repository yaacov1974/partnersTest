-- Clean up existing function first
DROP FUNCTION IF EXISTS public.delete_current_unauthorized_user() CASCADE;

-- Highly optimized and verbose Cleanup Function
-- This must be run by a superuser (default in Supabase SQL Editor)
CREATE OR REPLACE FUNCTION public.delete_current_unauthorized_user()
RETURNS text -- Changed to text to return status messages
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public, auth
AS $$
DECLARE
  current_user_id uuid;
  found_email text;
BEGIN
  -- 1. Get the current user ID from the session context
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RETURN 'ERROR: No active session found in auth.uid().';
  END IF;

  -- 2. Check if a profile already exists
  -- If it exists, we definitely DO NOT want to delete the user
  IF EXISTS (SELECT 1 FROM public.profiles WHERE id = current_user_id) THEN
    RETURN 'ABORT: Profile already exists. Deletion prevented.';
  END IF;

  -- 3. Perform the deletion from the auth.users table
  -- We use the ID to ensure we only delete the person who called the function
  DELETE FROM auth.users WHERE id = current_user_id;
  
  RETURN 'SUCCESS: Unauthorized user record deleted.';
EXCEPTION WHEN OTHERS THEN
  RETURN 'EXCEPTION: ' || SQLERRM;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.delete_current_unauthorized_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.delete_current_unauthorized_user() TO service_role;
GRANT EXECUTE ON FUNCTION public.delete_current_unauthorized_user() TO anon; -- Just in case
