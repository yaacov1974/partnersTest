"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function OnboardingHeader() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-black/50 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600">
            <span className="text-lg font-bold text-white">P</span>
          </span>
          <span className="text-xl font-bold tracking-tight text-white">Partnerz.ai</span>
        </Link>
        
        <Button 
          variant="ghost" 
          onClick={handleLogout}
          className="text-zinc-400 hover:text-white hover:bg-zinc-800"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </nav>
  );
}
