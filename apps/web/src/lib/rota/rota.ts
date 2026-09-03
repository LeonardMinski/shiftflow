export const isSameDay = (dateA: Date, dateB: Date): boolean => {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
};

type ShiftLike = {
  employeeId: string | null;
  startTime: string;
};

export const getShiftsForEmployeeOnDay = <T extends ShiftLike>(
  employeeId: string,
  day: Date,
  shifts: T[],
): T[] => {
  return shifts.filter(
    (shift) =>
      shift.employeeId === employeeId &&
      isSameDay(new Date(shift.startTime), day),
  );
};

export const getWeekDays = (date: Date): Date[] => {
  const days = [0, 1, 2, 3, 4, 5, 6];

  return days.map((number) => {
    const newDate = new Date(date);

    newDate.setDate(newDate.getDate() + number);

    return newDate;
  });
};

export const getStartOfTheWeek = (date: Date): Date => {
  const weekday = date.getDay();
  const daysSinceMonday = (weekday + 6) % 7;

  const monday = new Date(date);

  monday.setDate(monday.getDate() - daysSinceMonday);
  monday.setHours(0, 0, 0, 0);

  return monday;
};

/**
 * A timezone-stable key for the week a (local) Monday `weekStart` belongs to.
 * `weekStart.toISOString()` would re-express local midnight in UTC, which
 * shifts the calendar date for any non-UTC-zero timezone - silently
 * corrupting week-boundary comparisons (e.g. publish state) for anyone not
 * on UTC. This instead takes the local Y/M/D directly as the key.
 */
export const toWeekStartKey = (weekStart: Date): string => {
  const year = weekStart.getFullYear();
  const month = String(weekStart.getMonth() + 1).padStart(2, "0");
  const day = String(weekStart.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}T00:00:00.000Z`;
};

export const formatShiftTime = (time: string): string => {
  return new Date(time).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
};
