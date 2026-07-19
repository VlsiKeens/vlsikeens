import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface ServiceCardProps {
  title: string;
  description: string;
  href: string;
  Icon: LucideIcon;
}

export default function ServiceCard({
  title,
  description,
  href,
  Icon,
}: ServiceCardProps) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl"
    >
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 transition-colors group-hover:bg-blue-600">
        <Icon
          size={28}
          className="text-blue-600 transition-colors group-hover:text-white"
        />
      </div>

      <h3 className="mb-4 text-xl font-bold text-slate-900">
        {title}
      </h3>

      <p className="leading-7 text-slate-600">
        {description}
      </p>

      <span className="mt-6 inline-flex items-center font-semibold text-blue-600">
        Learn More →
      </span>
    </Link>
  );
}
