"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

import { OnboardingHeader } from "@/components/OnboardingHeader";
import { Footer } from "@/components/Footer";

export default function SaaSOnboardingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    website: "",
    short_description: "",
    long_description: "",
    category: "",
    year_founded: new Date().getFullYear().toString(),
    commission_model: "20% Recurring",
    commission_rate: "20",
    cookie_duration: "30",
    landing_page_url: "",
    tracking_method: "Link Tracking",
    partner_program_url: "",
    exclusive_deal: "",
    technical_contact: "",
    geo_restrictions: "Global",
    supported_languages: "English",
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/saas/login");
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!user) return;

      const languagesArray = formData.supported_languages.split(",").map((s) => s.trim()).filter((s) => s.length > 0);

      const { error } = await supabase
        .from("saas_companies")
        .update({
          name: formData.name,
          website: formData.website,
          commission_rate: parseFloat(formData.commission_rate),
          short_description: formData.short_description,
          long_description: formData.long_description,
          category: formData.category,
          year_founded: parseInt(formData.year_founded) || 2024,
          commission_model: formData.commission_model,
          cookie_duration: parseInt(formData.cookie_duration) || 30,
          landing_page_url: formData.landing_page_url,
          tracking_method: formData.tracking_method,
          partner_program_url: formData.partner_program_url,
          exclusive_deal: formData.exclusive_deal,
          technical_contact: formData.technical_contact,
          geo_restrictions: formData.geo_restrictions,
          supported_languages: languagesArray,
        })
        .eq("owner_id", user.id);

      if (error) throw error;

      router.push("/saas/dashboard");
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <OnboardingHeader />
      <main className="flex-1 flex items-center justify-center p-4 py-8">
      <Card className="w-full max-w-3xl border-zinc-800 bg-zinc-900/50">
        <CardHeader>
          <CardTitle className="text-2xl text-white">Complete Your Company Profile</CardTitle>
          <CardDescription className="text-zinc-400">
            Tell us about your SaaS product to help partners promote it effectively.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Basic Service Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-zinc-800 pb-2">Basic Service Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-200">Company Name *</label>
                    <Input required name="name" value={formData.name} onChange={handleChange} className="bg-zinc-950 border-zinc-800 text-white" placeholder="Acme Inc." />
                </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-200">Website URL *</label>
                    <Input required type="url" name="website" value={formData.website} onChange={handleChange} className="bg-zinc-950 border-zinc-800 text-white" placeholder="https://example.com" />
                </div>
                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-zinc-200">Headline (Short Description) *</label>
                    <Input required name="short_description" value={formData.short_description} onChange={handleChange} className="bg-zinc-950 border-zinc-800 text-white" placeholder="e.g. The #1 SEO Tool for Agencies" maxLength={100} />
                </div>
                 <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-zinc-200">Long Description (Product Details)</label>
                  <textarea name="long_description" value={formData.long_description} onChange={handleChange} className="flex min-h-[100px] w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-300" placeholder="Describe features, benefits, and target audience..." />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-200">Category</label>
                    <Input name="category" value={formData.category} onChange={handleChange} className="bg-zinc-950 border-zinc-800 text-white" placeholder="e.g. Marketing, FinTech" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-200">Year Founded</label>
                    <Input type="number" name="year_founded" value={formData.year_founded} onChange={handleChange} className="bg-zinc-950 border-zinc-800 text-white" />
                </div>
              </div>
            </div>

            {/* Affiliate Program Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-zinc-800 pb-2">Affiliate Program Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-200">Commission Model</label>
                    <Input name="commission_model" value={formData.commission_model} onChange={handleChange} className="bg-zinc-950 border-zinc-800 text-white" placeholder="e.g. 20% Recurring" />
                </div>
                <div className="space-y-2">
                   <label className="text-sm font-medium text-zinc-200">Commission Rate (%)</label>
                   <Input type="number" name="commission_rate" value={formData.commission_rate} onChange={handleChange} className="bg-zinc-950 border-zinc-800 text-white" />
                </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-200">Cookie Duration (Days)</label>
                    <Input type="number" name="cookie_duration" value={formData.cookie_duration} onChange={handleChange} className="bg-zinc-950 border-zinc-800 text-white" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-200">Tracking Method</label>
                    <Input name="tracking_method" value={formData.tracking_method} onChange={handleChange} className="bg-zinc-950 border-zinc-800 text-white" placeholder="Link Tracking, Coupon, etc." />
                </div>
                 <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-zinc-200">Recommended Landing Page URL</label>
                    <Input type="url" name="landing_page_url" value={formData.landing_page_url} onChange={handleChange} className="bg-zinc-950 border-zinc-800 text-white" placeholder="https://example.com/landing" />
                </div>
                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-zinc-200">Exclusive Deal for Partners</label>
                    <Input name="exclusive_deal" value={formData.exclusive_deal} onChange={handleChange} className="bg-zinc-950 border-zinc-800 text-white" placeholder="e.g. 10% off for first 3 months" />
                </div>
              </div>
            </div>

             {/* Technical & Availability */}
             <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-zinc-800 pb-2">Technical & Availability</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-200">Technical Contact (Email)</label>
                    <Input type="email" name="technical_contact" value={formData.technical_contact} onChange={handleChange} className="bg-zinc-950 border-zinc-800 text-white" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-200">Geo Restrictions</label>
                    <Input name="geo_restrictions" value={formData.geo_restrictions} onChange={handleChange} className="bg-zinc-950 border-zinc-800 text-white" placeholder="Global, US Only, etc." />
                </div>
                 <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-zinc-200">Supported Languages (comma separated)</label>
                    <Input name="supported_languages" value={formData.supported_languages} onChange={handleChange} className="bg-zinc-950 border-zinc-800 text-white" placeholder="English, Spanish, Hebrew" />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white mt-6"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving Profile...
                </>
              ) : (
                "Complete Setup"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      </main>
      <Footer />
    </div>
  );
}
