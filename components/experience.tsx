import { Section } from "@/components/section";
import { EXPERIENCE } from "@/lib/data";

export function Experience({ step }: { step: number }) {
  return (
    <Section title="Experience" step={step}>
      <div className="flex flex-col gap-7" data-dim-group>
        {EXPERIENCE.map((exp, index) => (
          <div
            key={exp.company}
            data-dim-item
            className="enter flex flex-col gap-1"
            style={{ "--step": step + 1 + index }}
          >
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5 sm:gap-4">
              <h3 className="text-base font-medium text-foreground">
                {exp.company}
              </h3>
              <span className="meta shrink-0">[{exp.date}]</span>
            </div>
            <p className="font-mono text-[13px] text-foreground/80">
              {exp.role}
            </p>
            <p className="pt-1.5 text-base text-muted-foreground leading-relaxed max-w-lg text-pretty">
              {exp.description}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
