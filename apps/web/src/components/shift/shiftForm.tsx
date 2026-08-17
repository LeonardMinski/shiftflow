import { Employee } from "@/types";
import { Shift } from "@/types/shifts";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";

type ShiftFormProps = {
  title: string;
  errors: { 
    title: string,
    endTime: string,
    startTime: string
  };
  startTime: string;
  endTime: string;
  employeeId: string;
  employees: Employee[];
  creating: boolean;
  updating: boolean;
  editShift: Shift | null;

  onTitleChange: (value: string) => void;
  onStartTimeChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
  onEmployeeChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export default function ShiftForm({
  title,
  startTime,
  errors,
  endTime,
  employeeId,
  employees,
  creating,
  updating,
  editShift,
  onTitleChange,
  onStartTimeChange,
  onEndTimeChange,
  onEmployeeChange,
  onSubmit,
}: ShiftFormProps) {
  const inputClassName = `
    mt-2 w-full border border-black/15
    bg-[#F4F0E8] px-4 py-3
    text-sm text-black
    outline-none transition
    placeholder:text-black/30
    focus:border-black/40
    focus:ring-2
    focus:ring-[#FF5A36]/20
  `;

  return (
    <aside className="lg:sticky lg:top-8 lg:self-start">
      <div className="border border-black/10 bg-[#EAE4D9] p-6 md:p-8">
        <SectionLabel>{editShift ? "Edit shift" : "Add shift"}</SectionLabel>

        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
          {editShift ? "Update shift" : "New shift"}
        </h2>

        <p className="mt-2 max-w-sm text-sm leading-6 text-black/50">
          {editShift
            ? "Update the selected shift's schedule and employee assignment."
            : "Create a new shift and optionally assign it to a team member."}
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-6">
          <div>
            <label
              htmlFor="title"
              className="font-mono text-[10px] uppercase tracking-[0.16em] text-black/45"
            >
              Title
            </label>

            <input
              id="title"
              type="text"
              value={title}
              placeholder="Morning shift"
              onChange={(e) => onTitleChange(e.target.value)}
              className={inputClassName}
            />

            {errors.title && (
              <p className="text-sm text-red-700">{errors.title}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="employee"
              className="font-mono text-[10px] uppercase tracking-[0.16em] text-black/45"
            >
              Employee
            </label>

            <select
              id="employee"
              value={employeeId}
              onChange={(e) => onEmployeeChange(e.target.value)}
              className={inputClassName}
            >
              <option value="">Unassigned</option>

              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="startTime"
              className="font-mono text-[10px] uppercase tracking-[0.16em] text-black/45"
            >
              Start time
            </label>

            <input
              id="startTime"
              type="datetime-local"
              value={startTime}
              onChange={(e) => onStartTimeChange(e.target.value)}
              className={inputClassName}
            />

            {errors.startTime && (
              <p className="text-sm text-red-700">{errors.startTime}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="endTime"
              className="font-mono text-[10px] uppercase tracking-[0.16em] text-black/45"
            >
              End time
            </label>

            <input
              id="endTime"
              type="datetime-local"
              value={endTime}
              onChange={(e) => onEndTimeChange(e.target.value)}
              className={inputClassName}
            />

            {errors.endTime && (
              <p className="text-sm text-red-700">{errors.endTime}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={creating || updating}
            className="
              mt-2 flex w-full items-center justify-between
              bg-[#171717] px-5 py-3.5
              text-sm font-medium text-white
              transition
              hover:bg-[#FF5A36]
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#FF5A36]
              focus-visible:ring-offset-2
              focus-visible:ring-offset-[#EAE4D9]
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            <span>
              {creating
                ? "Creating shift…"
                : updating
                  ? "Updating shift…"
                  : editShift
                    ? "Save changes"
                    : "Create shift"}
            </span>

            <span aria-hidden="true">→</span>
          </Button>
        </form>
      </div>
    </aside>
  );
}
