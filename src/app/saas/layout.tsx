"use client";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { usePathname } from "next/navigation";

export default function SaaSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname?.includes("/login") || pathname?.includes("/signup") || pathname?.includes("/forgot-password") || pathname?.includes("/reset-password") || pathname?.includes("/onboarding");

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-black">
      <Sidebar type="saas" />
      <main className="flex-1 overflow-y-auto p-8 bg-black">
        {children}
      </main>
    </div>
  );
}
