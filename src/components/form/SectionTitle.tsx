type SectionTitleProps = Readonly<{
  children: string;
}>;

export function SectionTitle({ children }: SectionTitleProps) {
  return (
    <h2 className="text-muted-foreground mb-4 flex items-center gap-2 text-xs font-semibold tracking-widest uppercase">
      <span className="bg-primary h-3 w-1 rounded-full" />
      {children}
    </h2>
  );
}
