import type { Employee } from "@/types";
import { getInitials } from "@/lib/utils";

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
  const availableDays = employee.availability.filter(
    (record) => record.available,
  ).length;

  return (
    <article className="flex flex-col gap-4 border-b border-border px-5 py-4 transition last:border-b-0 hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-4">
        <div
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-medium text-accent-foreground"
          aria-hidden="true"
        >
          {getInitials(employee.name)}
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-base font-medium tracking-[-0.01em] text-foreground">
            {employee.name}
          </h3>
          <p className="truncate text-sm text-muted-foreground">
            {employee.email}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 sm:shrink-0">
        <span className="inline-flex rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
          Available {availableDays} {availableDays === 1 ? "day" : "days"}
        </span>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onEdit(employee)}
            className="text-sm font-medium text-primary transition hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Edit
          </button>

          <AlertDialog>
            <AlertDialogTrigger
              disabled={deleting}
              className="text-sm font-medium text-destructive transition hover:text-destructive/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive disabled:opacity-40"
            >
              Delete
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete {employee.name}?</AlertDialogTitle>

                <AlertDialogDescription>
                  This will permanently remove this employee from the
                  directory.
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
      </div>
    </article>
  );
}
