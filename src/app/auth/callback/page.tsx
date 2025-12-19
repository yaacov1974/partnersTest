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
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        window.location.href = `/${next.includes('affiliate') ? 'affiliate' : 'saas'}/login?error=${encodeURIComponent(sessionError.message)}`;
        return;
      }

      if (session) {
        // Robustly determine the target type (check URL preference, then user metadata)
        const metadataRole = session.user.user_metadata?.role;
        const urlType = next.toLowerCase().includes('/affiliate') ? 'affiliate' : 
                        next.toLowerCase().includes('/saas') ? 'saas' : null;
        
        const targetType = urlType || metadataRole || 'saas';
        const loginPage = `/${targetType}/login`;
        
        // 1. Check for profile
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();

        if (!profile) {
            // NEW USER: Auto-create profile
            try {
                // Create Profile
                const { error: insertError } = await supabase.from('profiles').upsert({
                    id: session.user.id,
                    email: session.user.email!,
                    role: targetType,
                    marketing_consent: false
                });
                
                if (insertError) throw insertError;

                // Create Role-specific table entry
                if (targetType === 'saas') {
                    await supabase.from('saas_companies').upsert({ 
                        owner_id: session.user.id, 
                        name: 'My Company' 
                    }, { onConflict: 'owner_id' });
                } else {
                    await supabase.from('partners').upsert({ 
                        profile_id: session.user.id 
                    }, { onConflict: 'profile_id' });
                }
            } catch (err: any) {
                console.error("Auto-Signup Error:", err);
                await supabase.auth.signOut();
                window.location.href = `${loginPage}?error=${encodeURIComponent("Account initialization failed.")}`;
                return;
            }
        } else {
            // EXISTING USER: Role validation
            if (profile.role !== targetType) {
                await supabase.auth.signOut();
                window.location.href = `${loginPage}?error=${encodeURIComponent(`Role mismatch: Registered as ${profile.role}`)}`;
                return;
            }
        }

        // SUCCESS: Final Redirection
        // Use window.location.href for a full refresh to ensure AuthContext/Layouts 
        // immediately recognize the new session and profile.
        window.location.href = next;
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
