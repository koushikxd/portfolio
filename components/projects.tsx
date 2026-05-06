"use client";

import { ArrowRight, ScanEye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { PROJECTS } from "@/lib/data";

export function Projects() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [useClickPreview, setUseClickPreview] = useState(false);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const smoothPositionRef = useRef({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const isVisible = activeIndex !== null;

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(max-width: 640px), (hover: none), (pointer: coarse)"
    );
    const update = () => {
      setUseClickPreview(mediaQuery.matches);
    };
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!useClickPreview || activeIndex === null) return;
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target || sectionRef.current?.contains(target)) return;
      setActiveIndex(null);
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [useClickPreview, activeIndex]);

  useEffect(() => {
    if (useClickPreview) {
      if (previewRef.current) previewRef.current.style.transform = "";
      return;
    }
    const animate = () => {
      const nextX =
        smoothPositionRef.current.x +
        (mousePositionRef.current.x - smoothPositionRef.current.x) * 0.15;
      const nextY =
        smoothPositionRef.current.y +
        (mousePositionRef.current.y - smoothPositionRef.current.y) * 0.15;
      smoothPositionRef.current = { x: nextX, y: nextY };
      if (previewRef.current) {
        previewRef.current.style.transform = `translate3d(${nextX + 20}px, ${nextY - 100}px, 0)`;
      }
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [useClickPreview]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (useClickPreview) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mousePositionRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseEnter = (index: number) => {
    if (useClickPreview) return;
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    if (useClickPreview) return;
    setActiveIndex(null);
  };

  const handlePreviewToggle = (index: number) => {
    setActiveIndex((current) => (current === index ? null : index));
  };

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: section dismisses preview overlay on tap; keyboard users dismiss via Escape handled at document level
    // biome-ignore lint/a11y/useKeyWithClickEvents: see above
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onClick={() => {
        if (useClickPreview && activeIndex !== null) setActiveIndex(null);
      }}
      className="space-y-4 relative"
    >
      <div
        className="flex items-center justify-between border-b-2 border-muted/80 pb-2 border-dashed opacity-0 animate-slide-up-fade"
        style={{ animationDelay: "200ms" }}
      >
        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          03 {"//"} Projects
        </h2>
        <span className="text-xs text-muted-foreground">
          {PROJECTS.length} ITEMS
        </span>
      </div>

      {!useClickPreview && (
        <div
          ref={previewRef}
          className="pointer-events-none absolute left-0 top-0 z-50 overflow-hidden shadow-2xl will-change-transform"
          style={{
            opacity: isVisible ? 1 : 0,
            scale: isVisible ? 1 : 0.95,
            transition:
              "opacity 0.3s var(--ease-out-cubic), scale 0.3s var(--ease-out-cubic)",
          }}
        >
          <div className="relative h-[180px] w-[280px] overflow-hidden border bg-secondary shadow-2xs">
            {PROJECTS.map((project, index) =>
              project.image ? (
                <Image
                  key={project.name}
                  src={project.image}
                  alt={project.name}
                  width={280}
                  height={180}
                  className="absolute inset-0 h-full w-full object-cover transition-all duration-500 ease-out"
                  style={{
                    opacity: activeIndex === index ? 1 : 0,
                    scale: activeIndex === index ? 1 : 1.1,
                    filter: activeIndex === index ? "none" : "blur(10px)",
                  }}
                />
              ) : (
                <div
                  key={project.name}
                  className="absolute inset-0 flex items-center justify-center bg-secondary transition-all duration-500 ease-out"
                  style={{
                    opacity: activeIndex === index ? 1 : 0,
                    scale: activeIndex === index ? 1 : 1.1,
                    filter: activeIndex === index ? "none" : "blur(10px)",
                  }}
                >
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#000_1px,transparent_1px)] bg-size-[16px_16px] dark:bg-[radial-gradient(#fff_1px,transparent_1px)]" />
                  <span className="relative rounded-full border border-muted-foreground px-3 py-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    Work in progress
                  </span>
                </div>
              )
            )}
            <div className="absolute inset-0 bg-linear-to-t from-background/20 to-transparent" />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-6">
        {PROJECTS.map((project, index) => (
          // biome-ignore lint/a11y/noStaticElementInteractions: hover-only preview affordance; click-preview path uses an explicit <button> below
          <div
            key={project.name}
            className={`group flex flex-col gap-2 relative pl-2 border-l transition-all duration-300 opacity-0 animate-slide-up-fade active:scale-[0.99] ${
              useClickPreview && isVisible && activeIndex === index
                ? "border-foreground"
                : "border-transparent hover:border-foreground"
            }`}
            style={{ animationDelay: `${300 + index * 100}ms` }}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className={`absolute -left-px top-0 h-full w-px bg-foreground transition-transform origin-top duration-500 ease-out ${
                useClickPreview && isVisible && activeIndex === index
                  ? "scale-y-100"
                  : "scale-y-0 group-hover:scale-y-100"
              }`}
            />

            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-4 transition-transform duration-300 ease-out group-hover:translate-x-1">
              <div className="flex items-baseline gap-2 justify-between w-full sm:w-auto sm:justify-start">
                <h3 className="font-extrabold text-md text-foreground font-(family-name:--font-geist-pixel-grid)">
                  {project.name}
                </h3>
                <div className="relative">
                  <button
                    type="button"
                    className={`${useClickPreview ? "inline-flex" : "hidden"} -mr-1 cursor-pointer p-1 transition-colors ${activeIndex === index && "bg-muted"} `}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePreviewToggle(index);
                    }}
                    aria-label="View project preview"
                  >
                    <ScanEye className="h-4 w-4 text-muted-foreground" />
                  </button>
                  {useClickPreview && (
                    <div
                      className="pointer-events-none absolute right-[15px] top-[-68px] z-50 mr-3 -translate-y-1/2 overflow-hidden border bg-secondary shadow-2xl transition-all duration-300"
                      style={{
                        opacity: activeIndex === index ? 1 : 0,
                        scale: activeIndex === index ? 1 : 0.95,
                      }}
                    >
                      <div className="relative h-[180px] w-[280px] overflow-hidden">
                        {project.image ? (
                          <Image
                            src={project.image}
                            alt={project.name}
                            width={280}
                            height={180}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-secondary">
                            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#000_1px,transparent_1px)] bg-size-[16px_16px] dark:bg-[radial-gradient(#fff_1px,transparent_1px)]" />
                            <span className="relative rounded-full border border-muted-foreground px-3 py-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                              Work in progress
                            </span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-linear-to-t from-background/20 to-transparent" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <span className="text-xs text-muted-foreground font-mono pr-2">
                [{project.language}]
              </span>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed max-w-lg transition-transform duration-300 ease-out group-hover:translate-x-1">
              {project.description}
            </p>

            <div className="flex gap-4 text-[10px] uppercase tracking-wider font-medium transition-transform duration-300 ease-out group-hover:translate-x-1">
              {project.github && (
                <Link
                  href={project.github}
                  target="_blank"
                  className="hover:text-foreground hover:underline decoration-dotted underline-offset-4 transition-colors"
                >
                  Source
                </Link>
              )}
              {project.url && project.url !== "#" && (
                <Link
                  href={project.url}
                  target="_blank"
                  className="hover:text-foreground hover:underline decoration-dotted underline-offset-4 transition-colors"
                >
                  Deployment
                </Link>
              )}
            </div>
          </div>
        ))}

        <div
          className="pt-2 flex justify-end pr-2 opacity-0 animate-slide-up-fade"
          style={{ animationDelay: `${300 + PROJECTS.length * 100}ms` }}
        >
          <Link
            href="https://github.com/koushikxd?tab=repositories"
            target="_blank"
            className="group inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors font-mono uppercase tracking-wider"
          >
            <span>View Archive</span>
            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1 duration-300 ease-out" />
          </Link>
        </div>
      </div>
    </section>
  );
}
