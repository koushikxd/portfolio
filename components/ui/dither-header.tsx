"use client";

import { useState, Suspense, lazy } from "react";

const Dithering = lazy(() =>
  import("@paper-design/shaders-react").then((mod) => ({
    default: mod.Dithering,
  })),
);

export function DitherHeader() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="w-full flex justify-start items-center mb-8 opacity-0 animate-slide-up-fade"
      style={{ animationDelay: "0ms" }}
    >
      <div
        className="relative w-full h-24 md:h-32 overflow-hidden border border-border bg-card shadow-sm duration-500"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Suspense fallback={<div className="absolute inset-0 bg-muted/20" />}>
          <div className="absolute inset-0 z-0 opacity-80 dark:opacity-60">
            <Dithering
              colorBack="#00000000" // Transparent
              colorFront="#333333" // Dark Grey/Black
              shape="warp"
              type="4x4"
              speed={isHovered ? 0.6 : 0.2}
              className="size-full"
              minPixelRatio={1}
            />
          </div>
        </Suspense>
      </div>
    </div>
  );
}
