import { PROJECTS } from "@/lib/data";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Projects() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between border-b border-muted/80 pb-2">
        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          01 // Projects
        </h2>
        <span className="text-xs text-muted-foreground">
          {PROJECTS.length} ITEMS
        </span>
      </div>

      <div className="flex flex-col gap-6">
        {PROJECTS.map((project, index) => (
          <div
            key={project.name}
            className="group flex flex-col gap-2 relative pl-4 border-l border-transparent hover:border-foreground transition-colors duration-300"
          >
            <div className="absolute -left-px top-0 h-full w-px bg-foreground scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300" />

            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-4">
              <div className="flex items-baseline gap-2">
                {/* <span className="text-xs text-muted-foreground font-mono">
                  {(index + 1).toString().padStart(2, "0")}
                </span> */}
                <h3 className="font-medium text-sm text-foreground">
                  {project.name}
                </h3>
              </div>

              <span className="text-xs text-muted-foreground font-mono">
                [{project.language}]
              </span>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed max-w-lg">
              {project.description}
            </p>

            <div className="flex gap-4 text-[10px] uppercase tracking-wider font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-1 group-hover:translate-y-0">
              {project.github && (
                <Link
                  href={project.github}
                  target="_blank"
                  className="hover:text-foreground hover:underline decoration-dotted underline-offset-4"
                >
                  Source
                </Link>
              )}
              {project.url && project.url !== "#" && (
                <Link
                  href={project.url}
                  target="_blank"
                  className="hover:text-foreground hover:underline decoration-dotted underline-offset-4"
                >
                  Deployment
                </Link>
              )}
            </div>
          </div>
        ))}

        <div className="pt-2 flex justify-end">
          <Link
            href="https://github.com/koushikxd?tab=repositories"
            target="_blank"
            className="group inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors font-mono uppercase tracking-wider"
          >
            <span>View All</span>
            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
