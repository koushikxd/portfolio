import { DitherHeader } from "@/components/dither-header";
import { EXPERIENCE_STEPS, Experience } from "@/components/experience";
import {
  GithubGraph,
  GRAPH_STEPS,
  getContributions,
} from "@/components/github-graph";
import { HERO_STEPS, Hero } from "@/components/hero";
import { KoiPond } from "@/components/koi-pond";
import { PROJECTS_STEPS, Projects } from "@/components/projects";
import { VisitorCount } from "@/components/visitor-count";

const HERO_STEP = 1;
const GRAPH_STEP = HERO_STEP + HERO_STEPS;

export default async function Home() {
  const contributions = await getContributions();
  const projectsStep = GRAPH_STEP + (contributions ? GRAPH_STEPS : 0);
  const experienceStep = projectsStep + PROJECTS_STEPS;
  const footerStep = experienceStep + EXPERIENCE_STEPS;

  return (
    <main className="min-h-dvh">
      <div className="container max-w-2xl mx-auto px-6 md:pt-10 pt-6 flex flex-col gap-14 sm:gap-16">
        <DitherHeader />
        <Hero step={HERO_STEP} />
        {contributions && (
          <GithubGraph step={GRAPH_STEP} data={contributions} />
        )}
        <Projects step={projectsStep} />
        <Experience step={experienceStep} />
        <footer className="enter relative" style={{ "--step": footerStep }}>
          <KoiPond className="block h-60 w-full text-foreground opacity-80 mask-[radial-gradient(ellipse_75%_100%_at_50%_100%,black_45%,transparent_100%)]" />
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
