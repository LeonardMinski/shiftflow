import Link from "next/link";
import { CalendarCheck, CalendarPlus, Grid2X2, Users } from "lucide-react";

const dashboardCards = [
  {
    href: "/rota",
    title: "Weekly Rota",
    description: "Review the current team schedule by employee and day.",
    icon: Grid2X2,
  },
  {
    href: "/employees",
    title: "Staff Directory",
    description: "Manage employees before assigning shifts or availability.",
    icon: Users,
  },
  {
    href: "/availability",
    title: "Availability",
    description: "Review and update weekly availability windows.",
    icon: CalendarCheck,
  },
  {
    href: "/shifts",
    title: "New Shift",
    description: "Create, edit, filter, and delete scheduled shifts.",
    icon: CalendarPlus,
  },
] as const;

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-5rem)] bg-[#fbfaf7] px-5 py-8 text-[#051f12] sm:px-8 lg:px-10">
      <section className="max-w-6xl">
        <p className="text-sm text-[#52642b]">New York Office</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-[-0.04em] sm:text-5xl">
          ShiftFlow
        </h1>

        <p className="mt-3 max-w-2xl text-base leading-7 text-[#3f433c]">
          Ops workspace for weekly rotas, employee records, shift changes, and
          availability.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {dashboardCards.map((card) => {
            const Icon = card.icon;

            return (
              <Link
                key={card.href}
                href={card.href}
                className="group border border-[#c6cbc2] bg-white p-6 transition hover:border-[#092514] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#092514]"
              >
                <Icon
                  className="size-7 text-[#52642b] transition group-hover:text-[#092514]"
                  aria-hidden
                />
                <h2 className="mt-8 text-xl font-bold tracking-[-0.02em]">
                  {card.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#3f433c]">
                  {card.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
