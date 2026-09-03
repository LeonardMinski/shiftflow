"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";
import { LogOut } from "lucide-react";

import { cn, getInitials } from "@/lib/utils";
import { useCurrentUser } from "@/lib/auth/useCurrentUser";
import {
  getHomeHref,
  getNavigation,
  type NavItem,
} from "@/lib/navigation/roleNavigation";

function isActiveRoute(pathname: string, href: string) {
  return pathname.startsWith(href);
}

function NavigationLink({
  href,
  label,
  icon: Icon,
  pathname,
}: NavItem & { pathname: string }) {
  const active = isActiveRoute(pathname, href);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex min-h-11 items-center gap-3 rounded-lg px-4 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar",
        active && "bg-accent text-accent-foreground",
      )}
    >
      <Icon className="size-5" aria-hidden />
      <span>{label}</span>
    </Link>
  );
}

function AccountFooter({
  displayName,
  roleLabel,
}: {
  displayName: string;
  roleLabel: string;
}) {
  return (
    <div className="mt-auto border-t border-sidebar-border p-5">
      <div className="flex items-center gap-3">
        <span
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-medium text-accent-foreground"
          aria-hidden="true"
        >
          {getInitials(displayName)}
        </span>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-sidebar-foreground">
            {displayName}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {roleLabel}
          </p>
        </div>

        <SignOutButton>
          <button
            type="button"
            aria-label="Sign out"
            className="flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <LogOut className="size-4" aria-hidden />
          </button>
        </SignOutButton>
      </div>
    </div>
  );
}

function CenteredMessage({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-sm text-center">
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
        {action}
      </div>
    </div>
  );
}

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAuthRoute =
    pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

  const currentUser = useCurrentUser({ skip: isAuthRoute });

  if (isAuthRoute) {
    return <>{children}</>;
  }

  if (currentUser.status === "loading" || currentUser.status === "signed-out") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Loading ShiftFlow...</p>
      </div>
    );
  }

  if (currentUser.status === "not-provisioned") {
    return (
      <CenteredMessage
        title="Access pending"
        description="Your account isn't linked to a ShiftFlow employee record yet. Ask your manager to add you to the staff directory with this email address."
        action={
          <SignOutButton>
            <button
              type="button"
              className="mt-6 inline-flex h-10 items-center justify-center rounded-lg border border-border bg-background px-5 text-sm font-semibold text-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Sign out
            </button>
          </SignOutButton>
        }
      />
    );
  }

  if (currentUser.status === "error") {
    return (
      <CenteredMessage
        title="Something went wrong"
        description={currentUser.message}
      />
    );
  }

  const { user } = currentUser;
  const navigation = getNavigation(user.role);
  const displayName = user.employee?.name ?? user.email;
  const roleLabel = user.role === "MANAGER" ? "Manager" : "Employee";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur lg:hidden">
        <div className="flex h-16 items-center justify-between gap-4 px-4">
          <Link
            href={getHomeHref(user.role)}
            className="text-lg font-bold tracking-tight text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            ShiftFlow
          </Link>
        </div>
      </header>

      <div className="lg:grid lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="sticky top-0 hidden h-screen border-r border-sidebar-border bg-sidebar lg:flex lg:flex-col">
          <div className="px-6 py-7">
            <Link
              href={getHomeHref(user.role)}
              className="text-xl font-bold tracking-tight text-sidebar-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              ShiftFlow
            </Link>
          </div>

          <nav aria-label="Primary" className="space-y-1 px-4">
            {navigation.map((item) => (
              <NavigationLink
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                pathname={pathname}
              />
            ))}
          </nav>

          <AccountFooter displayName={displayName} roleLabel={roleLabel} />
        </aside>

        <div className="min-w-0 pb-20 lg:pb-0">{children}</div>
      </div>

      <nav
        aria-label="Primary"
        className={cn(
          "fixed inset-x-0 bottom-0 z-30 grid border-t border-border bg-background lg:hidden",
          navigation.length === 2 ? "grid-cols-2" : "grid-cols-3",
        )}
      >
        {navigation.map((item) => {
          const active = isActiveRoute(pathname, item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-h-16 flex-col items-center justify-center gap-1 border-t-2 border-transparent text-xs font-medium text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                active && "border-primary text-primary",
              )}
            >
              <Icon className="size-5" aria-hidden />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
