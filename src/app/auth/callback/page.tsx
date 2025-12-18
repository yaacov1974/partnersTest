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
      // 1. Identify Intent (Prioritize localStorage to prevent URL manipulation)
      const storedIntent = localStorage.getItem("auth_intent");
      const urlAuthMode = searchParams.get('auth_mode');
      const authMode = storedIntent || urlAuthMode || 'login';
      
      // Cleanup intent to avoid side effects on subsequent loads
      localStorage.removeItem("auth_intent");

      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        setError(sessionError.message);
        return;
      }

      if (session) {
        const targetType = next.startsWith('/saas') ? 'saas' : next.startsWith('/affiliate') ? 'affiliate' : null;
        
        // 2. Lookup Profile
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();

        if (!profile) {
            // CASE: NEW USER
            if (authMode === 'login') {
                // ILLEGAL SIGNUP: User is on a login page but doesn't have an account
                await supabase.auth.signOut();
                setError("No account found for this email. Please go to the signup page to create an account.");
                return;
            } else {
                // LEGAL SIGNUP
                if (!targetType) {
                    await supabase.auth.signOut();
                    setError("Invalid signup context.");
                    return;
                }

                try {
                    const { error: insertError } = await supabase.from('profiles').insert({
                        id: session.user.id,
                        email: session.user.email!,
                        role: targetType,
                        marketing_consent: false
                    });
                    if (insertError) throw insertError;

                    if (targetType === 'saas') {
                        await supabase.from('saas_companies').insert({ owner_id: session.user.id, name: 'My Company' });
                    } else {
                        await supabase.from('partners').insert({ profile_id: session.user.id });
                    }
                } catch (err: any) {
                    console.error("Auth Callback Signup Error:", err);
                    await supabase.auth.signOut();
                    setError("Failed to create profile. Please try again.");
                    return;
                }
            }
        } else {
            // CASE: EXISTING USER
            if (targetType && profile.role !== targetType) {
                await supabase.auth.signOut();
                setError(`Invalid account type. You are registered as ${profile.role}, but trying to access ${targetType} dashboard.`);
                return;
            }
        }

        // 3. Success
        router.push(next);
      } else {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          if (event === 'SIGNED_IN' && session) {
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
