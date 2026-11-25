"use client";

import { useRef, useState } from "react";
import { UNDERLINE } from "@/components/text-link";
import { cn } from "@/lib/utils";

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      // Rejects when permission is denied or the context is insecure
      return;
    }
    setCopied(true);
    resetTimer.current ??= setTimeout(() => {
      resetTimer.current = null;
      setCopied(false);
    }, 1600);
  };

  return (
    <>
      <button
        type="button"
        onClick={copyEmail}
        className={cn(
          UNDERLINE,
          "cursor-pointer text-foreground hover:decoration-current"
        )}
      >
        email me
      </button>
      <span
        aria-hidden
        className="meta ml-2 inline-block transition-[opacity,filter] duration-200 ease-out-smooth"
        style={{
          opacity: copied ? 1 : 0,
          filter: copied ? "blur(0px)" : "blur(2px)",
        }}
      >
        [copied]
      </span>
      <span aria-live="polite" className="sr-only">
        {copied ? "Email address copied" : ""}
      </span>
    </>
  );
}
