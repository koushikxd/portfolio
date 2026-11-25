"use client";

import { useState } from "react";
import { useMountEffect } from "@/hooks/use-mount-effect";

const SESSION_KEY = "portfolio:visited";

async function fetchVisitors(): Promise<number | null> {
  try {
    const hasVisited = sessionStorage.getItem(SESSION_KEY);
    const res = await fetch("/api/visitors", {
      method: hasVisited ? "GET" : "POST",
    });
    if (!res.ok) return null;
    const data: unknown = await res.json();
    const visitors =
      typeof data === "object" && data !== null && "visitors" in data
        ? data.visitors
        : undefined;
    if (typeof visitors !== "number") return null;
    if (!hasVisited) sessionStorage.setItem(SESSION_KEY, "1");
    return visitors;
  } catch {
    return null;
  }
}

let visitorsRequest: Promise<number | null> | undefined;

export function VisitorCount() {
  const [count, setCount] = useState<number | null>(null);

  useMountEffect(() => {
    visitorsRequest ??= fetchVisitors();
    visitorsRequest.then(setCount);
  });

  if (count === null) return <span className="animate-pulse">Visitors #0</span>;

  return <span>Visitors #{count.toLocaleString()}</span>;
}
