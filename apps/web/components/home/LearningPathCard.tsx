import Link from "next/link";
import { ArrowRight, Clock, Layers } from "lucide-react";

interface LearningPathCardProps {
  level: string;
  title: string;
  description: string;
  courses: number;
  duration: string;
  href: string;
}

export default function LearningPathCard({
  level,
  title,
  description,
  courses,
  duration,
  href,
}: LearningPathCardProps) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl">
      <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
        {level}
      </span>

      <h3 className="mt-5 text-2xl font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-4 leading-7 text-slate-600">
        {description}
      </p>

      <div className="mt-6 space-y-3">
        <div className="flex items-center gap-2 text-slate-600">
          <Layers size={18} />
          <span>{courses} Courses</span>
        </div>

        <div className="flex items-center gap-2 text-slate-600">
          <Clock size={18} />
          <span>{duration}</span>
        </div>
      </div>

      <Link
        href={href}
        className="mt-8 inline-flex items-center gap-2 font-semibold text-blue-600 transition-colors group-hover:text-blue-700"
      >
        Explore Path
        <ArrowRight size={18} />
      </Link>
    </div>
  );
}
