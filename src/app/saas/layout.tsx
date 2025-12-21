"use client";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";

export default function SaaSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [checking, setChecking] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Define auth pages where we DO NOT need the sidebar OR the onboarding check
  const isAuthPage = pathname?.includes("/login") || pathname?.includes("/signup") || pathname?.includes("/forgot-password") || pathname?.includes("/reset-password") || pathname?.includes("/onboarding");

  useEffect(() => {
    async function checkOnboarding() {
      // 1. If global auth loading is active, wait.
      if (loading) return;

      // 2. If no user, we can stop checking (page will likely handle redirect or show public content)
      if (!user) {
        setChecking(false);
        return;
      }

      // 3. If we are already on an auth/onboarding page, we don't need to force redirect.
      if (isAuthPage) {
        setChecking(false);
        return;
      }

      // 4. User is logged in and trying to access a secure area (Dashboard). Check if they finished onboarding.
      try {
        const { data, error } = await supabase
          .from('saas_companies')
          .select('website')
          .eq('owner_id', user.id)
          .maybeSingle();

        if (error) {
            console.error("Error checking onboarding:", error);
            setChecking(false);
            return;
        }

        // If no company record or website is null, they need onboarding
        if (!data || !data.website) {
          router.replace('/saas/onboarding');
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
    <div className="flex h-screen bg-black flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <Sidebar type="saas" className="hidden md:flex" />

      {/* Mobile Header */}
      <div className="flex md:hidden h-16 w-full items-center border-b border-white/10 px-4 bg-black flex-shrink-0">
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)} className="text-zinc-400 hover:text-white">
             <Menu className="h-6 w-6" />
          </Button>
          <Link href="/" className="ml-4">
            <span className="text-xl font-bold tracking-tight text-white">Partnerz.ai</span>
          </Link>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
             <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
             <div className="relative flex h-full"> 
                <Sidebar type="saas" className="w-64 border-r border-white/10" onClose={() => setIsMobileMenuOpen(false)} />
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 -right-12 text-white bg-zinc-800 rounded-full p-2 h-10 w-10 border border-zinc-700" 
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    <X className="h-5 w-5" />
                </Button>
             </div>
        </div>
      )}

      <main className="flex-1 overflow-y-auto bg-black">
        <div className="p-4 md:p-8 min-h-[calc(100vh-4rem)]">
          {children}
        </div>
        <Footer />
      </main>
    </div>
  );
}
