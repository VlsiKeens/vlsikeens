import Link from "next/link";

export default function BookSessionPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="max-w-2xl rounded-3xl bg-white p-12 shadow-xl">
        <h1 className="text-5xl font-bold text-slate-900">
          Book a Mock Interview
        </h1>

        <p className="mt-6 text-lg leading-8 text-slate-600">
          This page is currently under development.
        </p>

        <p className="mt-4 text-lg leading-8 text-slate-600">
          Soon you&apos;ll be able to schedule mock interviews, career guidance
          sessions, and resume reviews directly through VLSIKeens.
        </p>

        <Link
          href="/"
          className="mt-10 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          ← Back to Home
        </Link>
      </div>
    </main>
  );
}
