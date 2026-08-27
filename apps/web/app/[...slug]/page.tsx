import { notFound } from "next/navigation";

import ComingSoon from "@/components/common/ComingSoon";

const comingSoonFeatures: Record<string, string> = {
  "services/resume-review": "Resume Review",
  "services/mentorship": "1:1 Mentorship",
  courses: "Courses",
  projects: "Hands-on Projects",
  assessments: "Assessments & Certificates",
};

interface ComingSoonPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export default async function ComingSoonPage({
  params,
}: ComingSoonPageProps) {
  const { slug } = await params;
  const featureName = comingSoonFeatures[slug.join("/")];

  if (!featureName) {
    notFound();
  }

  return <ComingSoon featureName={featureName} />;
}
