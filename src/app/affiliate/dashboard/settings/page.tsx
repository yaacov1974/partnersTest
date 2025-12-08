"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Check } from "lucide-react";

export default function AffiliateSettingsPage() {
  const { user, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [formData, setFormData] = useState({
    // Account & Identity
    full_name: "",
    phone: "",
    country: "",
    // Promotion Channel
    promotion_platform: "Social Media", 
    platform_url: "",
    audience_size: "",
    niche: "",
    // Payment Details
    payment_method: "PayPal",
    payment_details: "",
    tax_info: "",
    preferred_currency: "USD",
  });

   useEffect(() => {
    async function fetchSettings() {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from("partners")
          .select("*")
          .eq("profile_id", user.id)
          .single();

        if (error) throw error;

        if (data) {
          setFormData({
            full_name: data.full_name || "",
            phone: data.phone || "",
            country: data.country || "",
            promotion_platform: data.promotion_platform || "Social Media",
            platform_url: data.platform_url || "",
            audience_size: data.audience_size || "",
            niche: data.niche || "",
            payment_method: data.payment_method || "PayPal",
            payment_details: data.payment_details || "",
            tax_info: data.tax_info || "",
            preferred_currency: data.preferred_currency || "USD",
          });
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setIsLoadingData(false);
      }
    }

    if (!loading && user) {
        fetchSettings();
    }
  }, [user, loading]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");

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
           // Legacy fields mapping
           bio: `Niche: ${formData.niche}. Platform: ${formData.promotion_platform}`,
        })
        .eq("profile_id", user.id);

      if (error) throw error;
      
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);

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

  if (loading || isLoadingData) {
    return (
      <div className="flex bg-black items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-zinc-400">Manage your partner profile and payment details.</p>
      </div>

      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardHeader>
          <CardTitle className="text-xl text-white">Partner Profile</CardTitle>
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
                    <Input required name="full_name" value={formData.full_name} onChange={handleChange} className="bg-zinc-950 border-zinc-800 text-white" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-200">Phone Number</label>
                    <Input name="phone" value={formData.phone} onChange={handleChange} className="bg-zinc-950 border-zinc-800 text-white" />
                </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-200">Country of Residence</label>
                    <Input required name="country" value={formData.country} onChange={handleChange} className="bg-zinc-950 border-zinc-800 text-white" />
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
                    <Input name="platform_url" value={formData.platform_url} onChange={handleChange} className="bg-zinc-950 border-zinc-800 text-white" />
                </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-200">Audience Size</label>
                    <Input name="audience_size" value={formData.audience_size} onChange={handleChange} className="bg-zinc-950 border-zinc-800 text-white" placeholder="e.g. 10k - 50k" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-200">Niche / Topic</label>
                    <Input name="niche" value={formData.niche} onChange={handleChange} className="bg-zinc-950 border-zinc-800 text-white" />
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
                    <Input name="tax_info" value={formData.tax_info} onChange={handleChange} className="bg-zinc-950 border-zinc-800 text-white" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
                <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white min-w-[150px]"
                >
                {isSubmitting ? (
                    <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                    </>
                ) : (
                    "Save Changes"
                )}
                </Button>
                 {successMessage && (
                    <div className="flex items-center text-green-500 animate-in fade-in slide-in-from-left-2">
                        <Check className="w-4 h-4 mr-2" />
                        {successMessage}
                    </div>
                )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
