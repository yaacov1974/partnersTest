"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Check } from "lucide-react";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-crop";

export default function AffiliateSettingsPage() {
  const { user, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [formData, setFormData] = useState({
    // Account & Identity
    full_name: "",
    avatar_url: "",
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
            avatar_url: data.avatar_url || "",
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

  const handleImageCropped = async (blob: Blob) => {
    if (!user) return;
    setIsUploading(true);
    
    try {
      const fileExt = "jpg";
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars') 
        .upload(filePath, blob, {
            contentType: 'image/jpeg',
            upsert: true
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      if (data) {
        setFormData(prev => ({ ...prev, avatar_url: data.publicUrl }));
      }
    } catch (error: any) {
        console.error("Error uploading avatar:", error);
        alert("Error uploading avatar: " + error.message);
    } finally {
        setIsUploading(false);
    }
  };


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
          avatar_url: formData.avatar_url,
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
        <h1 className="text-3xl font-bold text-[#c27aff]">Settings</h1>
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
          <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
            
            {/* Account & Identity */}
            <div className="space-y-4">
              <h3 className="text-3xl font-bold text-[#c27aff] border-b border-zinc-800 pb-4">Account & Identity</h3>
              <div className="flex flex-col gap-8">
                
                {/* Avatar Upload */}
                <div className="flex flex-col items-center sm:items-start gap-3">
                    <label className="text-lg font-semibold text-white">Profile Picture</label>
                    <ImageUploadWithCrop 
                        onImageCropped={handleImageCropped} 
                        initialImage={formData.avatar_url}
                        aspectRatio={1}
                        circularCrop={true}
                        // We need to ensure these classes reach the dropzone. 
                        // I will update the component to accept `dropzoneClassName` in the next step to be cleaner,
                        // or relying on my previous edit's logic if I can make it work.
                        // Wait, my previous edit to ImageUploadWithCrop was just a comment. 
                        // I will make the real edit now.
                        className="w-[300px] h-[300px]"
                    />
                </div>

                <div className="space-y-3">
                    <label className="text-lg font-semibold text-white">Full Name / Company Name</label>
                    <Input required name="full_name" value={formData.full_name} onChange={handleChange} className="h-16 text-2xl md:text-2xl bg-zinc-950 border border-zinc-700 rounded-lg text-white px-5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
                </div>
                <div className="space-y-3">
                    <label className="text-lg font-semibold text-white">Phone Number</label>
                    <Input name="phone" value={formData.phone} onChange={handleChange} className="h-16 text-2xl md:text-2xl bg-zinc-950 border border-zinc-700 rounded-lg text-white px-5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
                </div>
                 <div className="space-y-3">
                    <label className="text-lg font-semibold text-white">Country of Residence</label>
                    <Input required name="country" value={formData.country} onChange={handleChange} className="h-16 text-2xl md:text-2xl bg-zinc-950 border border-zinc-700 rounded-lg text-white px-5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
                </div>
              </div>
            </div>

             {/* Promotion Channel Details */}
             <div className="space-y-4">
              <h3 className="text-3xl font-bold text-[#c27aff] border-b border-zinc-800 pb-4">Promotion Channel Details</h3>
              <div className="flex flex-col gap-8">
                <div className="space-y-3">
                    <label className="text-lg font-semibold text-white">Main Platform</label>
                     <select 
                        name="promotion_platform" 
                        value={formData.promotion_platform} 
                        onChange={handleChange}
                        className="flex h-16 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-5 text-2xl text-white shadow-sm transition-colors focus-visible:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
                     >
                        <option value="Blog">Blog</option>
                        <option value="YouTube">YouTube</option>
                        <option value="Social Media">Social Media</option>
                        <option value="Email List">Email List</option>
                        <option value="Podcast">Podcast</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div className="space-y-3">
                    <label className="text-lg font-semibold text-white">Platform URL</label>
                    <Input name="platform_url" value={formData.platform_url} onChange={handleChange} className="h-16 text-2xl md:text-2xl bg-zinc-950 border border-zinc-700 rounded-lg text-white px-5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
                </div>
                 <div className="space-y-3">
                    <label className="text-lg font-semibold text-white">Audience Size</label>
                    <Input name="audience_size" value={formData.audience_size} onChange={handleChange} className="h-16 text-2xl md:text-2xl bg-zinc-950 border border-zinc-700 rounded-lg text-white px-5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" placeholder="e.g. 10k - 50k" />
                </div>
                <div className="space-y-3">
                    <label className="text-lg font-semibold text-white">Niche / Topic</label>
                    <Input name="niche" value={formData.niche} onChange={handleChange} className="h-16 text-2xl md:text-2xl bg-zinc-950 border border-zinc-700 rounded-lg text-white px-5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="space-y-4">
              <h3 className="text-3xl font-bold text-[#c27aff] border-b border-zinc-800 pb-4">Payment Details</h3>
              <div className="flex flex-col gap-8">
                <div className="space-y-3">
                    <label className="text-lg font-semibold text-white">Preferred Payment Method</label>
                     <select 
                        name="payment_method" 
                        value={formData.payment_method} 
                        onChange={handleChange}
                        className="flex h-16 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-5 text-2xl text-white shadow-sm transition-colors focus-visible:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
                     >
                        <option value="PayPal">PayPal</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="Payoneer">Payoneer</option>
                    </select>
                </div>
                <div className="space-y-3">
                    <label className="text-lg font-semibold text-white">Preferred Currency</label>
                     <select 
                        name="preferred_currency" 
                        value={formData.preferred_currency} 
                        onChange={handleChange}
                        className="flex h-16 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-5 text-2xl text-white shadow-sm transition-colors focus-visible:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
                     >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="ILS">ILS (₪)</option>
                    </select>
                </div>
                <div className="space-y-3">
                    <label className="text-lg font-semibold text-white">Payment Account Details</label>
                    <Input required name="payment_details" value={formData.payment_details} onChange={handleChange} className="h-16 text-2xl md:text-2xl bg-zinc-950 border border-zinc-700 rounded-lg text-white px-5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" placeholder="PayPal Email or IBAN/SWIFT" />
                </div>
                <div className="space-y-3">
                    <label className="text-lg font-semibold text-white">Tax Info (ID / VAT Number)</label>
                    <Input name="tax_info" value={formData.tax_info} onChange={handleChange} className="h-16 text-2xl md:text-2xl bg-zinc-950 border border-zinc-700 rounded-lg text-white px-5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
                <Button
                type="submit"
                disabled={isSubmitting || isUploading}
                className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white min-w-[200px] h-16 text-xl font-semibold mt-8"
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
