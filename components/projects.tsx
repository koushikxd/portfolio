import { ProjectList } from "@/components/project-list";
import { Section } from "@/components/section";
import { TextLink } from "@/components/text-link";
import { PROJECTS, SOCIALS } from "@/lib/data";

export const PROJECTS_STEPS = 1 + PROJECTS.length + 1;

export function Projects({ step }: { step: number }) {
  return (
    <Section title="Projects" step={step}>
      <ProjectList step={step + 1} />
      <p
        className="enter text-base text-muted-foreground"
        style={{ "--step": step + 1 + PROJECTS.length }}
      >
        More on{" "}
        <TextLink href={SOCIALS.github} className="text-foreground">
          GitHub
        </TextLink>
      </p>
    </Section>
  );
}
