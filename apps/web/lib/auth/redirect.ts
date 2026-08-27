export const DEFAULT_BOOKING_RETURN_PATH = "/book-session/experience";

export function getSafeReturnPath(value: unknown): string {
  if (
    typeof value === "string" &&
    value.startsWith("/") &&
    !value.startsWith("//")
  ) {
    return value;
  }

  return DEFAULT_BOOKING_RETURN_PATH;
}
