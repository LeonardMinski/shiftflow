import { Shift } from "@/types";

export const isSameDay = (dateA: Date, dateB: Date): boolean => {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
};

export const getShiftsForEmployeeOnDay = (
  employeeId: string,
  day: Date,
  shifts: Shift[],
): Shift[] => {
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

export const formatShiftTime = (time: string): string => {
  return new Date(time).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
};
