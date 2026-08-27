import AuthCard from "@/modules/auth/components/AuthCard";
import AuthHeader from "@/modules/auth/components/AuthHeader";
import RegisterForm from "@/modules/auth/components/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12">
      <AuthCard>
        <AuthHeader
          title="Create Account"
          subtitle="Join VLSIKeens and start your learning journey."
        />

        <Suspense>
          <RegisterForm />
        </Suspense>
      </AuthCard>
    </main>
  );
}
import { Suspense } from "react";
