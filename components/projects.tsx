"use client";

import Image from "next/image";
import { useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Section } from "@/components/section";
import { TextLink } from "@/components/text-link";
import { useMountEffect } from "@/hooks/use-mount-effect";
import { PROJECTS, SOCIALS } from "@/lib/data";

const PREVIEW_TILTS = [-1.5, 1.5, -1];

const TORN_EDGE =
  "polygon(1% 2%, 12% 0.5%, 25% 1.5%, 38% 0%, 54% 1%, 69% 0.5%, 83% 1.5%, 98% 0%, 99% 14%, 98.5% 31%, 100% 48%, 99% 65%, 99.5% 82%, 98% 99%, 84% 98%, 70% 100%, 55% 98.5%, 40% 99.5%, 25% 98%, 11% 99.5%, 0% 98%, 1% 82%, 0% 65%, 1.5% 48%, 0.5% 31%, 1% 15%)";

const HOVER_QUERY = "(hover: hover) and (pointer: fine)";

function subscribeToHover(onChange: () => void) {
  const mediaQuery = window.matchMedia(HOVER_QUERY);
  mediaQuery.addEventListener("change", onChange);
  return () => mediaQuery.removeEventListener("change", onChange);
}

const getCanHover = () => window.matchMedia(HOVER_QUERY).matches;
// False on the server so SSR and hydration skip the portaled preview
const getServerCanHover = () => false;

function ProjectPreview({
  isVisible,
  previewIndex,
}: {
  isVisible: boolean;
  previewIndex: number;
}) {
  const previewRef = useRef<HTMLDivElement>(null);

  useMountEffect(() => {
    const mouse = { x: 0, y: 0 };
    const smooth = { x: 0, y: 0 };
    let frame = 0;

    // Lerps toward the cursor and stops once settled; the next mousemove restarts it,
    // so the card keeps tracking while hidden and never jumps when it reappears
    const animate = () => {
      smooth.x += (mouse.x - smooth.x) * 0.15;
      smooth.y += (mouse.y - smooth.y) * 0.15;
      const settled =
        Math.abs(mouse.x - smooth.x) < 0.1 &&
        Math.abs(mouse.y - smooth.y) < 0.1;
      if (settled) {
        smooth.x = mouse.x;
        smooth.y = mouse.y;
      }
      if (previewRef.current) {
        previewRef.current.style.transform = `translate3d(${smooth.x + 20}px, ${smooth.y - 120}px, 0)`;
      }
      frame = settled ? 0 : requestAnimationFrame(animate);
    };

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!frame) frame = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove);
    frame = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(frame);
    };
  });

  return createPortal(
    <div
      ref={previewRef}
      className="pointer-events-none fixed left-0 top-0 z-50 w-[300px] will-change-transform"
      style={{
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0.95,
        transition:
          "opacity 220ms var(--ease-out-smooth), scale 220ms var(--ease-out-smooth)",
      }}
    >
      {/* Paper print: torn edge via clip-path, so the shadow lives on the parent filter */}
      <div
        className="transition-[rotate] duration-300 ease-out-smooth [filter:drop-shadow(0_0_1px_var(--border))_drop-shadow(2px_6px_10px_rgb(0_0_0/0.14))]"
        style={{
          rotate: `${PREVIEW_TILTS[previewIndex % PREVIEW_TILTS.length]}deg`,
        }}
      >
        <div className="bg-card p-3" style={{ clipPath: TORN_EDGE }}>
          <div className="relative aspect-[16/10] overflow-hidden bg-muted/40">
            {PROJECTS.map((project, index) => (
              <Image
                key={project.name}
                src={project.image}
                alt=""
                fill
                sizes="300px"
                className="object-cover saturate-[0.7] transition-all duration-500 ease-out"
                style={{
                  opacity: previewIndex === index ? 1 : 0,
                  scale: previewIndex === index ? 1 : 1.1,
                  filter: previewIndex === index ? "none" : "blur(10px)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export function Projects({ step }: { step: number }) {
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  // Last hovered project, kept after leaving so the image holds while the card fades out
  const [previewIndex, setPreviewIndex] = useState(0);
  const canHover = useSyncExternalStore(
    subscribeToHover,
    getCanHover,
    getServerCanHover
  );

  return (
    <Section title="Projects" step={step}>
      {canHover && (
        <ProjectPreview
          isVisible={isPreviewVisible}
          previewIndex={previewIndex}
        />
      )}

      <div className="flex flex-col gap-7" data-dim-group>
        {PROJECTS.map((project, index) => {
          return (
            // biome-ignore lint/a11y/noStaticElementInteractions: hover only drives the decorative image preview
            <div
              key={project.name}
              data-dim-item
              className="enter flex flex-col gap-1"
              style={{ "--step": step + 1 + index }}
              onMouseEnter={() => {
                setIsPreviewVisible(true);
                setPreviewIndex(index);
              }}
              onMouseLeave={() => setIsPreviewVisible(false)}
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-base font-medium text-foreground">
                  <TextLink href={project.url}>{project.name}</TextLink>
                </h3>
                <span className="meta shrink-0">[{project.language}]</span>
              </div>

              <p className="text-base text-muted-foreground leading-relaxed max-w-lg text-pretty">
                {project.description}
              </p>

              {project.source && (
                <div className="pt-0.5 text-sm text-muted-foreground">
                  <TextLink href={project.source}>source</TextLink>
                </div>
              )}
            </div>
          );
        })}
      </div>

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
