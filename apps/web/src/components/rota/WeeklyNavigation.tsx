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
    <div className="py-4">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-semibold tracking-[-0.04em]">
          Employee Rota
        </h1>
      </div>

      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onPreviousWeek}
          className="
          border border-black/10
          bg-[#EAE4D9]
          px-4 py-2.5
          font-mono text-[10px] uppercase tracking-[0.16em]
          text-black/60
          transition
          hover:border-[#FF5A36]/50
          hover:bg-[#F4F0E8]
          hover:text-black
        "
        >
          ← Previous
        </button>

        <p className="text-center font-semibold tracking-[-0.02em]">
          {weekStart.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
          })}
          {" – "}
          {weekEnd.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>

        <button
          type="button"
          onClick={onNextWeek}
          className="
          border border-[#171717]
          bg-[#171717]
          px-4 py-2.5
          font-mono text-[10px] uppercase tracking-[0.16em]
          text-white
          transition
          hover:border-[#FF5A36]
          hover:bg-[#FF5A36]
        "
        >
          Next →
        </button>
      </div>
    </div>
  );
}
