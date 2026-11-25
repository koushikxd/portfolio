import { CopyEmail } from "@/components/copy-email";
import { TextLink } from "@/components/text-link";
import { SOCIALS } from "@/lib/data";

export function Hero({ step }: { step: number }) {
  return (
    <section className="flex flex-col gap-4">
      <div
        className="enter flex flex-wrap items-baseline gap-x-3 gap-y-1"
        style={{ "--step": step }}
      >
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground uppercase font-pixel">
          Koushik
        </h1>
        <span className="meta">[unemployed right now]</span>
      </div>

      <p
        className="enter text-base leading-relaxed text-muted-foreground max-w-lg text-pretty"
        style={{ "--step": step + 1 }}
      >
        Currently shipping AI agents, I prefer dark mode and minimal interfaces.
        neovim btw.
      </p>

      <p
        className="enter text-base leading-relaxed text-muted-foreground"
        style={{ "--step": step + 2 }}
      >
        You can find me on{" "}
        <TextLink href={SOCIALS.x} className="text-foreground">
          X
        </TextLink>{" "}
        and{" "}
        <TextLink href={SOCIALS.github} className="text-foreground">
          GitHub
        </TextLink>
        , or <CopyEmail email={SOCIALS.email} />
      </p>
    </section>
  );
}
