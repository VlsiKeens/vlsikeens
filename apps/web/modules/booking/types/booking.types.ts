import type { ReactNode } from "react";

export const EXPERIENCE_LEVELS = [
  "Student",
  "Fresher",
  "0-2 Years",
  "2-5 Years",
  "5+ Years",
] as const;

export type ExperienceLevel =
  (typeof EXPERIENCE_LEVELS)[number];

export const TECHNICAL_DOMAINS = [
  "Design Verification",
  "RTL Design",
  "Physical Design",
  "DFT",
  "STA",
  "Analog Layout",
  "Embedded Systems",
  "Other",
] as const;

export type TechnicalDomain =
  (typeof TECHNICAL_DOMAINS)[number];

export const SESSION_TYPES = [
  "Mock Interview",
  "Resume Review",
  "Career Guidance",
] as const;

export type SessionType =
  (typeof SESSION_TYPES)[number];

export type BookingStatus =
  | "Draft"
  | "Pending"
  | "Confirmed"
  | "Completed"
  | "Cancelled";

export type PaymentStatus =
  | "Pending"
  | "Paid"
  | "Failed"
  | "Refunded";

export interface CandidateDetails {
  fullName: string;
  email: string;
  phone: string;
}

export interface InterviewDetails {
  experience: ExperienceLevel | null;
  domain: TechnicalDomain | null;
  sessionType: SessionType | null;
}

export interface ScheduleDetails {
  date: string;
  time: string;
}

export interface PaymentDetails {
  amount: number;
  status: PaymentStatus;
}

export interface BookingMetadata {
  bookingStatus: BookingStatus;
  notes: string;
}

export interface Booking {
  candidate: CandidateDetails;
  interview: InterviewDetails;
  schedule: ScheduleDetails;
  payment: PaymentDetails;
  metadata: BookingMetadata;
}

export interface BookingContextValue {
  booking: Booking;
  updateBooking: (
    updates: Partial<Booking>
  ) => void;
  resetBooking: () => void;
}

export interface BookingProviderProps {
  children: ReactNode;
}
