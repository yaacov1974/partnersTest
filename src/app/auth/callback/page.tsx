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
        window.location.href = `/login?error=${encodeURIComponent(sessionError.message)}`;
        return;
      }

      if (session) {
        const targetType = next.startsWith('/saas') ? 'saas' : next.startsWith('/affiliate') ? 'affiliate' : 'saas';
        const loginPage = `/${targetType}/login`;
        
        // 1. Check for profile
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();

        if (!profile) {
            // AUTO-SIGNUP: If user authenticated with Google but has no profile, create one.
            if (!targetType) {
                await supabase.auth.signOut();
                window.location.href = `/${targetType || 'saas'}/login?error=${encodeURIComponent("Invalid context for automatic account creation.")}`;
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
                console.error("Auto-Signup failed:", err);
                await supabase.auth.signOut();
                window.location.href = `/${targetType}/login?error=${encodeURIComponent("Failed to initialize your account automatically.")}`;
                return;
            }
        } else {
            // EXISTING USER: Verify role matches the page they are on
            if (targetType && profile.role !== targetType) {
                await supabase.auth.signOut();
                window.location.href = `/${targetType}/login?error=${encodeURIComponent(`Account mismatch: You are registered as ${profile.role}`)}`;
                return;
            }
        }

        // Redirect to dashboard (or next)
        window.location.href = next;
      } else {
        // Handle race conditions where session is not immediately available
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
