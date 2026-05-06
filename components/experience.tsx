import { EXPERIENCE } from "@/lib/data";

export function Experience() {
  return (
    <section className="space-y-4 relative">
      <div
        className="flex items-center justify-between border-b-2 border-muted/80 pb-2 border-dashed opacity-0 animate-slide-up-fade"
        style={{ animationDelay: "200ms" }}
      >
        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          02 {"//"} Experience
        </h2>
        <span className="text-xs text-muted-foreground">
          {EXPERIENCE.length} ROLES
        </span>
      </div>

      <div className="flex flex-col gap-6">
        {EXPERIENCE.map((exp, index) => (
          <div
            key={exp.company}
            className="group flex flex-col gap-2 relative pl-2 border-l border-transparent hover:border-foreground transition-all duration-300 opacity-0 animate-slide-up-fade"
            style={{ animationDelay: `${300 + index * 100}ms` }}
          >
            <div className="absolute -left-px top-0 h-full w-px bg-foreground transition-transform origin-top duration-500 ease-out scale-y-0 group-hover:scale-y-100" />

            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-4">
              <h3 className="font-extrabold text-md text-foreground font-(family-name:--font-geist-pixel-grid)">
                {exp.role}
              </h3>
              <span className="text-xs text-muted-foreground font-mono pr-2">
                [{exp.date}]
              </span>
            </div>

            <p className="text-sm font-medium text-foreground">{exp.company}</p>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-lg">
              {exp.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
