"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function Navbar() {
  const { user, session, loading, signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  // Get user role from session metadata
  const userRole = session?.user?.user_metadata?.role || "saas";

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl supports-[backdrop-filter]:bg-black/20">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
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

        <div className="flex items-center gap-4">
          {!loading && user ? (
            <>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href={`/${userRole}/dashboard`}>Dashboard</Link>
              </Button>
              <Button 
                variant="outline" 
                className="border-white/10 bg-transparent text-white hover:bg-white/5"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/affiliate/login" className="text-sm font-medium text-zinc-400 transition-colors hover:text-white">
                Affiliate Sign In
              </Link>
              <Button asChild className="bg-white/10 text-white hover:bg-white/20 border border-white/10">
                <Link href="/saas/login">SaaS Sign In</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
