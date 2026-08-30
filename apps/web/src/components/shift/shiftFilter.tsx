import { Search, Users } from "lucide-react";

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
    <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_220px]">
      <div className="relative">
        <label htmlFor="shift-search" className="sr-only">
          Search shifts
        </label>
        <Search
          className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#051f12]"
          aria-hidden
        />
        <input
          id="shift-search"
          type="search"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search shifts..."
          className="h-11 w-full border border-[#c6cbc2] bg-white pl-12 pr-4 text-sm outline-none transition placeholder:text-[#3f433c] focus:border-[#092514] focus:ring-2 focus:ring-[#092514]/20"
        />
      </div>

      <div className="relative">
        <label htmlFor="employee-filter" className="sr-only">
          Filter by employee
        </label>
        <Users
          className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#051f12]"
          aria-hidden
        />
        <select
          id="employee-filter"
          value={selectedEmployeeFilter}
          onChange={(e) => onFilterChange(e.target.value)}
          className="h-11 w-full appearance-none border border-[#c6cbc2] bg-white pl-12 pr-4 text-sm outline-none transition focus:border-[#092514] focus:ring-2 focus:ring-[#092514]/20"
        >
          <option value="">All employees</option>
          <option value="unassigned">Unassigned</option>

          {employees.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
