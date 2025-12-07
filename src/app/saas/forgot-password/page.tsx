"use client";

import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export default function SaaSForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <ForgotPasswordForm type="saas" />
    </div>
  );
}
