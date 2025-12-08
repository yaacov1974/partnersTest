"use client";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function AffiliateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [checking, setChecking] = useState(true);

  // Define auth pages where we DO NOT need the sidebar OR the onboarding check
  const isAuthPage = pathname?.includes("/login") || pathname?.includes("/signup") || pathname?.includes("/forgot-password") || pathname?.includes("/reset-password") || pathname?.includes("/onboarding");

  useEffect(() => {
    async function checkOnboarding() {
      // 1. If global auth loading is active, wait.
      if (loading) return;

      // 2. If no user, we can stop checking
      if (!user) {
        setChecking(false);
        return;
      }

      // 3. If we are already on an auth/onboarding page, we don't need to force redirect.
      if (isAuthPage) {
        setChecking(false);
        return;
      }

      // 4. User is logged in and trying to access a secure area. Check onboarding.
      try {
        const { data, error } = await supabase
          .from('partners')
          .select('country')
          .eq('profile_id', user.id)
          .single();

        if (error) {
            console.error("Error checking onboarding:", error);
        }

        // If country is null, it means they haven't completed onboarding (since we added it as required)
        if (data && !data.country) {
          router.replace('/affiliate/onboarding');
        } else {
             setChecking(false);
        }
      } catch (err) {
         console.error("Unexpected error in onboarding check:", err);
         setChecking(false);
      }
    }

    checkOnboarding();
  }, [user, loading, isAuthPage, router]);

  if (isAuthPage) {
    return <>{children}</>;
  }

  // Show loading state while determining if we need to redirect
  if (loading || checking) {
      return (
        <div className="flex h-screen items-center justify-center bg-black text-white">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      );
  }

  return (
    <div className="flex h-screen bg-black">
      <Sidebar type="affiliate" />
      <main className="flex-1 overflow-y-auto p-8 bg-black">
        {children}
      </main>
    </div>
  );
}
