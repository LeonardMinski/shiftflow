import type { Employee } from "@/types";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type EmployeeRowProps = {
  employee: Employee;
  index: number;
  onEdit: (employee: Employee) => void;
  onDelete: (id: string) => void;
  deleting: boolean;
};

export function EmployeeRow({
  employee,
  onEdit,
  onDelete,
  deleting,
}: EmployeeRowProps) {
  const initials = employee.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <article
      className="
        grid gap-4 border-b border-[#c6cbc2] px-5 py-5
        transition last:border-b-0 hover:bg-[#fbfaf7]
        lg:grid-cols-[minmax(0,1fr)_130px_200px_150px]
        lg:items-center
      "
    >
      <div className="flex min-w-0 items-center gap-4">
        <div
          className="
            flex size-12 shrink-0 items-center justify-center rounded-full
            border border-[#f3c987] bg-[#ffdda8]
            text-lg font-medium tracking-wide
          "
          aria-hidden="true"
        >
          {initials}
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-lg font-medium tracking-[-0.02em]">
            {employee.name}
          </h3>

          <p className="mt-1 truncate text-sm text-[#3f433c]">
            {employee.email}
          </p>
        </div>
      </div>

      <div>
        <span className="inline-flex border border-[#c6cbc2] bg-[#efede8] px-3 py-1 font-mono text-xs">
          Team
        </span>
      </div>

      <p className="text-sm leading-6 text-[#051f12]">
        {employee.availability.length}{" "}
        {employee.availability.length === 1 ? "day" : "days"} available
        {employee.availability.length > 0 && (
          <span className="block text-[#3f433c]">
            {employee.availability
              .map((availability) => availability.dayOfWeek.slice(0, 3))
              .join(", ")}
          </span>
        )}
      </p>

      <div className="flex items-center gap-3 lg:justify-end">
        <button
          type="button"
          onClick={() => onEdit(employee)}
          className="text-sm font-medium text-[#52642b] transition hover:text-[#092514] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#092514]"
        >
          Edit
        </button>

        <AlertDialog>
          <AlertDialogTrigger
            disabled={deleting}
            className="text-sm font-medium text-red-700 transition hover:text-red-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700 disabled:opacity-40"
          >
            Delete
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete {employee.name}?</AlertDialogTitle>

              <AlertDialogDescription>
                This will permanently remove this employee from the directory.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>

              <AlertDialogAction onClick={() => onDelete(employee.id)}>
                Delete employee
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </article>
  );
}
