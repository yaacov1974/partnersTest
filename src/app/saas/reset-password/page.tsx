import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export default function SaaSResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <ResetPasswordForm type="saas" />
    </div>
  );
}
