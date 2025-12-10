"use client";

import { useState, useEffect, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { cn } from "@/lib/utils";

import { OnboardingHeader } from "@/components/OnboardingHeader";
import { Footer } from "@/components/Footer";

// Field Types
type FieldType = "text" | "url" | "number" | "email" | "textarea" | "chips" | "multi-chips";

interface Step {
  field: keyof typeof initialFormData;
  type: FieldType;
  title: string;
  description?: string;
  placeholder?: string;
  options?: string[];
  required?: boolean;
}

const initialFormData = {
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
};

const STEPS: Step[] = [
  {
    field: "name",
    type: "text",
    title: "What is your company's name?",
    placeholder: "e.g. Acme Inc.",
    required: true,
  },
  {
    field: "website",
    type: "url",
    title: "What is your website URL?",
    placeholder: "https://example.com",
    required: true,
  },
  {
    field: "short_description",
    type: "text",
    title: "Give us a short headline.",
    description: "This will be the first thing partners see. Keep it punchy.",
    placeholder: "e.g. The #1 SEO Tool for Agencies",
    required: true,
  },
  {
    field: "long_description",
    type: "textarea",
    title: "Tell us more about your product.",
    description: "Describe features, benefits, and your target audience.",
    placeholder: "My product helps users to...",
  },
  {
    field: "category",
    type: "chips",
    title: "What category best describes your product?",
    options: ["Marketing", "Sales", "Dev Tools", "Finance", "HR", "Productivity", "Design", "Data", "Security", "Other"],
  },
  {
    field: "year_founded",
    type: "number",
    title: "When was the company founded?",
    placeholder: "YYYY",
  },
  {
    field: "commission_model",
    type: "chips",
    title: "What is your commission model?",
    options: ["Recurring %", "One-time", "CPA", "Hybrid", "Performance-based"],
  },
  {
    field: "commission_rate",
    type: "number",
    title: "What is the commission rate (%)?",
    placeholder: "20",
  },
  {
    field: "cookie_duration",
    type: "number",
    title: "What is the cookie duration (days)?",
    placeholder: "30",
  },
  {
    field: "tracking_method",
    type: "chips",
    title: "How do you track referrals?",
    options: ["Link Tracking", "Coupon Code", "Email Attribution", "Pixel Postback"],
  },
  {
    field: "landing_page_url",
    type: "url",
    title: "Where should partners send traffic?",
    description: "The URL where the user will land after clicking the affiliate link.",
    placeholder: "https://example.com/landing",
  },
  {
    field: "exclusive_deal",
    type: "text",
    title: "Do you offer an exclusive deal for partners?",
    placeholder: "e.g. 10% off for first 3 months",
  },
  {
    field: "technical_contact",
    type: "email",
    title: "Technical Contact Email",
    description: "Who should we contact for integration issues?",
    placeholder: "tech@example.com",
  },
  {
    field: "geo_restrictions",
    type: "chips",
    title: "Are there any geographic restrictions?",
    options: ["Global", "North America", "Europe", "US Only", "Asia", "LATAM", "Tier 1 Countries"],
  },
  {
    field: "supported_languages",
    type: "multi-chips",
    title: "Which languages do you support?",
    options: ["English", "Spanish", "French", "German", "Portuguese", "Italian", "Chinese", "Japanese"],
  },
];

export default function SaaSOnboardingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/saas/login");
    }
  }, [user, loading, router]);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleNext();
    }
  };

  const handleChange = (value: string) => {
    const fieldName = STEPS[currentStep].field;
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleMultiChipSelect = (option: string) => {
    const fieldName = STEPS[currentStep].field;
    const currentValues = formData[fieldName].split(",").map((s) => s.trim()).filter(Boolean);
    
    let newValues;
    if (currentValues.includes(option)) {
      newValues = currentValues.filter((v) => v !== option);
    } else {
      newValues = [...currentValues, option];
    }
    
    setFormData((prev) => ({ ...prev, [fieldName]: newValues.join(", ") }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (!user) return;

      const languagesArray = formData.supported_languages.split(",").map((s) => s.trim()).filter((s) => s.length > 0);

      const { error } = await supabase
        .from("saas_companies")
        .update({
          name: formData.name,
          website: formData.website,
          commission_rate: parseFloat(formData.commission_rate) || 0,
          short_description: formData.short_description,
          long_description: formData.long_description,
          category: formData.category,
          year_founded: parseInt(formData.year_founded) || new Date().getFullYear(),
          commission_model: formData.commission_model,
          cookie_duration: parseInt(formData.cookie_duration) || 30,
          landing_page_url: formData.landing_page_url,
          tracking_method: formData.tracking_method,
          partner_program_url: formData.partner_program_url, // Note: Not in steps, assuming it might be same as landing or website
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

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const step = STEPS[currentStep];
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen flex flex-col bg-black text-white font-sans">
      <OnboardingHeader />
      
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 max-w-4xl mx-auto w-full">
        {/* Progress Bar */}
        <div className="w-full max-w-xl mb-12">
           <div className="flex justify-between text-xs text-zinc-500 mb-2 uppercase tracking-widest font-medium">
              <span>Question {currentStep + 1} of {STEPS.length}</span>
              <span>{Math.round(progress)}% Completed</span>
           </div>
           <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-500 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
           </div>
        </div>

        <Card className="w-full max-w-2xl border-none bg-transparent shadow-none">
          <CardContent className="p-0">
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              <div className="space-y-2 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
                  {step.title}
                </h2>
                {step.description && (
                  <p className="text-zinc-400 text-lg">
                    {step.description}
                  </p>
                )}
              </div>

              <div className="min-h-[120px] flex flex-col justify-center">
                {step.type === "textarea" ? (
                   <textarea
                    autoFocus
                    value={formData[step.field]}
                    onChange={(e) => handleChange(e.target.value)}
                    className="w-full bg-transparent border-b-2 border-zinc-700 text-2xl md:text-3xl py-4 text-white placeholder:text-zinc-700 focus:outline-none focus:border-indigo-500 transition-colors resize-none h-32"
                    placeholder={step.placeholder}
                  />
                ) : step.type === "chips" ? (
                  <div className="flex flex-wrap gap-3">
                    {step.options?.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleChange(option)}
                        className={cn(
                          "px-6 py-3 rounded-full text-lg border transition-all duration-200",
                          formData[step.field] === option
                            ? "bg-indigo-600 border-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)]"
                            : "bg-zinc-900/50 border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:bg-zinc-800"
                        )}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                ) : step.type === "multi-chips" ? (
                   <div className="flex flex-wrap gap-3">
                    {step.options?.map((option) => {
                      const isSelected = formData[step.field].includes(option);
                      return (
                        <button
                          key={option}
                          onClick={() => handleMultiChipSelect(option)}
                          className={cn(
                            "px-6 py-3 rounded-full text-lg border transition-all duration-200 flex items-center gap-2",
                            isSelected
                              ? "bg-indigo-600 border-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)]"
                              : "bg-zinc-900/50 border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:bg-zinc-800"
                          )}
                        >
                          {isSelected && <Check className="w-4 h-4" />}
                          {option}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <input
                    autoFocus
                    type={step.type}
                    value={formData[step.field]}
                    onChange={(e) => handleChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-transparent border-b-2 border-zinc-700 text-3xl md:text-5xl py-4 text-white placeholder:text-zinc-700 focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder={step.placeholder}
                  />
                )}
              </div>

              <div className="flex items-center justify-between pt-8">
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className="text-zinc-400 hover:text-white hover:bg-zinc-900 text-lg h-12 px-6"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" /> Back
                </Button>

                <Button
                  onClick={handleNext}
                  disabled={isSubmitting || (step.required && !formData[step.field])}
                  className="bg-white text-black hover:bg-zinc-200 text-lg h-14 px-8 rounded-full font-semibold shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all hover:scale-105"
                >
                  {currentStep === STEPS.length - 1 ? (
                    isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Saving...
                      </>
                    ) : (
                      "Complete Setup"
                    )
                  ) : (
                    <>
                      Next <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>

            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

