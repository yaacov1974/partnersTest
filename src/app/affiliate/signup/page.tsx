"use client";

import { AuthForm } from "@/components/auth/AuthForm";

export default function AffiliateSignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <AuthForm type="affiliate" mode="signup" />
    </div>
  );
}
