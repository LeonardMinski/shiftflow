type SectionLabelProps = {
  children: React.ReactNode;
};

export function SectionLabel({ children }: SectionLabelProps) {
  return (
    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-black/40">
      {children}
    </p>
  );
}
