import { Employee } from "@/types";

type ShiftFilterProps = {
  employees: Employee[];
  searchTerm: string;
  selectedEmployeeFilter: string;
  onFilterChange: (value: string) => void;
  onSearchChange: (value: string) => void;
};

export default function ShiftFilter({
  selectedEmployeeFilter,
  employees,
  searchTerm,
  onFilterChange,
  onSearchChange,
}: ShiftFilterProps) {
  return (
    <>
      <label htmlFor="shift-search">Search shifts</label>

      <input
        id="shift-search"
        type="search"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder=" Search by title"
      />

      <label htmlFor="employee-filter">Filter by employee</label>

      <select
        id="employee-filter"
        value={selectedEmployeeFilter}
        onChange={(e) => onFilterChange(e.target.value)}
      >
        <option value="">All employees</option>
        <option value="unassigned">Unassigned</option>

        {employees.map((employee) => (
          <option key={employee.id} value={employee.id}>
            {employee.name}
          </option>
        ))}
      </select>
    </>
  );
}
