"use client";

import { useEffect, useState } from "react";
import { Experience } from "./experience";
import { Projects } from "./projects";

const TABS = [
  { id: "experience", label: "EXPERIENCE" },
  { id: "projects", label: "PROJECTS" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function TabsSection() {
  const [active, setActive] = useState<TabId>("experience");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (
        t &&
        (t.tagName === "INPUT" ||
          t.tagName === "TEXTAREA" ||
          t.isContentEditable)
      ) {
        return;
      }
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "1") setActive("experience");
      else if (e.key === "2") setActive("projects");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section className="space-y-4 relative">
      <div
        className="flex items-center justify-between border-b-2 border-muted/80 pb-2 border-dashed opacity-0 animate-slide-up-fade"
        style={{ animationDelay: "200ms" }}
      >
        <div className="flex gap-3 sm:gap-4">
          {TABS.map((tab, i) => {
            const isActive = active === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActive(tab.id)}
                className={`text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer ${
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-pressed={isActive}
              >
                [{tab.label}]
              </button>
            );
          })}
        </div>
        <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider hidden sm:inline">
          press 1 / 2
        </span>
      </div>

      <div key={active} className="opacity-0 animate-slide-up-fade">
        {active === "experience" ? <Experience /> : <Projects />}
      </div>
    </section>
  );
}
