import { SOCIALS } from "@/lib/data";
import Link from "next/link";
import { VisitorCount } from "./visitor-count";

export function Footer() {
  return (
    <footer
      className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm opacity-0 animate-fade-in"
      style={{ animationDelay: "800ms" }}
    >
      <div className="container max-w-2xl mx-auto flex h-10 items-center justify-between font-mono text-xs px-5">
        <div className="text-muted-foreground">
          <span className="text-primary mr-1">~</span>
          <VisitorCount />
        </div>

        <nav className="flex items-center gap-2 -mr-1">
          {SOCIALS.map((social) => (
            <Link
              key={social.name}
              href={social.url}
              target="_blank"
              className="text-muted-foreground hover:text-foreground transition-colors hover:bg-muted/20 px-1 py-0.5 rounded-sm active:scale-95"
            >
              [{social.name}]
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
