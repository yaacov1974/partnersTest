"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthFormProps {
  type: "saas" | "affiliate";
  mode: "login" | "signup";
}

export function AuthForm({ type, mode }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showEmailSent, setShowEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Check if we're in mock mode by checking the actual supabase URL
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
      const isMockMode = supabaseUrl.includes("placeholder");
      
      if (isMockMode) {
        // Simulate a delay
        await new Promise(resolve => setTimeout(resolve, 500));
        // Redirect to dashboard
        router.push(`/${type}/dashboard`);
        return;
      }

      if (mode === "signup") {
        // Check if user already exists
        // Note: This relies on public.profiles being readable (which it is by default in our schema)
        const { data: existingUser } = await supabase
          .from('profiles')
          .select('email')
          .eq('email', email)
          .single();

        if (existingUser) {
          setError("User already registered. Please sign in instead.");
          setLoading(false);
          return;
        }

        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=/${type}/onboarding`,
            data: {
              role: type,
              marketing_consent: marketingConsent,
            },
          },
        });
        if (authError) throw authError;

        if (authData.user && !authData.session) {
           // User signed up but needs email verification
           setShowEmailSent(true);
           setLoading(false);
           return;
        }

        if (authData.user) {
          // Profile creation is now handled by a Database Trigger (see supabase/fix_signup_trigger.sql)
          // This avoids race conditions and RLS issues with pure client-side insertion.
          
          if (isMockMode) {
             console.log("Mock Mode: Trigger would fire here.");
          }
        }

        router.push(`/${type}/onboarding`);
      } else {
        const { data: signInData, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        // Verify that the user has the correct role
        if (signInData.user) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', signInData.user.id)
            .single();

          if (profileError) {
            await supabase.auth.signOut();
            throw new Error("Failed to verify account details.");
          }

          if (profile?.role !== type) {
            await supabase.auth.signOut();
            throw new Error(`Invalid account type. You are trying to log in as ${type}, but your account is registered as ${profile?.role || 'unknown'}.`);
          }
        }

        router.push(`/${type}/dashboard`);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/${type}/dashboard`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
    }
  };

  const title = mode === "login" ? "Welcome Back" : "Create Account";
  const description = type === "saas" 
    ? (mode === "login" ? "Sign in to manage your partnership program." : "Start your partnership journey today.")
    : (mode === "login" ? "Sign in to access your affiliate dashboard." : "Join the network and start earning.");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const isMockMode = supabaseUrl.includes("placeholder");

  if (showEmailSent) {
    return (
      <div className="relative group w-full max-w-2xl">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-75" />
        <Card className="relative w-full border-zinc-800 bg-black/90 backdrop-blur-xl p-8 text-center space-y-6">
            <div className="flex justify-center">
                <div className="h-16 w-16 rounded-full bg-indigo-500/10 flex items-center justify-center">
                    <Mail className="h-8 w-8 text-indigo-500" />
                </div>
            </div>
            <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white">Check your email</h3>
                <p className="text-zinc-400">
                    We've sent a confirmation link to <span className="font-semibold text-white">{email}</span>.
                    <br />
                    Please check your inbox (and spam folder) to verify your account.
                </p>
            </div>
            <div className="pt-4">
                <Button 
                    variant="outline" 
                    className="border-zinc-800 bg-zinc-900/50 text-white hover:bg-zinc-800"
                    onClick={() => router.push(`/${type}/login`)}
                >
                    Back to Sign In
                </Button>
            </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative group w-full max-w-2xl">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
      <Card className="relative w-full border-zinc-800 bg-black/90 backdrop-blur-xl">
        {isMockMode && (
          <div className="absolute top-2 right-2 z-10">
            <span className="inline-flex items-center rounded-full bg-yellow-500/10 px-2 py-1 text-xs font-medium text-yellow-500 ring-1 ring-inset ring-yellow-500/20">
              Demo Mode
            </span>
          </div>
        )}
        <div className="flex justify-center pt-8 pb-4">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <span className="text-2xl font-bold text-white">Partnerz.ai</span>
          </Link>
        </div>
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight text-white">{title}</CardTitle>
          <CardDescription className="text-zinc-400">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-zinc-500" />
                <Input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-500 focus:border-primary focus:ring-primary"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-zinc-500" />
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-500 focus:border-primary focus:ring-primary"
                />
              </div>
            </div>
            
            {error && (
              <div className="flex items-center gap-2 rounded-md bg-red-500/10 p-3 text-sm text-red-500">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <p>
                  {error === "Failed to fetch" 
                    ? "Connection failed. Please check your internet or Supabase configuration (API Keys)." 
                    : error}
                </p>
              </div>
            )}

            {mode === "signup" && (
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="marketing"
                  checked={marketingConsent}
                  onChange={(e) => setMarketingConsent(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-zinc-800 bg-zinc-900/50 text-primary focus:ring-primary focus:ring-offset-0"
                />
                <label htmlFor="marketing" className="text-sm text-zinc-400">
                  Yes, I would like to receive exclusive deals, product updates, and personalized content from Partnerz.ai via email and in-app messages. You can unsubscribe at any time.
                </label>
              </div>
            )}

            <Button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold shadow-lg shadow-indigo-500/20 transition-all" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                mode === "login" ? "Sign In" : "Create Account"
              )}
            </Button>

            {mode === "signup" && (
              <p className="text-xs text-center text-zinc-500 px-4">
                By creating an account, you agree to our{" "}
                <Link href="/terms" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
            )}
          </form>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-black px-2 text-zinc-500">Or continue with</span>
            </div>
          </div>

          <Button variant="outline" type="button" className="w-full border-zinc-800 bg-zinc-900/50 text-white hover:bg-zinc-800 hover:text-white transition-all" onClick={handleGoogleLogin}>
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 justify-center">
          <p className="text-sm text-zinc-400">
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <Link href={mode === "login" ? `/${type}/signup` : `/${type}/login`} className="text-primary hover:text-primary/80 hover:underline transition-colors">
              {mode === "login" ? "Sign up" : "Sign in"}
            </Link>
          </p>
          {mode === "login" && (
            <Link href={`/${type}/forgot-password`} className="text-xs text-zinc-500 hover:text-zinc-400">
              Forgot your password?
            </Link>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
