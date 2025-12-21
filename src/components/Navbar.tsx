"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export function Navbar() {
  const { user, session, loading, signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    window.location.href = "/";
  };

  // Get user role from session metadata. IF undefined, it means they haven't selected a role yet.
  const userRole = session?.user?.user_metadata?.role;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl supports-[backdrop-filter]:bg-black/20">
      <div className="container mx-auto flex h-auto min-h-16 items-center justify-between px-4 py-3 md:py-0 md:h-16">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-lg font-bold text-white">P</span>
            </span>
            <span className="text-xl font-bold tracking-tight text-white">Partnerz.ai</span>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <Link href="#how-it-works" className="text-sm font-medium text-zinc-400 transition-colors hover:text-white">
            How it Works
          </Link>
          <Link href="#ecosystem" className="text-sm font-medium text-zinc-400 transition-colors hover:text-white">
            Ecosystem
          </Link>
          <Link href="#features" className="text-sm font-medium text-zinc-400 transition-colors hover:text-white">
            Features
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
          {!loading && user ? (
            <>
              <Button asChild className="bg-primary hover:bg-primary/90 text-xs sm:text-sm">
                <Link href={userRole ? `/${userRole}/dashboard` : "/onboarding/role-selection"}>
                  {userRole ? "Dashboard" : "Complete Setup"}
                </Link>
              </Button>
              <Button 
                variant="outline" 
                className="border-white/10 bg-transparent text-white hover:bg-white/5 text-xs sm:text-sm"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button asChild variant="outline" className="border-primary/50 bg-transparent text-white hover:bg-primary/10 hover:border-primary text-xs sm:text-sm whitespace-nowrap">
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
