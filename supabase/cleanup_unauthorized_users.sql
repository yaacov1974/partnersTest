-- Clean up existing function first to allow return type changes
DROP FUNCTION IF EXISTS public.delete_current_unauthorized_user() CASCADE;

-- Optimized Cleanup Function
-- Ensure this is run by a superuser (default in Supabase SQL Editor)
CREATE OR REPLACE FUNCTION public.delete_current_unauthorized_user()
RETURNS boolean 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public, auth
AS $$
DECLARE
  current_user_id uuid;
BEGIN
  current_user_id := auth.uid();
  
  -- If not logged in, we can't do anything
  IF current_user_id IS NULL THEN
    RETURN false;
  END IF;

  -- CRITICAL: Only delete if they HAVE NO profile.
  -- This prevents accidental deletion of real users.
  IF EXISTS (SELECT 1 FROM public.profiles WHERE id = current_user_id) THEN
    RETURN false;
  END IF;

  -- Delete from auth.users (SECURITY DEFINER allows this)
  DELETE FROM auth.users WHERE id = current_user_id;
  
  RETURN true;
END;
$$;

-- Ensure authenticated users can call it (they are authenticated at the moment of callback)
GRANT EXECUTE ON FUNCTION public.delete_current_unauthorized_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.delete_current_unauthorized_user() TO service_role;
