import { Shift } from "@/types/shifts";

export function filterShifts(
  shifts: Shift[],
  selectedEmployeeFilter: string,
  searchTerm: string,
): Shift[] {
  return shifts.filter((shift) => {
    const matchesEmployee =
      selectedEmployeeFilter === "" ||
      (selectedEmployeeFilter === "unassigned"
        ? shift.employee === null
        : shift.employee?.id === selectedEmployeeFilter);

    const matchesTitle = shift.title
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase());

    return matchesEmployee && matchesTitle;
  });
}

