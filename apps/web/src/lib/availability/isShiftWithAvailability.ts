import { Employee } from "@/types";

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function isShiftWithinAvailability(
  employee: Employee,
  startTime: string,
  endTime: string,
) {
  const shiftDayNumber = new Date(startTime).getDay();

  const shiftDay = days[shiftDayNumber];
  const shiftStartTime = startTime.slice(11);
  const shiftEndTime = endTime.slice(11);
  const matchingAvailability = employee.availability.find(
    (record) => record.dayOfWeek === shiftDay,
  );

  if (!matchingAvailability) {
    return true;
  }

  if (!matchingAvailability.available) {
    return false;
  }

  if (
    matchingAvailability.startTime === null ||
    matchingAvailability.endTime === null
  ) {
    return false;
  }
  return (
    shiftStartTime >= matchingAvailability.startTime &&
    shiftEndTime <= matchingAvailability.endTime
  );
}
