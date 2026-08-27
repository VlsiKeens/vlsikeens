import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma/client";
import {
  AvailabilityValidationError,
  getInterviewerAvailability,
} from "@/modules/booking/services/availability.service";

function parseDate(value: string | null): Date | null {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

export async function GET(request: Request) {
  const url = new URL(request.url);

  const interviewerId = url.searchParams.get("interviewerId");
  const start = parseDate(url.searchParams.get("start"));
  const end = parseDate(url.searchParams.get("end"));

  if (!interviewerId) {
    return NextResponse.json(
      {
        error: "interviewerId is required.",
      },
      { status: 400 },
    );
  }

  if (!start || !end) {
    return NextResponse.json(
      {
        error: "Valid start and end dates are required.",
      },
      { status: 400 },
    );
  }

  try {
    const interviewer = await prisma.interviewer.findFirst({
      where: {
        id: interviewerId,
        isActive: true,
      },
      select: {
        id: true,
      },
    });

    if (!interviewer) {
      return NextResponse.json(
        {
          error: "Interviewer not found or inactive.",
        },
        { status: 404 },
      );
    }

    const availability = await prisma.$transaction(
      async (tx) => {
        return getInterviewerAvailability(
          tx,
          interviewer.id,
          start,
          end,
        );
      },
    );

    return NextResponse.json({
      availability,
    });
  } catch (error) {
    if (error instanceof AvailabilityValidationError) {
      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 400 },
      );
    }

    console.error("Failed to load interviewer availability:", error);

    return NextResponse.json(
      {
        error: "Unable to load availability.",
      },
      { status: 500 },
    );
  }
}
