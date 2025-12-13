"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, TrendingUp, Activity } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SaaSDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [checkingOnboarding, setCheckingOnboarding] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      if (loading) return;

      if (!user) {
        router.push("/saas/login");
        return;
      }

      try {
        const { data, error } = await supabase
          .from("saas_companies")
          .select("onboarding_completed")
          .eq("owner_id", user.id)
          .single();

        if (error || !data?.onboarding_completed) {
          router.push("/saas/onboarding");
        } else {
          setCheckingOnboarding(false);
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        router.push("/saas/onboarding");
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
      title: "Total Revenue",
      value: "$45,231.89",
      change: "+20.1% from last month",
      icon: DollarSign,
    },
    {
      title: "Active Partners",
      value: "+2350",
      change: "+180.1% from last month",
      icon: Users,
    },
    {
      title: "Sales",
      value: "+12,234",
      change: "+19% from last month",
      icon: Activity,
    },
    {
      title: "Active Now",
      value: "+573",
      change: "+201 since last hour",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Dashboard</h2>
        <p className="text-zinc-400">Welcome back, {user.email}! Overview of your partnership performance.</p>
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
            <CardTitle className="text-white">Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[200px] flex items-center justify-center text-zinc-500">
              Chart Placeholder
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3 border-white/10 bg-white/5 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white">Recent Sales</CardTitle>
            <div className="text-sm text-zinc-400">
              You made 265 sales this month.
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center">
                  <div className="h-9 w-9 rounded-full bg-zinc-800" />
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none text-white">
                      Olivia Martin
                    </p>
                    <p className="text-sm text-zinc-400">
                      olivia.martin@email.com
                    </p>
                  </div>
                  <div className="ml-auto font-medium text-white">+$1,999.00</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
