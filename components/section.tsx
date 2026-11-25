import type { ReactNode } from "react";

// Heading enters at `step`; children start from `step + 1`
export function Section({
  title,
  step,
  children,
}: {
  title: string;
  step: number;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-5">
      <h2
        className="enter text-xl font-extrabold uppercase tracking-tight text-foreground font-pixel"
        style={{ "--step": step }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}
