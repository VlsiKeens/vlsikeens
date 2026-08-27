CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Store the reservation window as a PostgreSQL timestamp range.
ALTER TABLE "Reservation"
ADD COLUMN "timeRange" tsrange
GENERATED ALWAYS AS (
  tsrange("startAt", "endAt", '[)')
) STORED;

-- Prevent overlapping active reservations for the same interviewer.
--
-- HELD       = temporarily blocks the slot
-- CONFIRMED  = blocks the slot permanently
--
-- EXPIRED and CANCELLED reservations do not participate in this constraint.
ALTER TABLE "Reservation"
ADD CONSTRAINT "Reservation_no_overlapping_active_slots"
EXCLUDE USING GIST (
  "interviewerId" WITH =,
  "timeRange" WITH &&
)
WHERE ("status" IN ('HELD', 'CONFIRMED'));

-- A reservation must have a positive duration.
ALTER TABLE "Reservation"
ADD CONSTRAINT "Reservation_valid_time_range"
CHECK ("endAt" > "startAt");
