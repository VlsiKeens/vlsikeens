import {
  Booking,
  ExperienceLevel,
  TechnicalDomain,
  SessionType,
} from "../types/booking.types";

export interface ExperienceOption {
  id: string;
  label: ExperienceLevel;
  description: string;
  badge?: string;
}

export interface DomainOption {
  id: string;
  label: TechnicalDomain;
  description: string;
  badge?: string;
}

export interface SessionOption {
  id: string;
  name: SessionType;
  duration: number;
  price: number;
  description: string;
  badge?: string;
}

export const EXPERIENCE_OPTIONS: ExperienceOption[] = [
  {
    id: "student",
    label: "Student",
    description:
      "Currently pursuing engineering or related studies and preparing for internships or placements.",
  },
  {
    id: "fresher",
    label: "Fresher",
    description:
      "Recently graduated and preparing for your first VLSI opportunity.",
    badge: "Popular",
  },
  {
    id: "0-2",
    label: "0-2 Years",
    description:
      "Early-career engineer looking to strengthen Design Verification fundamentals.",
  },
  {
    id: "2-5",
    label: "2-5 Years",
    description:
      "Preparing for product companies, role transitions, or career growth.",
    badge: "Recommended",
  },
  {
    id: "5-plus",
    label: "5+ Years",
    description:
      "Senior professional seeking advanced technical guidance and interview preparation.",
  },
];

export const DOMAIN_OPTIONS: DomainOption[] = [
  {
    id: "dv",
    label: "Design Verification",
    description:
      "SystemVerilog • UVM • Assertions • Debugging • AXI/APB/SPI/UART",
    badge: "Most Popular",
  },
  {
    id: "rtl",
    label: "RTL Design",
    description:
      "Verilog • FSM Design • Coding • Synthesis • Digital Logic",
  },
  {
    id: "pd",
    label: "Physical Design",
    description:
      "Floorplanning • Placement • CTS • Routing • Sign-off",
  },
  {
    id: "dft",
    label: "DFT",
    description:
      "Scan Chains • ATPG • MBIST • Boundary Scan • Testability",
  },
  {
    id: "sta",
    label: "STA",
    description:
      "Timing Analysis • Constraints • PrimeTime • Timing Closure",
  },
  {
    id: "analog",
    label: "Analog Layout",
    description:
      "Layout • Matching • LVS • DRC • Analog Design Concepts",
  },
  {
    id: "embedded",
    label: "Embedded Systems",
    description:
      "Embedded C • RTOS • Device Drivers • ARM • Firmware Development",
  },
  {
    id: "other",
    label: "Other",
    description:
      "Custom mentoring based on your technical background and career goals.",
  },
];

export const SESSION_OPTIONS: SessionOption[] = [
  {
    id: "mock-interview",
    name: "Mock Interview",
    duration: 60,
    price: 999,
    badge: "Best Seller",
    description:
      "A one-to-one mock interview covering VLSI fundamentals, SystemVerilog/UVM, protocol concepts, debugging, coding, and detailed feedback.",
  },
  {
    id: "resume-review",
    name: "Resume Review",
    duration: 30,
    price: 499,
    badge: "Quick",
    description:
      "Professional resume review with ATS optimization, recruiter perspective, project improvements, and personalized suggestions.",
  },
  {
    id: "career-guidance",
    name: "Career Guidance",
    duration: 45,
    price: 799,
    badge: "Recommended",
    description:
      "Career planning session covering learning roadmap, interview strategy, company targeting, and skill development.",
  },
];

export const TIME_SLOTS = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
] as const;

export const DEFAULT_BOOKING: Booking = {
  candidate: {
    fullName: "",
    email: "",
    phone: "",
  },

  interview: {
    experience: null,
    domain: null,
    sessionType: null,
  },

  schedule: {
    date: "",
    time: "",
  },

  payment: {
    amount: 0,
    status: "Pending",
  },

  metadata: {
    bookingStatus: "Draft",
    notes: "",
  },
};
