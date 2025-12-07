"use client";

import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export default function AffiliateResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <ResetPasswordForm type="affiliate" />
    </div>
  );
}
