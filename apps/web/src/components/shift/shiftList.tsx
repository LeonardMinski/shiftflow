import ShiftRow from "@/components/shift/shiftRow";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Shift } from "@/types/shifts";

type ShiftListProps = {
  shifts: Shift[];
  onEdit: (shift: Shift) => void;
  onDelete: (id: string) => void;
  updating: boolean;
  deletingShiftId: string | null;
};

export default function ShiftList({
  shifts,
  onEdit,
  onDelete,
  updating,
  deletingShiftId,
}: ShiftListProps) {
  return (
    <section aria-labelledby="shift-list-heading">
      <div className="mb-6 flex items-end justify-between gap-6">
        <div>
          <SectionLabel>Schedule</SectionLabel>

          <h2
            id="shift-list-heading"
            className="mt-2 text-2xl font-semibold tracking-[-0.03em]"
          >
            Current shifts
          </h2>
        </div>

        <div className="text-right">
          <span className="block font-mono text-2xl tracking-[-0.04em]">
            {String(shifts.length).padStart(2, "0")}
          </span>

          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-black/35">
            shifts
          </span>
        </div>
      </div>

      <div className="border-t border-black/10">
        {shifts.length === 0 ? (
          <div className="py-16">
            <SectionLabel>Empty state</SectionLabel>

            <h3 className="mt-3 text-2xl font-medium tracking-[-0.03em]">
              No shifts scheduled.
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-black/50">
              Create the first shift using the form alongside the schedule.
            </p>
          </div>
        ) : (
          shifts.map((shift, index) => (
            <ShiftRow
              key={shift.id}
              shift={shift}
              index={index}
              onEdit={onEdit}
              onDelete={onDelete}
              updating={updating}
              deleting={deletingShiftId === shift.id}
            />
          ))
        )}
      </div>
    </section>
  );
}
