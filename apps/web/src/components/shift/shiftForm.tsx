import { Employee } from "@/types";
import { Shift } from "@/types/shifts";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";
import { Check, Save } from "lucide-react";

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
    mt-2 h-12 w-full border border-[#c6cbc2]
    bg-white px-4
    text-sm text-black
    outline-none transition
    placeholder:text-black/30
    focus:border-[#092514]
    focus:ring-2
    focus:ring-[#092514]/20
  `;

  return (
    <aside className="xl:sticky xl:top-28 xl:self-start">
      <div className="border border-[#c6cbc2] bg-[#f6f3ed] p-6 md:p-7">
        <SectionLabel className="text-[#52642b]">
          {editShift ? "Edit shift" : "Add shift"}
        </SectionLabel>

        <h2 className="mt-3 text-2xl font-bold tracking-[-0.03em]">
          {editShift ? "Update shift" : "New shift"}
        </h2>

        <p className="mt-2 max-w-sm text-sm leading-6 text-[#3f433c]">
          {editShift
            ? "Update the selected shift's schedule and employee assignment."
            : "Create a new shift and optionally assign it to a team member."}
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-6">
          <div>
            <label
              htmlFor="title"
              className="text-sm font-semibold text-[#52642b]"
            >
              Shift Title
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
              <p className="mt-2 text-sm font-medium text-red-700">
                {errors.title}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="employee"
              className="text-sm font-semibold text-[#52642b]"
            >
              Assign Employee
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
              className="text-sm font-semibold text-[#52642b]"
            >
              Start Time
            </label>

            <input
              id="startTime"
              type="datetime-local"
              value={startTime}
              onChange={(e) => onStartTimeChange(e.target.value)}
              className={inputClassName}
            />

            {errors.startTime && (
              <p className="mt-2 text-sm font-medium text-red-700">
                {errors.startTime}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="endTime"
              className="text-sm font-semibold text-[#52642b]"
            >
              End Time
            </label>

            <input
              id="endTime"
              type="datetime-local"
              value={endTime}
              onChange={(e) => onEndTimeChange(e.target.value)}
              className={inputClassName}
            />

            {errors.endTime && (
              <p className="mt-2 text-sm font-medium text-red-700">
                {errors.endTime}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={creating || updating}
            className="
              mt-2 flex h-11 w-full items-center justify-between
              bg-[#171717] px-5 py-3.5
              text-sm font-medium text-white
              transition
              hover:bg-[#173f27]
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#092514]
              focus-visible:ring-offset-2
              focus-visible:ring-offset-[#f6f3ed]
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            <Save className="size-4" aria-hidden />
            <span>
              {creating
                ? "Creating shift…"
                : updating
                  ? "Updating shift…"
                  : editShift
                    ? "Save changes"
                    : "Create shift"}
            </span>

            <Check className="size-4" aria-hidden />
          </Button>
        </form>
      </div>
    </aside>
  );
}
