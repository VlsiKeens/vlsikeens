"use client";

interface BookingStepperProps {
  currentStep: number;
}

const steps = [
  "Experience",
  "Domain",
  "Schedule",
  "Review",
  "Payment",
  "Confirmation",
];

export default function BookingStepper({
  currentStep,
}: BookingStepperProps) {
  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => (
        <div
          key={step}
          className="flex flex-1 items-center"
        >
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold
            ${
              index + 1 <= currentStep
                ? "bg-blue-600 text-white"
                : "bg-slate-200 text-slate-600"
            }`}
          >
            {index + 1}
          </div>

          <span className="ml-3 hidden text-sm font-medium md:block">
            {step}
          </span>

          {index !== steps.length - 1 && (
            <div
              className={`mx-4 h-1 flex-1 rounded
              ${
                index + 1 < currentStep
                  ? "bg-blue-600"
                  : "bg-slate-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
