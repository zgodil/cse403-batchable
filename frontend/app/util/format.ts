import type {PhoneNumber} from '~/domain/objects';

/**
 * Formats a phone number for display in the UI.
 * @param phoneNumber The phone number to represent
 * @returns A more human-readable version of the phone number
 */
export function formatPhoneNumber(phoneNumber: PhoneNumber): string {
  const match = phoneNumber.compact.match(/(\d{3})(\d{3})(\d{4})/);
  if (!match) return phoneNumber.compact;
  const [, a, b, c] = match;
  return `(${a}) ${b}-${c}`;
}

/**
 * Formats a date and time for display in the UI.
 * @param dateTime The instant to represent
 * @returns A human-readable version of the instant
 */
export function formatDateTime(dateTime: Date): string {
  return dateTime.toString();
}

/**
 * Formats a time interval for display in the UI.
 * @param intervalMs The number of milliseconds in the time interval, the natural result of subtracting dates
 * @returns A human-readable version of the interval
 */
export function formatTimeInterval(intervalMs: number): string {
  const MS_PER_MINUTE = 60 * 1000;
  const minutes = Math.floor(intervalMs / MS_PER_MINUTE);
  const magnitude = `${Math.round(Math.abs(minutes))} min`;
  return minutes < 0 ? `${magnitude} ago` : magnitude;
}
