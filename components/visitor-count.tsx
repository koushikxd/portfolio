"use client";

import { useEffect, useState } from "react";

const SESSION_KEY = "portfolio:visited";

export function VisitorCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const hasVisited = sessionStorage.getItem(SESSION_KEY);

    if (hasVisited) {
      fetch("/api/visitors")
        .then((res) => res.json())
        .then((data) => setCount(data.visitors))
        .catch(() => setCount(null));
    } else {
      fetch("/api/visitors", { method: "POST" })
        .then((res) => res.json())
        .then((data) => {
          setCount(data.visitors);
          sessionStorage.setItem(SESSION_KEY, "1");
        })
        .catch(() => setCount(null));
    }
  }, []);

  if (count === null) return <span className="animate-pulse">Visitors #0</span>;

  return (
    <span className="hidden sm:inline">Visitors #{count.toLocaleString()}</span>
  );
}
