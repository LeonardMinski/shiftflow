import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

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

type WeekNavigationProps = {
  weekStart: Date;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  isPublished: boolean;
  publicationLoading: boolean;
  publishing: boolean;
  onPublish: () => void;
  onAddShift: () => void;
};

export default function WeekNavigation({
  weekStart,
  onPreviousWeek,
  onNextWeek,
  isPublished,
  publicationLoading,
  publishing,
  onPublish,
  onAddShift,
}: WeekNavigationProps) {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  const weekRangeLabel = `${weekStart.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
  })} - ${weekEnd.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })}`;

  return (
    <header className="border-b border-border bg-background px-5 py-6 sm:px-8 lg:px-10">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-extrabold tracking-[-0.04em]">Rota</h1>
          <span
            className={`rounded-full px-3 py-1 text-sm font-medium uppercase tracking-[0.04em] ${
              isPublished
                ? "bg-success/15 text-success"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {publicationLoading ? "…" : isPublished ? "Published" : "Draft"}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onPreviousWeek}
              aria-label="Previous week"
              className="flex size-10 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ChevronLeft className="size-5" aria-hidden />
            </button>

            <p className="min-w-40 text-center text-lg font-medium">
              {weekStart.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
              })}
              {"-"}
              {weekEnd.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
              })}
            </p>

            <button
              type="button"
              onClick={onNextWeek}
              aria-label="Next week"
              className="flex size-10 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ChevronRight className="size-5" aria-hidden />
            </button>
          </div>

          <button
            type="button"
            onClick={onAddShift}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-semibold text-foreground transition hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Plus className="size-4" aria-hidden />
            Add Shift
          </button>

          <AlertDialog>
            <AlertDialogTrigger
              disabled={publishing || publicationLoading}
              className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-bold text-primary-foreground transition hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {publishing ? "Publishing…" : "Publish Rota"}
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Publish rota?</AlertDialogTitle>

                <p className="text-sm font-semibold text-primary">
                  {weekRangeLabel}
                </p>

                <AlertDialogDescription>
                  Employees will be able to view their assigned shifts for
                  this week. You can edit the rota and re-publish at any
                  time.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>

                <AlertDialogAction onClick={onPublish}>
                  Publish rota
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4 lg:hidden">
        <button
          type="button"
          onClick={onPreviousWeek}
          className="
            flex size-14 items-center justify-center rounded-full
            border border-border bg-card text-muted-foreground
            transition hover:border-primary hover:text-primary
          "
          aria-label="Previous week"
        >
          <ChevronLeft className="size-7" aria-hidden />
        </button>

        <p className="text-center text-2xl font-extrabold tracking-[-0.04em]">
          {weekStart.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
          })}
          {" – "}
          {weekEnd.toLocaleDateString("en-GB", {
            day: "numeric",
            year: "numeric",
          })}
        </p>

        <button
          type="button"
          onClick={onNextWeek}
          className="
            flex size-14 items-center justify-center rounded-full
            border border-border bg-card text-muted-foreground
            transition hover:border-primary hover:text-primary
          "
          aria-label="Next week"
        >
          <ChevronRight className="size-7" aria-hidden />
        </button>
      </div>
    </header>
  );
}
