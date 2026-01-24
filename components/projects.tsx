"use client";

import { PROJECTS } from "@/lib/data";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";

export function Projects() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [smoothPosition, setSmoothPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    const animate = () => {
      setSmoothPosition((prev) => ({
        x: lerp(prev.x, mousePosition.x, 0.15),
        y: lerp(prev.y, mousePosition.y, 0.15),
      }));
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mousePosition]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index);
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
    setIsVisible(false);
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="space-y-4"
    >
      <div 
        className="flex items-center justify-between border-b-2 border-muted/80 pb-2 border-dashed opacity-0 animate-slide-up-fade"
        style={{ animationDelay: "200ms" }}
      >
        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          01 // Projects
        </h2>
        <span className="text-xs text-muted-foreground">
          {PROJECTS.length} ITEMS
        </span>
      </div>

      <div
        className="pointer-events-none fixed z-50 overflow-hidden rounded-xl shadow-2xl will-change-transform"
        style={{
          left: containerRef.current?.getBoundingClientRect().left ?? 0,
          top: containerRef.current?.getBoundingClientRect().top ?? 0,
          transform: `translate3d(${smoothPosition.x + 20}px, ${smoothPosition.y - 100}px, 0) scale(${isVisible ? 1 : 0.95})`,
          opacity: isVisible ? 1 : 0,
          transition:
            "opacity 0.3s var(--ease-out-cubic), transform 0.3s var(--ease-out-cubic)",
        }}
      >
        <div className="relative w-[280px] h-[180px] bg-secondary rounded-xl overflow-hidden">
          {PROJECTS.map((project, index) =>
            project.image ? (
              <Image
                key={project.name}
                src={project.image}
                alt={project.name}
                width={280}
                height={180}
                className="absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out"
                style={{
                  opacity: hoveredIndex === index ? 1 : 0,
                  scale: hoveredIndex === index ? 1 : 1.1,
                  filter: hoveredIndex === index ? "none" : "blur(10px)",
                }}
              />
            ) : (
              <div
                key={project.name}
                className="absolute inset-0 flex items-center justify-center bg-secondary transition-all duration-500 ease-out"
                style={{
                  opacity: hoveredIndex === index ? 1 : 0,
                  scale: hoveredIndex === index ? 1 : 1.1,
                  filter: hoveredIndex === index ? "none" : "blur(10px)",
                }}
              >
                <span className="text-muted-foreground text-sm font-medium">
                  Work in progress
                </span>
              </div>
            )
          )}
          <div className="absolute inset-0 bg-linear-to-t from-background/20 to-transparent" />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {PROJECTS.map((project, index) => (
          <div
            key={project.name}
            className="group flex flex-col gap-2 relative pl-2 border-l border-transparent hover:border-foreground transition-colors duration-300 opacity-0 animate-slide-up-fade"
            style={{ animationDelay: `${300 + index * 100}ms` }}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="absolute -left-px top-0 h-full w-px bg-foreground scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300 ease-out" />

            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-4">
              <div className="flex items-baseline gap-2">
                <h3 className="font-medium text-sm text-foreground">
                  {project.name}
                </h3>
              </div>

              <span className="text-xs text-muted-foreground font-mono pr-2">
                [{project.language}]
              </span>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed max-w-lg">
              {project.description}
            </p>

            <div className="flex gap-4 text-[10px] uppercase tracking-wider font-medium">
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
