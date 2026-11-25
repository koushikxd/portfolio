import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const UNDERLINE =
  "underline decoration-dashed decoration-current/35 underline-offset-4 transition-[text-decoration-color] duration-200";

export function TextLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      className={cn("group/link inline-flex items-baseline", className)}
    >
      <span className={cn(UNDERLINE, "group-hover/link:decoration-current")}>
        {children}
      </span>
      <span
        aria-hidden
        className="inline-block max-w-0 overflow-hidden text-[0.75em] opacity-0 -translate-x-0.5 translate-y-0.5 transition-[max-width,margin,opacity,translate] duration-300 ease-out-smooth group-hover/link:ml-0.5 group-hover/link:max-w-[1em] group-hover/link:translate-0 group-hover/link:opacity-100"
      >
        ↗
      </span>
    </Link>
  );
}
