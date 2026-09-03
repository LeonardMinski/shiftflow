import type { ComponentType } from "react";
import {
  CalendarCheck,
  CalendarDays,
  Grid2X2,
  Users,
} from "lucide-react";

import type { Role } from "@/types";

export type NavItem = {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
};

const managerNavigation: NavItem[] = [
  { href: "/rota", label: "Rota", icon: Grid2X2 },
  { href: "/employees", label: "Employees", icon: Users },
  { href: "/availability", label: "Availability", icon: CalendarCheck },
];

const employeeNavigation: NavItem[] = [
  { href: "/my-schedule", label: "My Schedule", icon: CalendarDays },
  { href: "/my-availability", label: "My Availability", icon: CalendarCheck },
];

export const getNavigation = (role: Role): NavItem[] =>
  role === "MANAGER" ? managerNavigation : employeeNavigation;

export const getHomeHref = (role: Role): string =>
  role === "MANAGER" ? "/rota" : "/my-schedule";
