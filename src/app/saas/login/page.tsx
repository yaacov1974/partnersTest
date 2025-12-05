import { AuthForm } from "@/components/auth/AuthForm";

export default function SaaSLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <AuthForm type="saas" mode="login" />
    </div>
  );
}
