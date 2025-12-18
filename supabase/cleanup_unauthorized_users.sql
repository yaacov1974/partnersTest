-- This function allows a user to delete their own auth record 
-- ONLY if they do not yet have an application profile.
-- This is used to clean up "accidental" registrations when someone
-- clicks "Sign In with Google" but hasn't signed up yet.

CREATE OR REPLACE FUNCTION public.delete_current_unauthorized_user()
RETURNS void AS $$
BEGIN
  -- Security check: Only delete if the user has NO profile record
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid()) THEN
    DELETE FROM auth.users WHERE id = auth.uid();
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant access to the function for authenticated users
GRANT EXECUTE ON FUNCTION public.delete_current_unauthorized_user() TO authenticated;
