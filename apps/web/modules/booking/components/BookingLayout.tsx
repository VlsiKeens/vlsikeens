"use client";

import type { ReactNode } from "react";
import Link from "next/link";

import PrimaryButton from "@/components/common/PrimaryButton";
import ProgressBar from "@/components/common/ProgressBar";

interface BookingLayoutProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
  onNext?: () => void;
  onBack?: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
  backLabel?: string;
}

export default function BookingLayout({
  title,
  subtitle,
  children,
  currentStep,
  totalSteps,
  onNext,
  onBack,
  nextDisabled = false,
  nextLabel = "Continue",
  backLabel = "Back",
}: BookingLayoutProps) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6 py-10">
        <div className="w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">

          {/* Header */}
          <header className="border-b border-slate-200 px-10 py-8">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="text-2xl font-bold tracking-tight text-slate-900"
              >
                VLSI<span className="text-indigo-600">Keens</span>
              </Link>

              <div className="rounded-full bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700">
                Step {currentStep} / {totalSteps}
              </div>
            </div>

            <div className="mt-8">
              <ProgressBar
                current={currentStep}
                total={totalSteps}
              />
            </div>

            {(title || subtitle) && (
              <div className="mt-8">
                {title && (
                  <h1 className="text-4xl font-bold tracking-tight text-slate-900">
                    {title}
                  </h1>
                )}

                {subtitle && (
                  <p className="mt-3 max-w-2xl text-lg leading-7 text-slate-600">
                    {subtitle}
                  </p>
                )}
              </div>
            )}
          </header>

          {/* Content */}
          <section className="min-h-[420px] bg-slate-50 px-10 py-10">
            {children}
          </section>

          {/* Footer */}
          <footer className="flex items-center justify-between border-t border-slate-200 bg-white px-10 py-6">
            <PrimaryButton
              variant="outline"
              onClick={onBack}
            >
              ← {backLabel}
            </PrimaryButton>

            <PrimaryButton
              onClick={onNext}
              disabled={nextDisabled}
            >
              {nextLabel} →
            </PrimaryButton>
          </footer>
        </div>
      </div>
    </main>
  );
}
