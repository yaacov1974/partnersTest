'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/';
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const authMode = searchParams.get('auth_mode') || 'login';
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        setError(sessionError.message);
        return;
      }

      if (session) {
        // 1. Establish the context
        const targetType = next.startsWith('/saas') ? 'saas' : next.startsWith('/affiliate') ? 'affiliate' : null;
        
        // 2. Check for existing profile
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle(); // maybeSingle returns null if not found instead of crashing

        if (!profile) {
            // PROFILE NOT FOUND
            if (authMode === 'login') {
                // If they are on the LOGIN page, we DO NOT allow them to create a new account
                await supabase.auth.signOut();
                setError("No account found with this email. Please sign up first if you're new here.");
                return;
            } else {
                // SIGN UP MODE: We are allowed to create an account
                if (!targetType) {
                    await supabase.auth.signOut();
                    setError("Invalid signup context.");
                    return;
                }

                try {
                    // Create Profile
                    const { error: insertError } = await supabase.from('profiles').insert({
                        id: session.user.id,
                        email: session.user.email!,
                        role: targetType,
                        marketing_consent: false
                    });
                    if (insertError) throw insertError;

                    // Create Role-specific table entry
                    if (targetType === 'saas') {
                        await supabase.from('saas_companies').insert({ owner_id: session.user.id, name: 'My Company' });
                    } else {
                        await supabase.from('partners').insert({ profile_id: session.user.id });
                    }
                } catch (err: any) {
                    console.error("Critical error creating profile on OAuth signup:", err);
                    await supabase.auth.signOut();
                    setError("Failed to initialize your account. Please try again.");
                    return;
                }
            }
        } else {
            // PROFILE EXISTS: Check if role matches the login page they are on
            if (targetType && profile.role !== targetType) {
                await supabase.auth.signOut();
                setError(`Invalid account type. You are trying to log in as ${targetType}, but your account is registered as ${profile.role}.`);
                return;
            }
        }

        // 3. Success! Redirect to target page
        router.push(next);
      } else {
        // If no session found yet (rare for OAuth but possible), set up a listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          if (event === 'SIGNED_IN' && session) {
             // We just re-run the main logic by reloading the logic (re-invoking useEffect or just calling it)
             window.location.reload(); 
          }
        });
        return () => subscription.unsubscribe();
      }
    };

    handleCallback();
  }, [router, next, searchParams]);

  if (error) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
          <div className="rounded-lg bg-red-500/10 p-4 text-red-500">
            <h3 className="mb-2 font-semibold">Authentication Error</h3>
            <p>{error}</p>
            <button 
                onClick={() => router.push('/login')}
                className="mt-4 rounded bg-zinc-800 px-4 py-2 text-sm hover:bg-zinc-700"
            >
                Return to Login
            </button>
          </div>
        </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-zinc-400">Verifying your account...</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-zinc-400">Loading...</p>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}
