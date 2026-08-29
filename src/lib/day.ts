const TIME_ZONE = process.env.NEXT_PUBLIC_APP_TIMEZONE || "Asia/Kolkata";

const formatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** Calendar day key (YYYY-MM-DD) in the app timezone. */
export function dayKey(date: Date = new Date()): string {
  return formatter.format(date);
}

export function shiftDay(day: string, deltaDays: number): string {
  const d = new Date(`${day}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + deltaDays);
  return d.toISOString().slice(0, 10);
}

export function lastDays(count: number, endDay: string = dayKey()): string[] {
  return Array.from({ length: count }, (_, i) => shiftDay(endDay, i - count + 1));
}

/** Monday-based start of the ISO week containing `day`. */
export function weekStart(day: string = dayKey()): string {
  const d = new Date(`${day}T12:00:00Z`);
  const dow = (d.getUTCDay() + 6) % 7;
  return shiftDay(day, -dow);
}

export function isWeekend(day: string = dayKey()): boolean {
  const dow = new Date(`${day}T12:00:00Z`).getUTCDay();
  return dow === 0 || dow === 6;
}

export function prettyDay(day: string): string {
  return new Date(`${day}T12:00:00Z`).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function shortDay(day: string): string {
  return new Date(`${day}T12:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}
