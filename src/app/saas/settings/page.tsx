"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Check } from "lucide-react";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-crop";

export default function SaaSSettingsPage() {
  const { user, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  const [formData, setFormData] = useState({
    name: "",
    logo_url: "",
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
    async function fetchSettings() {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from("saas_companies")
          .select("*")
          .eq("owner_id", user.id)
          .single();

        if (error) throw error;

        if (data) {
          setFormData({
            name: data.name || "",
            logo_url: data.logo_url || "",
            website: data.website || "",
            short_description: data.short_description || "",
            long_description: data.long_description || "",
            category: data.category || "",
            year_founded: (data.year_founded || new Date().getFullYear()).toString(),
            commission_model: data.commission_model || "20% Recurring",
            commission_rate: (data.commission_rate || "20").toString(),
            cookie_duration: (data.cookie_duration || "30").toString(),
            landing_page_url: data.landing_page_url || "",
            tracking_method: data.tracking_method || "Link Tracking",
            partner_program_url: data.partner_program_url || "",
            exclusive_deal: data.exclusive_deal || "",
            technical_contact: data.technical_contact || "",
            geo_restrictions: data.geo_restrictions || "Global",
            supported_languages: Array.isArray(data.supported_languages) ? data.supported_languages.join(", ") : (data.supported_languages || "English"),
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

      const languagesArray = formData.supported_languages.split(",").map((s) => s.trim()).filter((s) => s.length > 0);

      const { error } = await supabase
        .from("saas_companies")
        .update({
          name: formData.name,
          logo_url: formData.logo_url,
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

      setSuccessMessage("Settings updated successfully!");
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

  const handleImageCropped = async (blob: Blob) => {
    if (!user) return;
    
    try {
      const fileExt = "jpg";
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('logos')
        .upload(filePath, blob, {
            contentType: 'image/jpeg',
            upsert: true
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('logos').getPublicUrl(filePath);
      if (data) {
        setFormData(prev => ({ ...prev, logo_url: data.publicUrl }));
        // Auto save logo update for better UX or let user click save? 
        // Let's just update state, user clicks save.
      }
    } catch (error: any) {
        console.error("Error uploading logo:", error);
    }
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
        <p className="text-zinc-400">Manage your company profile and program details.</p>
      </div>

      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardHeader>
          <CardTitle className="text-xl text-white">Company Profile</CardTitle>
          <CardDescription className="text-zinc-400">
            Update your public listing and partner program information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
            
            {/* Basic Service Details */}
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-[#c27aff] border-b border-zinc-800 pb-4">Basic Service Details</h3>
              
              <div className="space-y-8">
                 {/* Logo Section - Full Width */}
                 <div className="flex flex-col gap-3">
                    <label className="text-lg font-semibold text-indigo-500">Company Logo</label>
                    <ImageUploadWithCrop 
                        onImageCropped={handleImageCropped} 
                        initialImage={formData.logo_url}
                        aspectRatio={5 / 1}
                        className="w-full max-w-full"
                    />
                 </div>

                 {/* Rest of Basic Details */}
                 <div className="flex flex-col gap-8">
                    <div className="space-y-3">
                        <label className="text-lg font-semibold text-indigo-500">Company Name</label>
                        <Input required name="name" value={formData.name} onChange={handleChange} className="h-16 text-2xl md:text-2xl bg-zinc-950 border border-zinc-700 rounded-lg text-white px-5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
                    </div>
                     <div className="space-y-3">
                        <label className="text-lg font-semibold text-indigo-500">Website URL</label>
                        <Input required type="url" name="website" value={formData.website} onChange={handleChange} className="h-16 text-2xl md:text-2xl bg-zinc-950 border border-zinc-700 rounded-lg text-white px-5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
                    </div>
                    <div className="space-y-3">
                        <label className="text-lg font-semibold text-indigo-500">Headline (Short Description)</label>
                        <Input required name="short_description" value={formData.short_description} onChange={handleChange} className="h-16 text-2xl md:text-2xl bg-zinc-950 border border-zinc-700 rounded-lg text-white px-5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" maxLength={100} />
                    </div>
                     <div className="space-y-3">
                      <label className="text-lg font-semibold text-indigo-500">Long Description</label>
                      <textarea name="long_description" value={formData.long_description} onChange={handleChange} className="flex min-h-[150px] w-full rounded-lg border border-zinc-700 bg-zinc-950 px-5 py-4 text-2xl text-white placeholder:text-zinc-500 focus-visible:outline-none focus:border-indigo-500 focus-visible:ring-1 focus-visible:ring-indigo-500 transition-all" />
                    </div>
                    <div className="space-y-3">
                        <label className="text-lg font-semibold text-indigo-500">Category</label>
                        <Input name="category" value={formData.category} onChange={handleChange} className="h-16 text-2xl md:text-2xl bg-zinc-950 border border-zinc-700 rounded-lg text-white px-5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
                    </div>
                    <div className="space-y-3">
                        <label className="text-lg font-semibold text-indigo-500">Year Founded</label>
                        <Input type="number" name="year_founded" value={formData.year_founded} onChange={handleChange} className="h-16 text-2xl md:text-2xl bg-zinc-950 border border-zinc-700 rounded-lg text-white px-5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
                    </div>
                 </div>
              </div>
            </div>

            {/* Affiliate Program Details */}
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-[#c27aff] border-b border-zinc-800 pb-4">Affiliate Program Details</h3>
              <div className="flex flex-col gap-8">
                 <div className="space-y-3">
                    <label className="text-lg font-semibold text-indigo-500">Commission Model</label>
                    <Input name="commission_model" value={formData.commission_model} onChange={handleChange} className="h-16 text-2xl md:text-2xl bg-zinc-950 border border-zinc-700 rounded-lg text-white px-5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
                </div>
                <div className="space-y-3">
                   <label className="text-lg font-semibold text-indigo-500">Commission Rate (%)</label>
                   <Input type="number" name="commission_rate" value={formData.commission_rate} onChange={handleChange} className="h-16 text-2xl md:text-2xl bg-zinc-950 border border-zinc-700 rounded-lg text-white px-5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
                </div>
                 <div className="space-y-3">
                    <label className="text-lg font-semibold text-indigo-500">Cookie Duration (Days)</label>
                    <Input type="number" name="cookie_duration" value={formData.cookie_duration} onChange={handleChange} className="h-16 text-2xl md:text-2xl bg-zinc-950 border border-zinc-700 rounded-lg text-white px-5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
                </div>
                <div className="space-y-3">
                    <label className="text-lg font-semibold text-indigo-500">Tracking Method</label>
                    <Input name="tracking_method" value={formData.tracking_method} onChange={handleChange} className="h-16 text-2xl md:text-2xl bg-zinc-950 border border-zinc-700 rounded-lg text-white px-5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
                </div>
                 <div className="space-y-3">
                    <label className="text-lg font-semibold text-indigo-500">Recommended Landing Page URL</label>
                    <Input type="url" name="landing_page_url" value={formData.landing_page_url} onChange={handleChange} className="h-16 text-2xl md:text-2xl bg-zinc-950 border border-zinc-700 rounded-lg text-white px-5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
                </div>
                <div className="space-y-3">
                    <label className="text-lg font-semibold text-indigo-500">Exclusive Deal for Partners</label>
                    <Input name="exclusive_deal" value={formData.exclusive_deal} onChange={handleChange} className="h-16 text-2xl md:text-2xl bg-zinc-950 border border-zinc-700 rounded-lg text-white px-5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
                </div>
              </div>
            </div>

             {/* Technical & Availability */}
             <div className="space-y-6">
              <h3 className="text-3xl font-bold text-[#c27aff] border-b border-zinc-800 pb-4">Technical & Availability</h3>
              <div className="flex flex-col gap-8">
                 <div className="space-y-3">
                    <label className="text-lg font-semibold text-indigo-500">Technical Contact (Email)</label>
                    <Input type="email" name="technical_contact" value={formData.technical_contact} onChange={handleChange} className="h-16 text-2xl md:text-2xl bg-zinc-950 border border-zinc-700 rounded-lg text-white px-5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
                </div>
                <div className="space-y-3">
                    <label className="text-lg font-semibold text-indigo-500">Geo Restrictions</label>
                    <Input name="geo_restrictions" value={formData.geo_restrictions} onChange={handleChange} className="h-16 text-2xl md:text-2xl bg-zinc-950 border border-zinc-700 rounded-lg text-white px-5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
                </div>
                 <div className="space-y-3">
                    <label className="text-lg font-semibold text-indigo-500">Supported Languages</label>
                    <Input name="supported_languages" value={formData.supported_languages} onChange={handleChange} className="h-16 text-2xl md:text-2xl bg-zinc-950 border border-zinc-700 rounded-lg text-white px-5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
                <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white min-w-[200px] h-14 text-lg font-semibold mt-8"
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
