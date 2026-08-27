import { Booking, ExperienceLevel, TechnicalDomain, SessionType } from "../types/booking.types";

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
  available: boolean;
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
    id: "student-fresher",
    label: "Student / Fresher",
    description:
      "Preparing for internships, placements, or your first VLSI role.",
  },
  {
    id: "one-to-three-years",
    label: "1–3 Years Experience",
    description:
      "Building deeper expertise and preparing for your next opportunity.",
  },
  {
    id: "three-plus-switching",
    label: "3+ Years — Looking to Switch Jobs",
    description:
      "Planning a role transition or preparing for product-company interviews.",
    badge: "Career Switch",
  },
];

export const DOMAIN_OPTIONS: DomainOption[] = [
  {
    id: "dv",
    label: "Design Verification",
    description:
      "SystemVerilog • UVM • Assertions • Debugging • AXI/APB/SPI/UART",
    badge: "Available",
    available: true,
  },
  {
    id: "rtl",
    label: "RTL Design",
    description:
      "Verilog • FSM Design • Coding • Synthesis • Digital Logic",
    badge: "Under Development",
    available: false,
  },
  {
    id: "pd",
    label: "Physical Design",
    description:
      "Floorplanning • Placement • CTS • Routing • Sign-off",
    badge: "Under Development",
    available: false,
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
    domainAvailabilityAcknowledged: false,
  },
};
