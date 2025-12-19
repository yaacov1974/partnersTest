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
};

const STEPS: Step[] = [
  {
    field: "full_name",
    type: "text",
    title: "What is your full name?",
    description: "Or company name if you are an agency.",
    placeholder: "e.g. John Doe",
    required: true,
  },
  {
    field: "phone",
    type: "text",
    title: "What is your phone number?",
    placeholder: "+1 234 567 890",
  },
  {
    field: "country",
    type: "text",
    title: "Where are you based?",
    placeholder: "e.g. USA, UK, Israel",
    required: true,
  },
  {
    field: "promotion_platform",
    type: "chips",
    title: "How do you promote products?",
    options: ["Social Media", "Blog", "YouTube", "Email List", "Podcast", "Ads", "Other"],
  },
  {
    field: "platform_url",
    type: "url",
    title: "Link to your main channel",
    description: "Where can we see your content?",
    placeholder: "https://instagram.com/johndoe",
  },
  {
    field: "audience_size",
    type: "text",
    title: "How big is your audience?",
    description: "Approximate monthly traffic or followers.",
    placeholder: "e.g. 50k followers",
  },
  {
    field: "niche",
    type: "text",
    title: "What is your primary niche?",
    placeholder: "e.g. Tech, Finance, Lifestyle",
  },
  {
    field: "payment_method",
    type: "chips",
    title: "Preferred payment method",
    options: ["PayPal", "Bank Transfer", "Payoneer"],
  },
  {
    field: "preferred_currency",
    type: "chips",
    title: "Preferred currency",
    options: ["USD", "EUR", "ILS"],
  },
  {
    field: "payment_details",
    type: "text",
    title: "Payment Details",
    description: "PayPal email or Bank Account IBAN/SWIFT",
    placeholder: "john@example.com",
    required: true,
  },
  {
    field: "tax_info",
    type: "text",
    title: "Tax ID / VAT Number",
    description: "If applicable for invoicing.",
    placeholder: "VAT #123456789",
  },
];

export default function AffiliateOnboardingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/affiliate/login");
    }
  }, [user, loading, router]);

  // Verify user has the correct role for this onboarding
  useEffect(() => {
    const checkRole = async () => {
      if (!user) return;
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();
      
      if (profile && profile.role === 'saas') {
        console.log("User is SaaS, redirecting to SaaS onboarding");
        router.push('/saas/onboarding');
      }
    };
    
    if (!loading && user) {
      checkRole();
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

  const mapFieldValue = (field: keyof typeof initialFormData, value: string) => {
      // Helper to handle specific conversions if needed, currently strings match
      return value;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (!user) return;

      const payload = {
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
          bio: `Niche: ${formData.niche}. Platform: ${formData.promotion_platform}`,
          onboarding_completed: true,
      };

      // Check if partner record exists
      const { data: existingPartner } = await supabase
        .from('partners')
        .select('id')
        .eq('profile_id', user.id)
        .maybeSingle();

      if (existingPartner) {
        const { error } = await supabase
          .from("partners")
          .update(payload)
          .eq("profile_id", user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("partners")
          .insert({
            profile_id: user.id,
            ...payload
          });
        if (error) throw error;
      }

      router.push("/affiliate/dashboard");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      setErrorDetails(error.message || "An unexpected error occurred.");
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
                className="h-full bg-purple-600 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
           </div>
        </div>

        <Card className="w-full max-w-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm p-6 sm:p-10 scale-90 origin-center">
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
                    className="w-full bg-transparent border-b-2 border-zinc-700 text-2xl md:text-3xl py-4 text-white placeholder:text-zinc-700 focus:outline-none focus:border-purple-500 transition-colors resize-none h-32"
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
                            ? "bg-purple-600 border-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.5)]"
                            : "bg-zinc-900/50 border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:bg-zinc-800"
                        )}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                ) : (
                  <input
                    autoFocus
                    type={step.type}
                    value={formData[step.field]}
                    onChange={(e) => handleChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-transparent border-b-2 border-zinc-700 text-3xl md:text-5xl py-4 text-white placeholder:text-zinc-700 focus:outline-none focus:border-purple-500 transition-colors"
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
                   className={cn(
                    "text-lg h-14 px-8 rounded-full font-semibold transition-all hover:scale-105",
                    !step.required && !formData[step.field] && currentStep !== STEPS.length - 1
                      ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white border border-zinc-700"
                      : "bg-white text-black hover:bg-zinc-200 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                  )}
                >
                  {currentStep === STEPS.length - 1 ? (
                    isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Saving...
                      </>
                    ) : (
                      "Complete Profile"
                    )
                  ) : (
                    <>
                      {!step.required && !formData[step.field] ? "Skip" : "Next"} <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}

                </Button>
              </div>

              {errorDetails && (
                 <div className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
                    {errorDetails}
                    <button 
                        onClick={() => { setErrorDetails(null); handleSubmit(); }} 
                        className="ml-2 underline font-semibold hover:text-red-400"
                    >
                        Try Again
                    </button>
                 </div>
              )}

            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

