"use client";

interface DomainAvailabilityModalProps {
  open: boolean;
  onClose: () => void;
}

export default function DomainAvailabilityModal({ open, onClose }: DomainAvailabilityModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-6" role="dialog" aria-modal="true" aria-labelledby="domain-availability-title">
      <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Current availability</p>
        <h2 id="domain-availability-title" className="mt-3 text-2xl font-bold text-slate-900">Design Verification is available now</h2>
        <p className="mt-3 leading-7 text-slate-600">RTL Design and Physical Design are under development. You can book a Design Verification session today.</p>
        <button type="button" onClick={onClose} className="mt-6 w-full rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700">Continue</button>
      </div>
    </div>
  );
}
