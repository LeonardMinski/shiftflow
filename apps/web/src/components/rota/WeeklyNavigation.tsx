import Link from "next/link";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

type WeekNavigationProps = {
  weekStart: Date;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
};

export default function WeekNavigation({
  weekStart,
  onPreviousWeek,
  onNextWeek,
}: WeekNavigationProps) {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  return (
    <header className="border-b border-[#c6cbc2] bg-[#fbfaf7] px-5 py-6 sm:px-8 lg:px-10">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-extrabold tracking-[-0.04em]">Rota</h1>
          <span className="border border-[#c6cbc2] bg-[#efede8] px-3 py-1 text-sm font-medium uppercase tracking-[0.04em] text-[#3f433c]">
            Draft
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onPreviousWeek}
              aria-label="Previous week"
              className="flex size-10 items-center justify-center border border-[#c6cbc2] bg-white text-[#52642b] transition hover:border-[#092514] hover:text-[#092514] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#092514]"
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
              className="flex size-10 items-center justify-center border border-[#c6cbc2] bg-white text-[#52642b] transition hover:border-[#092514] hover:text-[#092514] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#092514]"
            >
              <ChevronRight className="size-5" aria-hidden />
            </button>
          </div>

          <Link
            href="/shifts"
            className="inline-flex h-10 items-center gap-2 border border-[#c6cbc2] bg-white px-4 text-sm font-semibold text-[#092514] transition hover:border-[#092514] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#092514]"
          >
            <Plus className="size-4" aria-hidden />
            Add Shift
          </Link>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4 lg:hidden">
        <button
          type="button"
          onClick={onPreviousWeek}
          className="
            flex size-14 items-center justify-center rounded-full
            border border-[#c6cbc2] bg-white text-[#52642b]
            transition hover:border-[#092514] hover:text-[#092514]
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
            border border-[#c6cbc2] bg-white text-[#52642b]
            transition hover:border-[#092514] hover:text-[#092514]
          "
          aria-label="Next week"
        >
          <ChevronRight className="size-7" aria-hidden />
        </button>
      </div>
    </header>
  );
}
