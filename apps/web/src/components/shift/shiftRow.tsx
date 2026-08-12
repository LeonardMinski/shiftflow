import type { Shift } from "@/types/shifts";

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

type ShiftRowProps = {
  shift: Shift;
  index: number;
  onEdit: (shift: Shift) => void;
  onDelete: (id: string) => void;
  updating: boolean;
  deleting: boolean;
};

export default function ShiftRow({
  shift,
  index,
  onEdit,
  onDelete,
  updating,
  deleting,
}: ShiftRowProps) {
  const startTime = new Date(Number(shift.startTime)).toLocaleTimeString(
    "en-GB",
    {
      hour: "2-digit",
      minute: "2-digit",
    },
  );

  const endTime = new Date(Number(shift.endTime)).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <article
      className="
        group grid gap-4
        border-b border-black/10 py-5
        transition hover:bg-black/2.5
        sm:grid-cols-[48px_1fr_auto]
        sm:items-center
      "
    >
      <span className="font-mono text-xs text-black/30">
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="text-base font-medium tracking-[-0.01em]">
            {shift.title}
          </h3>

          <span className="font-mono text-xs text-black/35">
            {startTime} — {endTime}
          </span>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <span
            className={`
              inline-block h-2 w-2 rounded-full
              ${shift.employee ? "bg-black/60" : "bg-[#FF5A36]"}
            `}
            aria-hidden="true"
          />

          <p className="text-sm text-black/45">
            {shift.employee ? shift.employee.name : "Unassigned"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onEdit(shift)}
          disabled={updating}
          className="
            text-sm text-black/45 transition
            hover:text-black
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
        >
          Edit
        </button>

        <AlertDialog>
          <AlertDialogTrigger
            disabled={deleting}
            className="
              text-sm text-red-700 transition
              hover:text-red-900
              disabled:opacity-40
            "
          >
            {deleting ? "Deleting…" : "Delete"}
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete {shift.title}?</AlertDialogTitle>

              <AlertDialogDescription>
                This will permanently remove this shift from the schedule.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>

              <AlertDialogAction onClick={() => onDelete(shift.id)}>
                Delete shift
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </article>
  );
}
