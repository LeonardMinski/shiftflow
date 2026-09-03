"use client";

import { useState } from "react";
import { AlertTriangle, Ban, CheckCircle2, Info } from "lucide-react";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  combineShiftDateAndTime,
  formatTime,
  splitDateTimeLocal,
} from "@/lib/date";
import {
  getAvailabilityStatus,
  type AvailabilityStatus,
} from "@/lib/shifts/getAvailabilityStatus";
import type { useShiftForm } from "@/lib/shifts/useShiftForm";
import type { Employee, Shift } from "@/types";

function AvailabilityBanner({ status }: { status: AvailabilityStatus }) {
  if (status.kind === "incomplete") {
    return null;
  }

  if (status.kind === "unknown") {
    return (
      <p className="flex items-center gap-2 rounded-lg border border-border bg-muted px-3 py-2 text-sm text-muted-foreground">
        <Info className="size-4 shrink-0" aria-hidden />
        No availability recorded for this day
      </p>
    );
  }

  if (status.kind === "available") {
    return (
      <p className="flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 px-3 py-2 text-sm font-medium text-success">
        <CheckCircle2 className="size-4 shrink-0" aria-hidden />
        Available &middot; {status.startTime}&ndash;{status.endTime}
      </p>
    );
  }

  if (status.kind === "unavailable") {
    return (
      <p className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
        <Ban className="size-4 shrink-0" aria-hidden />
        Unavailable
      </p>
    );
  }

  if (status.kind === "outside-availability") {
    return (
      <p className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
        <AlertTriangle className="size-4 shrink-0" aria-hidden />
        Outside availability &middot; Available {status.startTime}&ndash;
        {status.endTime}
      </p>
    );
  }

  return (
    <p className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
      <AlertTriangle className="size-4 shrink-0" aria-hidden />
      Scheduling conflict &middot; Already working{" "}
      {formatTime(status.startTime)}&ndash;{formatTime(status.endTime)}
    </p>
  );
}

type ShiftSheetFieldsProps = {
  shiftForm: ReturnType<typeof useShiftForm>;
  employees: Employee[];
  shifts: Shift[];
  initialDate?: string;
};

function ShiftSheetFields({
  shiftForm,
  employees,
  shifts,
  initialDate,
}: ShiftSheetFieldsProps) {
  const [date, setDate] = useState(
    () => initialDate ?? splitDateTimeLocal(shiftForm.startTime).date,
  );
  const [startTimeOfDay, setStartTimeOfDay] = useState(
    () => splitDateTimeLocal(shiftForm.startTime).time,
  );
  const [endTimeOfDay, setEndTimeOfDay] = useState(
    () => splitDateTimeLocal(shiftForm.endTime).time,
  );

  const pushTimes = (
    nextDate: string,
    nextStart: string,
    nextEnd: string,
  ) => {
    const { startTime, endTime } = combineShiftDateAndTime(
      nextDate,
      nextStart,
      nextEnd,
    );

    shiftForm.onStartTimeChange(startTime);
    shiftForm.onEndTimeChange(endTime);
  };

  const status = getAvailabilityStatus(
    employees,
    shifts,
    shiftForm.employeeId,
    shiftForm.startTime,
    shiftForm.endTime,
    shiftForm.editShift?.id,
  );

  const isSaving = shiftForm.creating || shiftForm.updating;

  return (
    <form
      onSubmit={shiftForm.handleSubmit}
      className="flex flex-1 flex-col gap-5 overflow-y-auto"
    >
      <div>
        <Label htmlFor="shift-sheet-title">Shift Name</Label>
        <Input
          id="shift-sheet-title"
          className="mt-1.5"
          value={shiftForm.title}
          placeholder="Morning shift"
          onChange={(event) => shiftForm.onTitleChange(event.target.value)}
        />
        {shiftForm.errors.title && (
          <p className="mt-1.5 text-sm text-destructive">
            {shiftForm.errors.title}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="shift-sheet-date">Date</Label>
        <Input
          id="shift-sheet-date"
          type="date"
          className="mt-1.5"
          value={date}
          onChange={(event) => {
            setDate(event.target.value);
            pushTimes(event.target.value, startTimeOfDay, endTimeOfDay);
          }}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="shift-sheet-start-time">Start Time</Label>
          <Input
            id="shift-sheet-start-time"
            type="time"
            className="mt-1.5"
            value={startTimeOfDay}
            onChange={(event) => {
              setStartTimeOfDay(event.target.value);
              pushTimes(date, event.target.value, endTimeOfDay);
            }}
          />
        </div>

        <div>
          <Label htmlFor="shift-sheet-end-time">End Time</Label>
          <Input
            id="shift-sheet-end-time"
            type="time"
            className="mt-1.5"
            value={endTimeOfDay}
            onChange={(event) => {
              setEndTimeOfDay(event.target.value);
              pushTimes(date, startTimeOfDay, event.target.value);
            }}
          />
        </div>
      </div>

      {shiftForm.errors.startTime && (
        <p className="-mt-3 text-sm text-destructive">
          {shiftForm.errors.startTime}
        </p>
      )}
      {shiftForm.errors.endTime && (
        <p className="-mt-3 text-sm text-destructive">
          {shiftForm.errors.endTime}
        </p>
      )}

      <div>
        <Label htmlFor="shift-sheet-employee">Employee Select</Label>
        <select
          id="shift-sheet-employee"
          value={shiftForm.employeeId}
          onChange={(event) => shiftForm.onEmployeeChange(event.target.value)}
          className="mt-1.5 h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <option value="">Unassigned</option>

          {employees.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.name}
            </option>
          ))}
        </select>
      </div>

      <AvailabilityBanner status={status} />

      <SheetFooter>
        <SheetClose type="button">Cancel</SheetClose>
        <Button type="submit" disabled={isSaving}>
          {shiftForm.creating
            ? "Adding shift…"
            : shiftForm.updating
              ? "Saving…"
              : shiftForm.editShift
                ? "Save changes"
                : "Add shift"}
        </Button>
      </SheetFooter>
    </form>
  );
}

type ShiftSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessionKey: string;
  employees: Employee[];
  shifts: Shift[];
  shiftForm: ReturnType<typeof useShiftForm>;
  initialDate?: string;
};

export default function ShiftSheet({
  open,
  onOpenChange,
  sessionKey,
  employees,
  shifts,
  shiftForm,
  initialDate,
}: ShiftSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            {shiftForm.editShift ? "Edit shift" : "Add shift"}
          </SheetTitle>
          <SheetDescription>
            {shiftForm.editShift
              ? "Update this shift's schedule and employee assignment."
              : "Create a shift and assign it to a team member."}
          </SheetDescription>
        </SheetHeader>

        <ShiftSheetFields
          key={sessionKey}
          shiftForm={shiftForm}
          employees={employees}
          shifts={shifts}
          initialDate={initialDate}
        />
      </SheetContent>
    </Sheet>
  );
}
