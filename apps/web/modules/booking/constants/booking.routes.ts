export const BOOKING_ROUTES = {
  EXPERIENCE: "/book-session/experience",

  DOMAIN: "/book-session/domain",

  SESSION: "/book-session/session",

  SCHEDULE: "/book-session/schedule",

  CONTACT: "/book-session/contact",

  REVIEW: "/book-session/review",

  PAYMENT: "/book-session/payment",

  CONFIRMATION: "/book-session/confirmation",
} as const;

export const BOOKING_STEPS = [
  {
    id: 1,
    title: "Experience",
    route: BOOKING_ROUTES.EXPERIENCE,
  },
  {
    id: 2,
    title: "Domain",
    route: BOOKING_ROUTES.DOMAIN,
  },
  {
    id: 3,
    title: "Session",
    route: BOOKING_ROUTES.SESSION,
  },
  {
    id: 4,
    title: "Schedule",
    route: BOOKING_ROUTES.SCHEDULE,
  },
  {
    id: 5,
    title: "Contact",
    route: BOOKING_ROUTES.CONTACT,
  },
  {
    id: 6,
    title: "Review",
    route: BOOKING_ROUTES.REVIEW,
  },
  {
    id: 7,
    title: "Payment",
    route: BOOKING_ROUTES.PAYMENT,
  },
  {
    id: 8,
    title: "Confirmation",
    route: BOOKING_ROUTES.CONFIRMATION,
  },
] as const;

export const TOTAL_BOOKING_STEPS = BOOKING_STEPS.length;
