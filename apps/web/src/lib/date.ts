const parseDate = (value: string): Date => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date value: ${value}`);
  }

  return date;
};

export const toDateTimeLocal = (value: string) => {
  const date = parseDate(value);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const formatTime = (value: string) =>
  parseDate(value).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

/** Splits a `datetime-local` value ("2026-08-26T09:00") into its date and time-of-day parts. */
export const splitDateTimeLocal = (
  value: string,
): { date: string; time: string } => {
  const [date = "", time = ""] = value.split("T");

  return { date, time };
};

const addDays = (date: string, days: number): string => {
  const [year, month, day] = date.split("-").map(Number);
  const shifted = new Date(Date.UTC(year, month - 1, day + days));

  return shifted.toISOString().slice(0, 10);
};

/**
 * Combines a date with a start/end time-of-day into `datetime-local` values.
 * When the end time is not after the start time, the shift is assumed to run
 * past midnight and the end date rolls forward one day (e.g. Date: 26 Aug,
 * Start: 23:00, End: 07:00 -> ends 27 Aug).
 */
export const combineShiftDateAndTime = (
  date: string,
  startTimeOfDay: string,
  endTimeOfDay: string,
): { startTime: string; endTime: string } => {
  const startTime = date && startTimeOfDay ? `${date}T${startTimeOfDay}` : "";

  if (!date || !endTimeOfDay) {
    return { startTime, endTime: "" };
  }

  const endDate =
    startTimeOfDay && endTimeOfDay <= startTimeOfDay
      ? addDays(date, 1)
      : date;

  return { startTime, endTime: `${endDate}T${endTimeOfDay}` };
};
