"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { CheckCircle2, Loader2 } from "lucide-react";

import { GET_MY_AVAILABILITY } from "@/graphql/user/queries";
import { SET_EMPLOYEE_AVAILABILITY } from "@/graphql/availability/mutations";
import { Switch } from "@/components/ui/switch";
import type {
  SetEmployeeAvailabilityData,
  SetEmployeeAvailabilityVariables,
} from "@/types/availability";
import type { EmployeeAvailability } from "@/types";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

type DayName = (typeof daysOfWeek)[number];

type DayState = {
  available: boolean;
  startTime: string;
  endTime: string;
};

type FormState = Record<DayName, DayState>;

const emptyDay: DayState = { available: false, startTime: "", endTime: "" };

function buildInitialState(availability: EmployeeAvailability[]): FormState {
  const state = {} as FormState;

  for (const day of daysOfWeek) {
    const record = availability.find((entry) => entry.dayOfWeek === day);

    state[day] = record
      ? {
          available: record.available,
          startTime: record.startTime ?? "",
          endTime: record.endTime ?? "",
        }
      : { ...emptyDay };
  }

  return state;
}

type MyAvailabilityFormProps = {
  employee: { id: string; availability: EmployeeAvailability[] };
  saving: boolean;
  onSubmit: (formState: FormState) => void;
};

function MyAvailabilityForm({
  employee,
  saving,
  onSubmit,
}: MyAvailabilityFormProps) {
  const [formState, setFormState] = useState<FormState>(() =>
    buildInitialState(employee.availability),
  );
  const [errors, setErrors] = useState<Partial<Record<DayName, string>>>({});

  const handleToggle = (day: DayName, available: boolean) => {
    setFormState((current) => ({
      ...current,
      [day]: { ...current[day], available },
    }));
    setErrors((current) => ({ ...current, [day]: undefined }));
  };

  const handleTimeChange = (
    day: DayName,
    field: "startTime" | "endTime",
    value: string,
  ) => {
    setFormState((current) => ({
      ...current,
      [day]: { ...current[day], [field]: value },
    }));
    setErrors((current) => ({ ...current, [day]: undefined }));
  };

  const handleSave = () => {
    const newErrors: Partial<Record<DayName, string>> = {};

    for (const day of daysOfWeek) {
      const dayState = formState[day];

      if (dayState.available) {
        if (!dayState.startTime || !dayState.endTime) {
          newErrors[day] = "Start and end time are required.";
        } else if (dayState.endTime <= dayState.startTime) {
          newErrors[day] = "End time must be after start time.";
        }
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    onSubmit(formState);
  };

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        {daysOfWeek.map((day) => {
          const dayState = formState[day];
          const dayError = errors[day];

          return (
            <div
              key={day}
              className={`border-b border-border px-5 py-4 last:border-b-0 ${
                dayState.available ? "bg-accent/60" : "bg-muted/40"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <span
                  className={`text-sm font-medium ${
                    dayState.available
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {day}
                </span>

                <div className="flex items-center gap-4">
                  {dayState.available ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        aria-label={`${day} start time`}
                        value={dayState.startTime}
                        onChange={(event) =>
                          handleTimeChange(day, "startTime", event.target.value)
                        }
                        className="h-9 rounded-lg border border-border bg-card px-2.5 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/20"
                      />
                      <span className="text-sm text-muted-foreground">to</span>
                      <input
                        type="time"
                        aria-label={`${day} end time`}
                        value={dayState.endTime}
                        onChange={(event) =>
                          handleTimeChange(day, "endTime", event.target.value)
                        }
                        className="h-9 rounded-lg border border-border bg-card px-2.5 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/20"
                      />
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Unavailable
                    </span>
                  )}

                  <Switch
                    checked={dayState.available}
                    onCheckedChange={(checked) => handleToggle(day, checked)}
                    aria-label={`${day} available`}
                  />
                </div>
              </div>

              {dayError && (
                <p className="mt-2 text-sm text-destructive">{dayError}</p>
              )}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-bold text-primary-foreground transition hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {saving && <Loader2 className="size-4 animate-spin" aria-hidden />}
        {saving ? "Saving..." : "Save Availability"}
      </button>
    </>
  );
}

export default function MyAvailabilityView() {
  const { data, loading, error, refetch } = useQuery(GET_MY_AVAILABILITY);

  const [setEmployeeAvailability] = useMutation<
    SetEmployeeAvailabilityData,
    SetEmployeeAvailabilityVariables
  >(SET_EMPLOYEE_AVAILABILITY);

  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [formGeneration, setFormGeneration] = useState(0);

  const employee = data?.me?.employee ?? null;

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-5rem)] bg-background px-5 py-8 text-foreground sm:px-8 lg:px-10">
        <h1 className="text-3xl font-bold tracking-[-0.03em]">
          My Availability
        </h1>
        <p className="mt-2 text-base text-muted-foreground">Loading...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-[calc(100vh-5rem)] bg-background px-5 py-8 text-foreground sm:px-8 lg:px-10">
        <h1 className="text-3xl font-bold tracking-[-0.03em]">
          My Availability
        </h1>
        <p className="mt-4 max-w-xl text-base text-destructive">
          We couldn&apos;t load your availability.
        </p>
      </main>
    );
  }

  if (!employee) {
    return (
      <main className="min-h-[calc(100vh-5rem)] bg-background px-5 py-8 text-foreground sm:px-8 lg:px-10">
        <h1 className="text-3xl font-bold tracking-[-0.03em]">
          My Availability
        </h1>
        <p className="mt-4 max-w-xl text-base text-muted-foreground">
          This account isn&apos;t linked to an employee record, so there is
          no availability to manage here.
        </p>
      </main>
    );
  }

  const handleSubmit = async (formState: FormState) => {
    setStatus("saving");
    setErrorMessage("");

    try {
      const results = await Promise.allSettled(
        daysOfWeek.map((day) => {
          const dayState = formState[day];

          return setEmployeeAvailability({
            variables: {
              input: {
                employeeId: employee.id,
                dayOfWeek: day,
                available: dayState.available,
                ...(dayState.available && {
                  startTime: dayState.startTime,
                  endTime: dayState.endTime,
                }),
              },
            },
          });
        }),
      );

      const hasFailure = results.some(
        (result) => result.status === "rejected",
      );

      if (hasFailure) {
        setStatus("error");
        setErrorMessage("Some days couldn't be saved. Please try again.");
        return;
      }

      await refetch();
      setStatus("success");
      setFormGeneration((generation) => generation + 1);
    } catch {
      setStatus("error");
      setErrorMessage("We couldn't save your availability. Please try again.");
    }
  };

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-background text-foreground">
      <div className="max-w-3xl px-5 py-8 sm:px-8 lg:px-10">
        <header className="mb-6">
          <h1 className="text-3xl font-extrabold tracking-[-0.04em]">
            My Availability
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            Set the hours you&apos;re available each week.
          </p>
        </header>

        <div role="status" className="mb-4">
          {status === "success" && (
            <p className="flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-sm font-medium text-success">
              <CheckCircle2 className="size-4 shrink-0" aria-hidden />
              Availability saved successfully
            </p>
          )}
          {status === "error" && (
            <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
              {errorMessage}
            </p>
          )}
        </div>

        <MyAvailabilityForm
          key={formGeneration}
          employee={employee}
          saving={status === "saving"}
          onSubmit={handleSubmit}
        />
      </div>
    </main>
  );
}
