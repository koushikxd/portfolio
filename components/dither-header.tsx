"use client";

import { useTheme } from "next-themes";
import { lazy, Suspense, useState, useSyncExternalStore } from "react";

const Dithering = lazy(() =>
  import("@paper-design/shaders-react").then((mod) => ({
    default: mod.Dithering,
  }))
);

const subscribeNever = () => () => {};

export function DitherHeader() {
  const { setTheme, resolvedTheme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [pendingDark, setPendingDark] = useState<boolean | null>(null);
  const isDark = pendingDark ?? resolvedTheme === "dark";
  const mounted = useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false
  );

  const toggleTheme = () => {
    const isGoingDark = !isDark;
    setPendingDark(isGoingDark);
    document.documentElement.dataset.themeReveal = isGoingDark ? "down" : "up";

    const switchTheme = () => {
      setTheme(isGoingDark ? "dark" : "light");
      setPendingDark(null);
    };

    if (!document.startViewTransition) {
      switchTheme();
      return;
    }
    document.startViewTransition(switchTheme);
  };

  return (
    <div className="enter">
      <button
        type="button"
        aria-label="Toggle theme"
        className="relative block w-full h-24 md:h-32 overflow-hidden border bg-card duration-500 cursor-pointer active:scale-[0.98] transition-transform"
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
        onClick={toggleTheme}
      >
        <Suspense fallback={<div className="absolute inset-0 bg-muted/20" />}>
          <div className="absolute inset-0 z-0 opacity-80 dark:opacity-60">
            {mounted && (
              <Dithering
                colorBack="#00000000"
                colorFront={isDark ? "#ffffff" : "#000000"}
                shape="warp"
                type="4x4"
                speed={isHovered ? 0.6 : 0.2}
                className="size-full"
                minPixelRatio={1}
              />
            )}
          </div>
        </Suspense>
      </button>
    </div>
  );
}
