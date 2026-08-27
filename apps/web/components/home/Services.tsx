import {
  BadgeCheck,
  BookOpen,
  Cpu,
  FileText,
  GraduationCap,
  Target,
} from "lucide-react";

import ServiceCard from "./ServiceCard";

const services = [
  {
    title: "Mock Interviews",
    description:
      "Practice with real Design Verification interview questions and receive detailed feedback from experienced engineers.",
    href: "/book-session",
    Icon: Target,
  },
  {
    title: "Resume Review",
    description:
      "Optimize your resume to meet industry expectations and improve your chances of getting shortlisted.",
    href: "/services/resume-review",
    Icon: FileText,
  },
  {
    title: "1:1 Mentorship",
    description:
      "Get personalized career guidance, technical mentoring, and interview preparation.",
    href: "/services/mentorship",
    Icon: GraduationCap,
  },
  {
    title: "Courses",
    description:
      "Learn Verilog, SystemVerilog, UVM, Assertions, AXI, APB, PCIe, DDR, and more through structured courses.",
    href: "/courses",
    Icon: BookOpen,
  },
  {
    title: "Hands-on Projects",
    description:
      "Build practical verification projects that strengthen your skills and portfolio.",
    href: "/projects",
    Icon: Cpu,
  },
  {
    title: "Assessments & Certificates",
    description:
      "Evaluate your learning with assessments and earn certificates upon successful completion.",
    href: "/assessments",
    Icon: BadgeCheck,
  },
];

export default function Services() {
  return (
    <section
      id="services"
      className="bg-slate-50 py-24"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <p className="font-semibold uppercase tracking-wider text-blue-600">
            Our Services
          </p>

          <h2 className="mt-4 text-4xl font-extrabold text-slate-900">
            Everything You Need to Build Your VLSI Career
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            Whether you&apos;re preparing for your first interview or aiming for
            a senior verification role, VLSIKeens provides practical guidance,
            mentorship, and learning resources to help you grow.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <ServiceCard
              key={service.title}
              title={service.title}
              description={service.description}
              href={service.href}
              Icon={service.Icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
