"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, MessageSquare, Settings, Search } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  type: "saas" | "affiliate";
}

export function Sidebar({ type }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    window.location.href = "/";
  };
  
  const links = [
    {
      href: `/${type}/dashboard`,
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: `/${type}/marketplace`,
      label: type === "saas" ? "Find Partners" : "Find SaaS",
      icon: Search,
    },
    {
      href: `/${type}/chat`,
      label: "Messages",
      icon: MessageSquare,
    },
    {
      href: `/${type}/settings`,
      label: "Settings",
      icon: Settings,
    },
  ];

  return (
    <div className="flex h-screen w-64 flex-col border-r border-white/10 bg-black">
      <div className="flex h-16 items-center px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-white">P</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Partnerz.ai</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-4 py-4">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className="h-5 w-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 p-4 space-y-3">
        <div className="flex items-center gap-3 rounded-lg bg-white/5 p-3">
          <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center">
            <span className="text-white font-medium">
              {user?.email?.charAt(0).toUpperCase() || "U"}
            </span>
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-medium text-white truncate">
              {user?.email?.split("@")[0] || "User"}
            </span>
            <span className="text-xs text-zinc-500 capitalize">{type} Account</span>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="w-full border-white/10 bg-transparent text-white hover:bg-white/5"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
