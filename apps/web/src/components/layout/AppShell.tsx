"use client";

import type { ComponentType, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarCheck,
  CalendarDays,
  CircleHelp,
  Grid2X2,
  LayoutGrid,
  Plus,
  UserCircle,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";

const mainNavigation = [
  { href: "/", label: "Dashboard", icon: LayoutGrid },
  { href: "/rota", label: "Weekly Rota", icon: Grid2X2 },
  { href: "/employees", label: "Staff Directory", icon: Users },
  { href: "/shifts", label: "Shifts", icon: CalendarDays },
  { href: "/availability", label: "Availability", icon: CalendarCheck },
] as const;

const topNavigation = [
  { href: "/rota", label: "Schedule" },
  { href: "/employees", label: "Employees" },
  { href: "/availability", label: "Availability" },
] as const;

function isActiveRoute(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(href);
}

type NavigationLinkProps = {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  pathname: string;
};

function NavigationLink({
  href,
  label,
  icon: Icon,
  pathname,
}: NavigationLinkProps) {
  const active = isActiveRoute(pathname, href);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex min-h-11 items-center gap-4 px-4 text-sm font-medium text-[#3f433c] transition hover:bg-[#d9ee9f]/70 hover:text-[#092514] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#092514] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f6f3ed]",
        active && "bg-[#d9ee9f] text-[#52642b]",
      )}
    >
      <Icon className="size-5" aria-hidden />
      <span>{label}</span>
    </Link>
  );
}

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#fbfaf7] text-[#051f12]">
      <header className="sticky top-0 z-30 border-b border-[#c6cbc2] bg-[#fbfaf7]/95 backdrop-blur">
        <div className="flex h-20 items-center justify-between gap-4 px-4 sm:px-6">
          <Link
            href="/"
            className="text-2xl font-black tracking-[-0.04em] text-[#052311] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#092514]"
          >
            ShiftFlow
          </Link>

          <nav
            aria-label="Primary"
            className="hidden items-stretch gap-6 lg:flex"
          >
            {topNavigation.map((item) => {
              const active = isActiveRoute(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex h-20 items-center border-b-4 border-transparent text-lg font-semibold text-[#52642b] transition hover:text-[#092514] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#092514]",
                    active && "border-[#092514] text-[#092514]",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/account"
              className="inline-flex size-10 items-center justify-center rounded-full border border-[#c6cbc2] text-[#52642b] transition hover:border-[#092514] hover:text-[#092514] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#092514]"
              aria-label="Account"
            >
              <UserCircle className="size-5" aria-hidden />
            </Link>
          </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="sticky top-20 hidden h-[calc(100vh-5rem)] border-r border-[#c6cbc2] bg-[#f6f3ed] lg:flex lg:flex-col">
          <div className="px-7 py-8">
            <p className="text-2xl font-extrabold tracking-[-0.03em]">
              ShiftFlow Ops
            </p>
            <p className="mt-1 text-base text-[#3f433c]">New York Office</p>
          </div>

          <div className="px-5">
            <Link
              href="/shifts"
              className="flex h-11 items-center justify-center gap-3 bg-[#052311] px-4 text-sm font-bold text-white transition hover:bg-[#173f27] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#092514] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f6f3ed]"
            >
              <Plus className="size-5" aria-hidden />
              New Shift
            </Link>
          </div>

          <nav aria-label="Operations" className="mt-8 space-y-2 px-5">
            {mainNavigation.map((item) => (
              <NavigationLink
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                pathname={pathname}
              />
            ))}
          </nav>

          <div className="mt-auto border-t border-[#c6cbc2] p-5">
            <Link
              href="/help"
              className="flex min-h-11 items-center gap-4 px-4 text-sm text-[#3f433c] transition hover:text-[#092514] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#092514]"
            >
              <CircleHelp className="size-5" aria-hidden />
              Help Center
            </Link>
            <Link
              href="/account"
              className="mt-2 flex min-h-11 items-center gap-4 px-4 text-sm text-[#3f433c] transition hover:text-[#092514] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#092514]"
            >
              <UserCircle className="size-5" aria-hidden />
              Account
            </Link>
          </div>
        </aside>

        <div className="min-w-0 pb-24 lg:pb-0">{children}</div>
      </div>

      <nav
        aria-label="Mobile primary"
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-[#c6cbc2] bg-[#fbfaf7] lg:hidden"
      >
        {[
          mainNavigation[0],
          { href: "/rota", label: "Schedule", icon: CalendarDays },
          mainNavigation[4],
          { href: "/account", label: "Account", icon: UserCircle },
        ].map((item) => {
          const active = isActiveRoute(pathname, item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-h-20 flex-col items-center justify-center gap-1 border-t-4 border-transparent text-xs font-medium text-[#52642b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#092514]",
                active && "border-[#092514] text-[#092514]",
              )}
            >
              <Icon className="size-6" aria-hidden />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
