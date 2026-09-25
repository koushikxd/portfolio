"use client";

import { useTheme } from "next-themes";
import { lazy, Suspense, useCallback, useEffect, useState } from "react";
// import { MetalFx } from "metal-fx";
import { cn } from "@/lib/utils";

const Dithering = lazy(() =>
  import("@paper-design/shaders-react").then((mod) => ({
    default: mod.Dithering,
  }))
);

const useThemeToggle = () => {
  const { setTheme, resolvedTheme } = useTheme();
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDark(resolvedTheme === "dark");
  }, [resolvedTheme]);

  const styleId = "theme-transition-styles";

  const updateStyles = useCallback((isGoingDark: boolean) => {
    if (typeof window === "undefined") return;

    let styleElement = document.getElementById(styleId) as HTMLStyleElement;

    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    // if going dark, let's do top-down. If going light, bottom-up.
    const clipPath = isGoingDark
      ? {
          from: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
          to: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        }
      : {
          from: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
          to: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        };

    const css = `
      ::view-transition-group(root) {
        animation-duration: 0.7s;
        animation-timing-function: var(--ease-out-cubic);
      }
            
      ::view-transition-new(root) {
        animation-name: reveal-new-theme;
      }

      ::view-transition-old(root),
      .dark::view-transition-old(root) {
        animation: none;
        z-index: -1;
      }
      .dark::view-transition-new(root) {
        animation-name: reveal-new-theme;
      }

      @keyframes reveal-new-theme {
        from {
          clip-path: ${clipPath.from};
        }
        to {
          clip-path: ${clipPath.to};
        }
      }
    `;

    styleElement.textContent = css;
  }, []);

  const toggleTheme = useCallback(() => {
    const isGoingDark = !isDark;
    setIsDark(isGoingDark);
    updateStyles(isGoingDark);

    if (typeof window === "undefined") return;

    const switchTheme = () => {
      setTheme(resolvedTheme === "light" ? "dark" : "light");
    };

    if (!document.startViewTransition) {
      switchTheme();
      return;
    }

    document.startViewTransition(switchTheme);
  }, [resolvedTheme, setTheme, updateStyles, isDark]);

  return {
    isDark,
    toggleTheme,
    mounted,
  };
};

export function DitherHeader() {
  const [isHovered, setIsHovered] = useState(false);
  const { isDark, toggleTheme, mounted } = useThemeToggle();

  return (
    <div
      className="w-full flex justify-start items-center mb-8 opacity-0 animate-slide-up-fade"
      style={{ animationDelay: "0ms" }}
    >
      {/* <MetalFx preset="silver" strength={1} style={{ width: "200%" }}> */}
      <div
        className={cn(
          "relative w-full h-24 md:h-32 overflow-hidden border border-border bg-card shadow-sm duration-500",
          "cursor-pointer active:scale-[0.98] transition-transform"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={toggleTheme}
        role="button"
        aria-label="Toggle theme"
      >
        <Suspense fallback={<div className="absolute inset-0 bg-muted/20" />}>
          <div className="absolute inset-0 z-0 opacity-80 dark:opacity-60">
            {mounted && (
              <Dithering
                colorBack="#00000000" // Transparent
                colorFront={isDark ? "#ffffff" : "#000000"} // Adaptive based on theme
                shape="warp"
                type="4x4"
                speed={isHovered ? 0.6 : 0.2}
                className="size-full"
                minPixelRatio={1}
              />
            )}
          </div>
        </Suspense>
      </div>
      {/* </MetalFx> */}
    </div>
  );
}
