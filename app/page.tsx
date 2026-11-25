import { DitherHeader } from "@/components/dither-header";
import { Experience } from "@/components/experience";
import { GithubGraph } from "@/components/github-graph";
import { Hero } from "@/components/hero";
import { KoiPond } from "@/components/koi-pond";
import { Projects } from "@/components/projects";
import { VisitorCount } from "@/components/visitor-count";
import { EXPERIENCE, PROJECTS } from "@/lib/data";

// Entrance order. Each section takes its first step and staggers its own
// elements from there, so the counts here must match what each one renders.
const HERO_STEP = 1;
const GRAPH_STEP = HERO_STEP + 3; // hero: name, bio, socials
const PROJECTS_STEP = GRAPH_STEP + 2; // graph: heading, graph
const EXPERIENCE_STEP = PROJECTS_STEP + 1 + PROJECTS.length + 1; // projects: heading, rows, "More on GitHub"
const FOOTER_STEP = EXPERIENCE_STEP + 1 + EXPERIENCE.length; // experience: heading, rows

export default function Home() {
  return (
    <main className="min-h-dvh">
      <div className="container max-w-2xl mx-auto px-6 md:pt-10 pt-6 flex flex-col gap-14 sm:gap-16">
        <DitherHeader />
        <Hero step={HERO_STEP} />
        <GithubGraph step={GRAPH_STEP} />
        <Projects step={PROJECTS_STEP} />
        <Experience step={EXPERIENCE_STEP} />
        <footer className="enter relative" style={{ "--step": FOOTER_STEP }}>
          <KoiPond className="block h-52 w-full text-foreground opacity-80 mask-[radial-gradient(ellipse_75%_100%_at_50%_100%,black_45%,transparent_100%)]" />
          <div className="pointer-events-none absolute inset-x-0 top-[58%] flex justify-center">
            <span className="meta rounded-full border bg-background/75 px-4 py-1.5 backdrop-blur-sm">
              <VisitorCount />
            </span>
          </div>
        </footer>
      </div>
    </main>
  );
}
