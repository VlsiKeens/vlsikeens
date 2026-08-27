import AuthCard from "@/modules/auth/components/AuthCard";
import AuthHeader from "@/modules/auth/components/AuthHeader";
import LoginForm from "@/modules/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12">
      <AuthCard>
        <AuthHeader
          title="Welcome Back"
          subtitle="Sign in to continue your VLSIKeens journey."
        />

        <LoginForm />
      </AuthCard>
    </main>
  );
}
