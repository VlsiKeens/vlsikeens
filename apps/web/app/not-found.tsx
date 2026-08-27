export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="max-w-xl text-center">
        <h1 className="text-6xl font-bold text-slate-900">404</h1>

        <h2 className="mt-4 text-3xl font-bold text-slate-900">
          Page Not Found
        </h2>

        <p className="mt-6 text-lg text-slate-600">
          Sorry, the page you are looking for does not exist.
        </p>
      </div>
    </main>
  );
}
