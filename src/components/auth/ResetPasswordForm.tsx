"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Loader2, AlertCircle, CheckCircle } from "lucide-react";

interface ResetPasswordFormProps {
  type: "saas" | "affiliate";
}

export function ResetPasswordForm({ type }: ResetPasswordFormProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [validToken, setValidToken] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let tokenFound = false;

    // Handle the auth state change when user clicks the reset link
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        tokenFound = true;
        setValidToken(true);
      }
    });

    // Check if we have a valid session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        tokenFound = true;
        setValidToken(true);
      }
    });

    // Set a timeout to show error if no valid token after 2 seconds
    const timeout = setTimeout(() => {
      if (!tokenFound) {
        setError("Invalid or expired reset link. Please request a new password reset.");
      }
    }, 2000);

    return () => {
      authListener.subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      setSuccess(true);
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push(`/${type}/login`);
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative group w-full max-w-2xl">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
      <Card className="relative w-full border-zinc-800 bg-black/90 backdrop-blur-xl">
        <div className="flex justify-center pt-8 pb-4">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <span className="text-2xl font-bold text-white">Partnerz.ai</span>
          </Link>
        </div>
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight text-white">Set New Password</CardTitle>
          <CardDescription className="text-zinc-400">
            Enter your new password below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!validToken && error ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 rounded-md bg-red-500/10 p-4 text-sm text-red-500">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p>{error}</p>
              </div>
              <Link href={`/${type}/forgot-password`}>
                <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500">
                  Request New Reset Link
                </Button>
              </Link>
            </div>
          ) : success ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 rounded-md bg-green-500/10 p-4 text-sm text-green-500">
                <CheckCircle className="h-5 w-5 shrink-0" />
                <p>
                  Password updated successfully! Redirecting to login...
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-zinc-500" />
                  <Input
                    type="password"
                    placeholder="New password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="pl-10 bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-500 focus:border-primary focus:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-zinc-500" />
                  <Input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className="pl-10 bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-500 focus:border-primary focus:ring-primary"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-md bg-red-500/10 p-3 text-sm text-red-500">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold shadow-lg shadow-indigo-500/20 transition-all" 
                disabled={loading || !validToken}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>

              <div className="text-center">
                <Link href={`/${type}/login`} className="text-sm text-zinc-400 hover:text-white transition-colors">
                  ← Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
