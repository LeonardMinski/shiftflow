import { Employee, EmployeeAvailability } from "@/types";

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function getAvailabilityForShift(
  employee: Employee,
  startTime: string,
): EmployeeAvailability | undefined {
  const shiftDayNumber = new Date(startTime).getDay();
  const shiftDay = days[shiftDayNumber];

  return employee.availability.find((record) => record.dayOfWeek === shiftDay);
}

export function isShiftWithinAvailability(
  employee: Employee,
  startTime: string,
  endTime: string,
) {
  const shiftStartTime = startTime.slice(11);
  const shiftEndTime = endTime.slice(11);
  const matchingAvailability = getAvailabilityForShift(employee, startTime);

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
