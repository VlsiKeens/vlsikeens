import Image from "next/image";
import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-[90vh] items-center overflow-hidden bg-slate-50"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-slate-100" />

      <div className="relative mx-auto grid max-w-7xl gap-16 px-6 py-20 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="mb-5 inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            Designed for Design Verification Engineers
          </p>

          <h1 className="text-6xl font-black leading-tight text-slate-900">
            Build Your
            <span className="block text-blue-600">
              Dream Career
            </span>
          </h1>

          <p className="mt-8 max-w-xl text-xl leading-8 text-slate-600">
            Mock Interviews, Resume Reviews, Career Guidance,
            Technical Mentorship and Industry Insights —
            everything you need to land your dream VLSI job.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button href="/book-session">
              Book Mock Interview
            </Button>

            <Button
              variant="secondary"
              href="#services"
            >
              Explore Services
            </Button>
          </div>
        </div>

        <div className="flex justify-center">
          <Image
            src="/images/hero.png"
            alt="VLSIKeens Hero"
            width={700}
            height={700}
            priority
            className="rounded-3xl shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}
