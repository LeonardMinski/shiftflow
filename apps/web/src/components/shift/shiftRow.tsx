import type { Shift } from "@/types/shifts";
import { CalendarClock, Trash2 } from "lucide-react";

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

const formatShiftDisplayTime = (value: string) =>
  new Date(value).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

export default function ShiftRow({
  shift,
  index,
  onEdit,
  onDelete,
  updating,
  deleting,
}: ShiftRowProps) {
  const startTime = formatShiftDisplayTime(shift.startTime);
  const endTime = formatShiftDisplayTime(shift.endTime);

  return (
    <article
      className="
        grid gap-4 border-b border-[#c6cbc2] px-5 py-5
        transition last:border-b-0 hover:bg-[#fbfaf7]
        sm:grid-cols-[48px_1fr_auto]
        sm:items-center
      "
    >
      <span className="flex size-10 items-center justify-center rounded-full bg-[#f6f3ed] text-[#52642b]">
        <CalendarClock className="size-5" aria-hidden />
        <span className="sr-only">
          Shift {String(index + 1).padStart(2, "0")}
        </span>
      </span>

      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="text-lg font-medium tracking-[-0.02em]">
            {shift.title}
          </h3>

          <span className="font-mono text-sm text-[#051f12]">
            {startTime} - {endTime}
          </span>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <span
            className={`
              inline-block size-2 rounded-full
              ${shift.employee ? "bg-[#052311]" : "border border-red-700"}
            `}
            aria-hidden="true"
          />

          <p className="text-sm text-[#3f433c]">
            {shift.employee ? shift.employee.name : "Unassigned"}
          </p>
        </div>
      </div>

      <span className="hidden font-mono text-xs text-black/30">
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onEdit(shift)}
          disabled={updating}
          className="
            text-sm font-medium text-[#52642b] transition
            hover:text-[#092514] focus-visible:outline-none
            focus-visible:ring-2 focus-visible:ring-[#092514]
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
              inline-flex items-center gap-1 text-sm font-medium text-red-700 transition
              hover:text-red-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700
              disabled:opacity-40
            "
          >
            <Trash2 className="size-4" aria-hidden />
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
