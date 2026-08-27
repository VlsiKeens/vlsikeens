import {
  ClipboardCheck,
  MessagesSquare,
  FileCheck2,
  Route,
} from "lucide-react";

const steps = [
  {
    icon: ClipboardCheck,
    title: "Focused Preparation",
    description:
      "Choose a session that matches your experience level, goals, and Design Verification focus.",
  },
  {
    icon: MessagesSquare,
    title: "Practical Expert Insight",
    description:
      "Work through realistic interview topics and career questions with an industry-focused mentor.",
  },
  {
    icon: FileCheck2,
    title: "Actionable Feedback",
    description:
      "Get personalized feedback on your technical knowledge, communication, resume, and interview performance.",
  },
  {
    icon: Route,
    title: "A Clear Next Step",
    description:
      "Leave with priorities for your preparation, stronger confidence, and a focused path toward your next opportunity.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-20 max-w-3xl text-center">
          <p className="font-semibold uppercase tracking-widest text-blue-600">
            How It Works
          </p>

          <h2 className="mt-4 text-4xl font-extrabold text-slate-900">
            More Than a Practice Session
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            Every VLSIKeens session is designed to turn your current experience
            into clear, practical progress for your VLSI career.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className="relative rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100">
                  <Icon size={28} className="text-blue-600" />
                </div>

                <span className="mb-4 inline-flex rounded-full bg-blue-600 px-3 py-1 text-sm font-semibold text-white">
                  Step {index + 1}
                </span>

                <h3 className="mt-4 text-2xl font-bold text-slate-900">
                  {step.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-600">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
