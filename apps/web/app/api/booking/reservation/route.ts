import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma/client";
import {
  createHeldReservation,
  ReservationConflictError,
  ReservationValidationError,
} from "@/modules/booking/services/reservation.service";

interface CreateReservationBody {
  interviewerId?: unknown;
  userId?: unknown;
  startAt?: unknown;
  endAt?: unknown;
}

function parseDate(value: unknown): Date | null {
  if (typeof value !== "string") {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

export async function POST(request: Request) {
  let body: CreateReservationBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        error: "Invalid JSON request body.",
      },
      {
        status: 400,
      },
    );
  }

  if (typeof body.interviewerId !== "string" || !body.interviewerId) {
    return NextResponse.json(
      {
        error: "interviewerId is required.",
      },
      {
        status: 400,
      },
    );
  }

  const startAt = parseDate(body.startAt);
  const endAt = parseDate(body.endAt);

  if (!startAt || !endAt) {
    return NextResponse.json(
      {
        error: "Valid startAt and endAt are required.",
      },
      {
        status: 400,
      },
    );
  }

  const userId =
    typeof body.userId === "string" && body.userId
      ? body.userId
      : undefined;

  try {
    const interviewer = await prisma.interviewer.findFirst({
      where: {
        id: body.interviewerId,
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
        {
          status: 404,
        },
      );
    }

    const reservation = await prisma.$transaction(
      async (tx) => {
        return createHeldReservation(tx, {
          interviewerId: interviewer.id,
          userId,
          startAt,
          endAt,
        });
      },
      {
        isolationLevel: "Serializable",
      },
    );

    return NextResponse.json(
      {
        reservation: {
          id: reservation.id,
          interviewerId: reservation.interviewerId,
          startAt: reservation.startAt,
          endAt: reservation.endAt,
          status: reservation.status,
          expiresAt: reservation.expiresAt,
        },
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    if (error instanceof ReservationConflictError) {
      return NextResponse.json(
        {
          error: error.message,
          code: "SLOT_UNAVAILABLE",
        },
        {
          status: 409,
        },
      );
    }

    if (error instanceof ReservationValidationError) {
      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: 400,
        },
      );
    }

    console.error("Failed to create reservation:", error);

    return NextResponse.json(
      {
        error: "Unable to reserve the selected time slot.",
      },
      {
        status: 500,
      },
    );
  }
}
