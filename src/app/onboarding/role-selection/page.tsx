"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, Loader2, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function RoleSelectionPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      // Check if user already has a profile/role
      const checkProfile = async () => {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profile?.role) {
          router.push(`/${profile.role}/dashboard`);
        }
      };
      checkProfile();
    }
  }, [user, authLoading, router]);

  const handleRoleSelection = async (role: "saas" | "affiliate") => {
    if (!user) return;
    setLoading(true);
    setError(null);

    try {
      console.log(`Selected role: ${role} for user ${user.id}`);

      // 1. Create Profile
      const { error: profileError } = await supabase.from('profiles').insert({
        id: user.id,
        email: user.email!,
        role: role,
        marketing_consent: user.user_metadata?.marketing_consent || false
      });

      if (profileError) {
        console.error("Profile creation error:", profileError);
        throw new Error(`Failed to create profile: ${profileError.message}`);
      }

      // 2. Create Role Specific Record
      if (role === 'saas') {
        const { error: companyError } = await supabase.from('saas_companies').insert({
          owner_id: user.id,
          name: 'My Company'
        });
        
        if (companyError) throw new Error(`Failed to create company: ${companyError.message}`);
      } else {
        const { error: partnerError } = await supabase.from('partners').insert({
          profile_id: user.id
        });
        
        if (partnerError) throw new Error(`Failed to create partner: ${partnerError.message}`);
      }

      // 3. Redirect
      window.location.href = `/${role}/onboarding`;
    } catch (err: any) {
      console.error("Role selection error:", err);
      setError(err.message || "Failed to setup account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-white">Choose your path</h1>
          <p className="text-xl text-zinc-400">How do you want to use Partnerz.ai?</p>
        </div>

        {error && (
          <div className="p-4 rounded-md bg-red-500/10 text-red-500 text-center">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* SaaS Card */}
          <Card 
            className="relative overflow-hidden border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 transition-all cursor-pointer group"
            onClick={() => !loading && handleRoleSelection("saas")}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader>
              <div className="mb-4 h-12 w-12 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-indigo-500" />
              </div>
              <CardTitle className="text-2xl text-white">SaaS Company</CardTitle>
              <CardDescription className="text-zinc-400">
                I want to launch and manage an affiliate program for my SaaS product.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-zinc-400 mb-6">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                  Automated commission payouts
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                  Stripe integration
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                  Partner marketplace access
                </li>
              </ul>
              <Button className="w-full bg-indigo-600 hover:bg-indigo-500" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Continue as SaaS"}
                {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </CardContent>
          </Card>

          {/* Affiliate Card */}
          <Card 
            className="relative overflow-hidden border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 transition-all cursor-pointer group"
            onClick={() => !loading && handleRoleSelection("affiliate")}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader>
              <div className="mb-4 h-12 w-12 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-emerald-500" />
              </div>
              <CardTitle className="text-2xl text-white">Affiliate Partner</CardTitle>
              <CardDescription className="text-zinc-400">
                I want to promote SaaS products and earn recurring commissions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-zinc-400 mb-6">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Recurring revenue share
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Access top SaaS programs
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Real-time analytics
                </li>
              </ul>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-500" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Continue as Affiliate"}
                {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
