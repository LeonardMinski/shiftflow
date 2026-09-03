import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionLabelProps = {
  children: ReactNode;
  className?: string;
};

export function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <p
      className={cn(
        "font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground",
        className,
      )}
    >
      {children}
    </p>
  );
}
