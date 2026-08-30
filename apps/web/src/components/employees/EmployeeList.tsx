import { EmployeeRow } from "@/components/employees/EmployeeRow";
import type { Employee } from "@/types";

type EmployeeListProps = {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (id: string) => void;
  deleting: boolean;
};

export function EmployeeList({
  employees,
  onEdit,
  onDelete,
  deleting,
}: EmployeeListProps) {
  return (
    <section aria-labelledby="employee-list-heading">
      <h2 id="employee-list-heading" className="sr-only">
        Current employees
      </h2>

      <div className="overflow-hidden border border-[#c6cbc2] bg-white">
        <div className="grid grid-cols-[minmax(0,1fr)_130px_200px_150px] border-b border-[#c6cbc2] bg-[#f6f3ed] px-5 py-4 text-sm uppercase tracking-[0.08em] text-[#051f12] max-lg:hidden">
          <span>Employee</span>
          <span>Role</span>
          <span>Availability Summary</span>
          <span className="text-right">Actions</span>
        </div>

        {employees.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <h3 className="text-2xl font-semibold tracking-[-0.03em]">
              No employees yet.
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#3f433c]">
              Add your first employee using the directory form.
            </p>
          </div>
        ) : (
          employees.map((employee, index) => (
            <EmployeeRow
              key={employee.id}
              employee={employee}
              index={index}
              onEdit={onEdit}
              onDelete={onDelete}
              deleting={deleting}
            />
          ))
        )}
      </div>

      <p className="mt-6 text-sm text-[#3f433c]">
        Showing 1 to {employees.length} of {employees.length} employees
      </p>
    </section>
  );
}
