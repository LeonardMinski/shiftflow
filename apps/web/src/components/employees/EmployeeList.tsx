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

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        {employees.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <h3 className="text-lg font-semibold tracking-[-0.02em]">
              No employees yet.
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
              Add your first employee using the form.
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
    </section>
  );
}
