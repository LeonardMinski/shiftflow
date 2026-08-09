import { EmployeeRow } from "@/components/employees/EmployeeRow";
import { SectionLabel } from "@/components/ui/SectionLabel";
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
      <div className="mb-6 flex items-end justify-between gap-6">
        <div>
          <SectionLabel>Directory</SectionLabel>

          <h2
            id="employee-list-heading"
            className="mt-2 text-2xl font-semibold tracking-[-0.03em]"
          >
            Current employees
          </h2>
        </div>

        <div className="text-right">
          <span className="block font-mono text-2xl tracking-[-0.04em]">
            {String(employees.length).padStart(2, "0")}
          </span>

          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-black/35">
            people
          </span>
        </div>
      </div>

      <div className="border-t border-black/10">
        {employees.length === 0 ? (
          <div className="py-16">
            <SectionLabel>Empty state</SectionLabel>

            <h3 className="mt-3 text-2xl font-medium tracking-[-0.03em]">
              Nobody here yet.
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-black/50">
              Add your first employee using the form alongside the directory.
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
