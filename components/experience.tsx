import { EXPERIENCE } from "@/lib/data";

export function Experience() {
  return (
    <section className="space-y-4 relative">
      <div className="flex flex-col gap-6" data-dim-group>
        {EXPERIENCE.map((exp, index) => (
          <div
            key={exp.company}
            data-dim-item
            className="group flex flex-col gap-2 relative pl-2 border-l border-transparent cursor-default select-none opacity-0 animate-slide-up-fade"
            style={{ animationDelay: `${100 + index * 100}ms` }}
          >
            <div className="absolute -left-px top-0 h-full w-px bg-foreground transition-transform origin-top duration-300 ease-[var(--ease-out-cubic)] scale-y-0 group-hover:scale-y-100" />

            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-4 group-hover:translate-x-1">
              <h3 className="font-extrabold text-md text-foreground font-(family-name:--font-geist-pixel-grid)">
                {exp.role}
              </h3>
              <span className="text-xs text-muted-foreground font-mono pr-2">
                [{exp.date}]
              </span>
            </div>

            <p className="text-sm font-medium text-foreground group-hover:translate-x-1">
              {exp.company}
            </p>
            {exp.description && (
              <p className="text-xs text-muted-foreground leading-relaxed max-w-lg group-hover:translate-x-1">
                {exp.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
