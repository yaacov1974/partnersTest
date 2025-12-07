"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function AffiliateOnboardingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    bio: "",
    skills: "",
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/affiliate/login");
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!user) return;

      const skillsArray = formData.skills.split(",").map((s) => s.trim()).filter((s) => s.length > 0);

      const { error } = await supabase
        .from("partners")
        .update({
          bio: formData.bio,
          skills: skillsArray,
        })
        .eq("profile_id", user.id);

      if (error) throw error;

      router.push("/affiliate/dashboard");
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <Card className="w-full max-w-2xl border-zinc-800 bg-zinc-900/50">
        <CardHeader>
          <CardTitle className="text-2xl text-white">Build Your Partner Profile</CardTitle>
          <CardDescription className="text-zinc-400">
            Showcase your skills and experience to attract the best SaaS companies.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-200">Bio</label>
              <textarea
                required
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="flex min-h-[100px] w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-300"
                placeholder="Tell us about yourself and your audience..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-200">Skills (comma separated)</label>
              <Input
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                className="bg-zinc-950 border-zinc-800 text-white"
                placeholder="SEO, Content Marketing, Social Media, Email Marketing"
              />
              <p className="text-xs text-zinc-500">
                E.g. SEO, Content Marketing, Social Media
              </p>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Complete Profile"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
