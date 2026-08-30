import ShiftRow from "@/components/shift/shiftRow";
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
      <div className="mb-5 flex items-end justify-between gap-6">
        <h2
          id="shift-list-heading"
          className="text-2xl font-bold tracking-[-0.03em]"
        >
          Current shifts
        </h2>

        <p className="font-mono text-sm text-[#52642b]">
          {String(shifts.length).padStart(2, "0")} shifts
        </p>
      </div>

      <div className="overflow-hidden border border-[#c6cbc2] bg-white">
        {shifts.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <h3 className="text-2xl font-semibold tracking-[-0.03em]">
              No shifts scheduled.
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#3f433c]">
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
