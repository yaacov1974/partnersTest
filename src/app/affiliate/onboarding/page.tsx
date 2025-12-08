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

export default function AffiliateOnboardingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Account & Identity
    full_name: "",
    phone: "",
    country: "",
    // Promotion Channel
    promotion_platform: "Social Media", // Default
    platform_url: "",
    audience_size: "",
    niche: "",
    // Payment Details
    payment_method: "PayPal", // Default
    payment_details: "",
    tax_info: "",
    preferred_currency: "USD",
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

      const { error } = await supabase
        .from("partners")
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          country: formData.country,
          promotion_platform: formData.promotion_platform,
          platform_url: formData.platform_url,
          audience_size: formData.audience_size,
          niche: formData.niche,
          payment_method: formData.payment_method,
          payment_details: formData.payment_details,
          tax_info: formData.tax_info,
          preferred_currency: formData.preferred_currency,
          // Mapping existing fields if needed, or keeping them strictly separate
           bio: `Niche: ${formData.niche}. Platform: ${formData.promotion_platform}`, // quick backwards compat fill
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
          <CardTitle className="text-2xl text-white">Build Your Partner Profile</CardTitle>
          <CardDescription className="text-zinc-400">
            Showcase your channels and set up your payment details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Account & Identity */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-zinc-800 pb-2">Account & Identity</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-200">Full Name / Company Name</label>
                    <Input required name="full_name" value={formData.full_name} onChange={handleChange} className="bg-zinc-950 border-zinc-800 text-white" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-200">Phone Number</label>
                    <Input name="phone" value={formData.phone} onChange={handleChange} className="bg-zinc-950 border-zinc-800 text-white" placeholder="+1 234 567 890" />
                </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-200">Country of Residence</label>
                    <Input required name="country" value={formData.country} onChange={handleChange} className="bg-zinc-950 border-zinc-800 text-white" placeholder="USA, Israel, UK..." />
                </div>
              </div>
            </div>

             {/* Promotion Channel Details */}
             <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-zinc-800 pb-2">Promotion Channel Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-200">Main Platform</label>
                     <select 
                        name="promotion_platform" 
                        value={formData.promotion_platform} 
                        onChange={handleChange}
                        className="flex h-9 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-1 text-sm text-white shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-300"
                     >
                        <option value="Blog">Blog</option>
                        <option value="YouTube">YouTube</option>
                        <option value="Social Media">Social Media</option>
                        <option value="Email List">Email List</option>
                        <option value="Podcast">Podcast</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-200">Platform URL</label>
                    <Input name="platform_url" value={formData.platform_url} onChange={handleChange} className="bg-zinc-950 border-zinc-800 text-white" placeholder="https://..." />
                </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-200">Audience Size (Monthly Traffic/Followers)</label>
                    <Input name="audience_size" value={formData.audience_size} onChange={handleChange} className="bg-zinc-950 border-zinc-800 text-white" placeholder="e.g. 10k - 50k" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-200">Niche / Topic</label>
                    <Input name="niche" value={formData.niche} onChange={handleChange} className="bg-zinc-950 border-zinc-800 text-white" placeholder="e.g. FinTech, Wellness" />
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-zinc-800 pb-2">Payment Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-200">Preferred Payment Method</label>
                     <select 
                        name="payment_method" 
                        value={formData.payment_method} 
                        onChange={handleChange}
                        className="flex h-9 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-1 text-sm text-white shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-300"
                     >
                        <option value="PayPal">PayPal</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="Payoneer">Payoneer</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-200">Preferred Currency</label>
                     <select 
                        name="preferred_currency" 
                        value={formData.preferred_currency} 
                        onChange={handleChange}
                        className="flex h-9 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-1 text-sm text-white shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-300"
                     >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="ILS">ILS (₪)</option>
                    </select>
                </div>
                 <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-zinc-200">Payment Account Details</label>
                    <Input required name="payment_details" value={formData.payment_details} onChange={handleChange} className="bg-zinc-950 border-zinc-800 text-white" placeholder="PayPal Email or IBAN/SWIFT" />
                </div>
                 <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-zinc-200">Tax Info (ID / VAT Number)</label>
                    <Input name="tax_info" value={formData.tax_info} onChange={handleChange} className="bg-zinc-950 border-zinc-800 text-white" placeholder="e.g. VAT #123456789" />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white mt-6"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving Profile...
                </>
              ) : (
                "Complete Profile"
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
