import Link from "next/link";
import { ArrowLeft, Construction } from "lucide-react";

interface ComingSoonProps {
  featureName: string;
}

export default function ComingSoon({
  featureName,
}: ComingSoonProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 px-6 py-16">
      <section className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl sm:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
          <Construction className="h-8 w-8 text-blue-600" aria-hidden="true" />
        </div>

        <p className="mt-7 text-sm font-semibold uppercase tracking-widest text-blue-600">
          Under development
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {featureName} is coming soon
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-slate-600">
          We&apos;re building this VLSIKeens experience with the same practical,
          industry-focused approach as our mentoring sessions. Please check back
          soon.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to VLSIKeens
        </Link>
      </section>
    </main>
  );
}
