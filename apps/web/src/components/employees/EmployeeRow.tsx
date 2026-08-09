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
  index,
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
        group grid grid-cols-[48px_48px_1fr_auto]
        items-center gap-4 border-b border-black/10
        py-5 transition
        hover:bg-black/2.5
      "
    >
      <span className="font-mono text-xs text-black/30">
        {String(index + 1).padStart(2, "0")}
      </span>

      <div
        className="
          flex h-10 w-10 items-center justify-center
          border border-black/15 bg-[#E8E1D6]
          text-xs font-semibold tracking-wide
        "
        aria-hidden="true"
      >
        {initials}
      </div>

      <div className="min-w-0">
        <h3 className="truncate text-base font-medium tracking-[-0.01em]">
          {employee.name}
        </h3>

        <p className="mt-1 truncate text-sm text-black/45">{employee.email}</p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onEdit(employee)}
          className="text-sm text-black/45 transition hover:text-black"
        >
          Edit
        </button>

        <AlertDialog>
          <AlertDialogTrigger
            disabled={deleting}
            className="text-sm text-red-700 transition hover:text-red-900 disabled:opacity-40"
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
