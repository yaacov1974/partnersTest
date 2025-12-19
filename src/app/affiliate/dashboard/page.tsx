"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, MousePointer, ShoppingCart, TrendingUp } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AffiliateDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [checkingOnboarding, setCheckingOnboarding] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      if (loading) return;

      if (!user) {
        router.push("/affiliate/login");
        return;
      }

      try {
        // 1. Get user profile to check role
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
          return;
        }

        if (!profile) {
          console.warn("Profile not found for authenticated user. Redirecting to login.");
          router.push("/affiliate/login?error=account_not_found");
          return;
        }

        // 2. Redirect if role mismatch
        if (profile.role === "saas") {
          router.push("/saas/dashboard");
          return;
        }

        // 3. Check for onboarding completion
        const { data: partner, error: partnerError } = await supabase
          .from("partners")
          .select("onboarding_completed")
          .eq("profile_id", user.id)
          .maybeSingle();

        if (partnerError || !partner?.onboarding_completed) {
          router.push("/affiliate/onboarding");
        } else {
          setCheckingOnboarding(false);
        }
      } catch (error) {
        console.error("Dashboard guard error:", error);
      }
    };

    checkUser();
  }, [user, loading, router]);

  if (loading || checkingOnboarding) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const stats = [
    {
      title: "Total Earnings",
      value: "$12,450.00",
      change: "+15% from last month",
      icon: DollarSign,
    },
    {
      title: "Total Clicks",
      value: "45,231",
      change: "+5% from last month",
      icon: MousePointer,
    },
    {
      title: "Conversions",
      value: "1,203",
      change: "+12% from last month",
      icon: ShoppingCart,
    },
    {
      title: "Conversion Rate",
      value: "2.6%",
      change: "+0.4% from last month",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Dashboard</h2>
        <p className="text-zinc-400">Welcome back, {user.email}! Track your performance and earnings.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="border-white/10 bg-white/5 backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-zinc-200">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-zinc-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{stat.value}</div>
                <p className="text-xs text-zinc-400">{stat.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-white/10 bg-white/5 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white">Earnings Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[200px] flex items-center justify-center text-zinc-500">
              Chart Placeholder
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3 border-white/10 bg-white/5 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white">Recent Payouts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center">
                  <div className="h-9 w-9 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                    <DollarSign className="h-4 w-4" />
                  </div>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none text-white">
                      Payout #{1000 + i}
                    </p>
                    <p className="text-sm text-zinc-400">
                      Processed on {new Date().toLocaleDateString()}
                    </p>
                  </div>
                  <div className="ml-auto font-medium text-white">+$500.00</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
