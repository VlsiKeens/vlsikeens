import LearningPathCard from "./LearningPathCard";

const learningPaths = [
  {
    level: "Beginner",
    title: "Digital Design",
    description:
      "Build a strong foundation in digital electronics, combinational & sequential circuits, and Verilog HDL.",
    courses: 6,
    duration: "6 Weeks",
    href: "/learning-paths/digital-design",
  },
  {
    level: "Intermediate",
    title: "SystemVerilog & Verification",
    description:
      "Master SystemVerilog, Assertions, Functional Coverage, and verification methodologies.",
    courses: 8,
    duration: "8 Weeks",
    href: "/learning-paths/systemverilog",
  },
  {
    level: "Advanced",
    title: "UVM & Protocols",
    description:
      "Become industry-ready with UVM, AXI, AHB, APB, PCIe, DDR, and real verification projects.",
    courses: 10,
    duration: "12 Weeks",
    href: "/learning-paths/uvm",
  },
];

export default function LearningPaths() {
  return (
    <section
      id="learning-paths"
      className="bg-slate-100 py-24"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <p className="font-semibold uppercase tracking-wider text-blue-600">
            Featured Learning Paths
          </p>

          <h2 className="mt-4 text-4xl font-extrabold text-slate-900">
            Learn Step by Step
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            Structured learning paths designed to take you from fundamentals to
            advanced Design Verification concepts used in the semiconductor
            industry.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {learningPaths.map((path) => (
            <LearningPathCard
              key={path.title}
              {...path}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
