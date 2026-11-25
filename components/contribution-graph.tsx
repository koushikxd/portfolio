"use client";

import { type PointerEvent, useRef, useState } from "react";
import { useMountEffect } from "@/hooks/use-mount-effect";
import { cn } from "@/lib/utils";

export type Contribution = { date: string; count: number; level: number };

const LEVEL_CLASSES = [
  "bg-foreground/[0.08]",
  "bg-foreground/25",
  "bg-foreground/45",
  "bg-foreground/70",
  "bg-foreground",
];

const DOTS_DELAY_MS = 50;
const COLUMN_STAGGER_MS = 8;

const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});
const monthFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  timeZone: "UTC",
});

const toDate = (date: string) => new Date(`${date}T00:00:00Z`);

// Columns are weeks starting on Sunday; the first week is padded so rows line up with weekdays
function toWeeks(contributions: Contribution[]) {
  const days: (Contribution | null)[] = [];
  if (contributions.length > 0) {
    days.push(...Array(toDate(contributions[0].date).getUTCDay()).fill(null));
  }
  days.push(...contributions);
  const weeks: (Contribution | null)[][] = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));
  return weeks;
}

// Label the week holding the 1st of each month, skipping edges where it would clip
function toMonthLabels(weeks: (Contribution | null)[][]) {
  const labels: { column: number; label: string }[] = [];
  weeks.forEach((week, column) => {
    const first = week.find(
      (day) => day && toDate(day.date).getUTCDate() === 1
    );
    if (first && column > 0 && column < weeks.length - 2) {
      labels.push({ column, label: monthFormat.format(toDate(first.date)) });
    }
  });
  return labels;
}

function describe(day: Contribution) {
  const when = dateFormat.format(toDate(day.date));
  if (day.count === 0) return `No contributions on ${when}`;
  return `${day.count} contribution${day.count === 1 ? "" : "s"} on ${when}`;
}

export function ContributionGraph({
  step,
  contributions,
  total,
}: {
  step: number;
  contributions: Contribution[];
  total: number;
}) {
  const weeks = toWeeks(contributions);
  const months = toMonthLabels(weeks);
  const columns = {
    gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))`,
  };

  const wrapperRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{
    text: string;
    x: number;
    y: number;
    width: number;
  } | null>(null);
  // Separate from tooltip so the last text stays put while it fades out
  const [tooltipVisible, setTooltipVisible] = useState(false);

  // On narrow screens the graph scrolls; open it on the most recent weeks
  useMountEffect(() => {
    const scroller = scrollerRef.current;
    if (scroller) scroller.scrollLeft = scroller.scrollWidth;
  });

  const showTooltip = (e: PointerEvent<HTMLDivElement>) => {
    const dot = (e.target as HTMLElement).closest<HTMLElement>("[data-index]");
    const wrapper = wrapperRef.current;
    if (!dot || !wrapper) return;
    const day = contributions[Number(dot.dataset.index)];
    const dotRect = dot.getBoundingClientRect();
    const wrapperRect = wrapper.getBoundingClientRect();
    setTooltip({
      text: describe(day),
      x: dotRect.left + dotRect.width / 2 - wrapperRect.left,
      y: dotRect.top - wrapperRect.top,
      width: wrapperRect.width,
    });
    setTooltipVisible(true);
  };

  let index = 0;

  return (
    <div
      ref={wrapperRef}
      className="enter relative flex flex-col gap-3"
      style={{ "--step": step }}
    >
      <div
        ref={scrollerRef}
        data-lenis-prevent
        className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden mask-[linear-gradient(to_right,transparent,black_1.5rem)] sm:mask-none"
      >
        <div className="flex min-w-[600px] flex-col gap-2">
          <div
            className="grid gap-[3px] text-xs text-muted-foreground"
            style={columns}
          >
            {months.map(({ column, label }) => (
              <span
                key={column}
                className="whitespace-nowrap"
                style={{ gridColumn: `${column + 1} / span 4` }}
              >
                {label}
              </span>
            ))}
          </div>

          <div
            aria-hidden
            className="grid gap-[3px]"
            style={columns}
            onPointerOver={showTooltip}
            onPointerLeave={() => setTooltipVisible(false)}
          >
            {weeks.map((week, column) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: weeks are positional and never reorder
                key={column}
                className="grid grid-rows-7 gap-[3px] opacity-0 animate-dot-in"
                style={{
                  animationDelay: `calc(var(--step) * var(--enter-stagger) + ${DOTS_DELAY_MS + column * COLUMN_STAGGER_MS}ms)`,
                }}
              >
                {week.map((day, row) =>
                  day ? (
                    <div
                      key={day.date}
                      data-index={index++}
                      className={cn(
                        "aspect-square rounded-full transition-transform duration-150 hover:scale-125",
                        LEVEL_CLASSES[day.level] ?? LEVEL_CLASSES[0]
                      )}
                    />
                  ) : (
                    // biome-ignore lint/suspicious/noArrayIndexKey: padding cells before the first day
                    <div key={row} className="aspect-square" />
                  )
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-[13px] text-muted-foreground">
        <span>
          {total.toLocaleString("en-US")} contributions in the last year
        </span>
        <span className="flex items-center gap-1.5">
          Less
          {LEVEL_CLASSES.map((level) => (
            <span key={level} className={cn("size-2 rounded-full", level)} />
          ))}
          More
        </span>
      </div>

      <div
        role="tooltip"
        className="pointer-events-none absolute left-0 top-0 whitespace-nowrap rounded-full bg-foreground px-2.5 py-1 text-xs text-background transition-opacity duration-150"
        style={{
          opacity: tooltipVisible ? 1 : 0,
          // Centered over the dot, clamped inside the graph; % is the tooltip's own size
          transform: tooltip
            ? `translate(clamp(0px, calc(${tooltip.x}px - 50%), calc(${tooltip.width}px - 100%)), calc(${tooltip.y}px - 100% - 6px))`
            : undefined,
        }}
      >
        {tooltip?.text}
      </div>
    </div>
  );
}
