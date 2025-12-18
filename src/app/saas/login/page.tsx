import { AuthForm } from "@/components/auth/AuthForm";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default function SaaSLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <Suspense fallback={
        <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }>
        <AuthForm type="saas" mode="login" />
      </Suspense>
    </div>
  );
}
