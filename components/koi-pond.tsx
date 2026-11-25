"use client";

import { useRef } from "react";
import { useMountEffect } from "@/hooks/use-mount-effect";

const CELL_PX = 4;
const DOT_PX = 3;
const FPS = 30;

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(
  (v) => (v + 0.5) / 16
);

type Koi = {
  length: number;
  width: number;
  speed: number;
  phase: number;
  rx: number;
  ry: number;
  cx: number;
  cy: number;
};

type Ripple = { x: number; y: number; born: number };

const KOI: Koi[] = [
  {
    length: 28,
    width: 4.4,
    speed: 0.11,
    phase: 0,
    rx: 0.36,
    ry: 0.28,
    cx: 0.5,
    cy: 0.55,
  },
  {
    length: 22,
    width: 3.6,
    speed: 0.15,
    phase: 2.2,
    rx: 0.3,
    ry: 0.22,
    cx: 0.42,
    cy: 0.5,
  },
  {
    length: 17,
    width: 3,
    speed: 0.19,
    phase: 4.1,
    rx: 0.4,
    ry: 0.18,
    cx: 0.58,
    cy: 0.6,
  },
];

const LILY_PADS = [
  { xRatio: 0.12, yRatio: 0.5, radiusCells: 7, notch: 0.6 },
  { xRatio: 0.2, yRatio: 0.82, radiusCells: 4.5, notch: 2.4 },
  { xRatio: 0.86, yRatio: 0.45, radiusCells: 6, notch: 3.6 },
  { xRatio: 0.92, yRatio: 0.8, radiusCells: 3.5, notch: 5.1 },
];

const RIPPLE_CELLS_PER_SECOND = 14;
const RIPPLE_LIFE_SECONDS = 2.4;

function koiPose(koi: Koi, cols: number, rows: number, time: number) {
  const t = koi.phase + time * koi.speed;
  const x = cols * (koi.cx + koi.rx * Math.sin(t));
  const y = rows * (koi.cy + koi.ry * Math.sin(2 * t));
  const dx = cols * koi.rx * Math.cos(t);
  const dy = rows * koi.ry * 2 * Math.cos(2 * t);
  return { x, y, angle: Math.atan2(dy, dx) };
}

function koiBrightness(
  koi: Koi,
  pose: ReturnType<typeof koiPose>,
  px: number,
  py: number,
  time: number
) {
  const ox = px - pose.x;
  const oy = py - pose.y;
  const reach = koi.length * 0.65;
  if (ox * ox + oy * oy > reach * reach) return 0;

  const cos = Math.cos(pose.angle);
  const sin = Math.sin(pose.angle);
  const along = ox * cos + oy * sin;
  let across = -ox * sin + oy * cos;
  const tailToHead = along / koi.length + 0.5;
  if (tailToHead < -0.12 || tailToHead > 1) return 0;

  across -=
    Math.sin(time * 6 + koi.phase - tailToHead * 4) * (1 - tailToHead) * 1.6;

  if (tailToHead < 0.14) {
    const spread = (0.14 - tailToHead) * koi.width * 7 + 0.6;
    return Math.abs(across) < spread ? 0.75 : 0;
  }
  const half =
    koi.width * Math.sin(Math.PI * Math.min(1, tailToHead ** 0.75)) + 0.3;
  if (Math.abs(across) > half) {
    const fin =
      tailToHead > 0.55 && tailToHead < 0.68 && Math.abs(across) < half + 2.2;
    return fin ? 0.6 : 0;
  }
  const patch =
    Math.sin(tailToHead * 17 + koi.phase * 3) +
      Math.sin(across * 1.3 + koi.phase) >
    1.1;
  return patch ? 0.3 : 1;
}

export function KoiPond({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useMountEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const ripples: Ripple[] = [];
    const start = performance.now();
    let cols = 0;
    let rows = 0;
    let frame = 0;
    let lastDraw = 0;
    let nextDrop = 0;
    let visible = false;

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.floor(width / CELL_PX);
      rows = Math.floor(height / CELL_PX);
    };

    const draw = (now: number) => {
      const time = (now - start) / 1000;
      if (time > nextDrop) {
        ripples.push({
          x: Math.random() * cols,
          y: Math.random() * rows,
          born: time,
        });
        nextDrop = time + 1.2 + Math.random() * 1.8;
      }
      while (ripples.length && time - ripples[0].born > RIPPLE_LIFE_SECONDS)
        ripples.shift();

      const poses = KOI.map((koi) => koiPose(koi, cols, rows, time));
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = getComputedStyle(canvas).color;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          let b =
            0.08 +
            0.06 *
              Math.sin(x * 0.11 + time * 0.8) *
              Math.sin(y * 0.23 - time * 0.6) +
            0.04 * Math.sin((x + y) * 0.07 - time * 0.5);

          for (const r of ripples) {
            const age = time - r.born;
            const d = Math.hypot(x - r.x, (y - r.y) * 1.6);
            const ring = d - age * RIPPLE_CELLS_PER_SECOND;
            if (ring > -3 && ring < 3) {
              b +=
                0.35 * Math.exp(-ring * ring) * (1 - age / RIPPLE_LIFE_SECONDS);
            }
          }

          for (let i = 0; i < KOI.length; i++) {
            b = Math.max(b, koiBrightness(KOI[i], poses[i], x, y, time));
          }

          for (const pad of LILY_PADS) {
            const dx = x - pad.xRatio * cols;
            const dy = (y - pad.yRatio * rows) * 1.25;
            const d = Math.hypot(dx, dy);
            if (d < pad.radiusCells) {
              const a = Math.atan2(dy, dx) - pad.notch;
              const inNotch =
                Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) < 0.3;
              if (!inNotch) b = d > pad.radiusCells - 1.1 ? 0.85 : 0.22;
            }
          }

          if (b > BAYER[(y & 3) * 4 + (x & 3)]) {
            ctx.fillRect(x * CELL_PX, y * CELL_PX, DOT_PX, DOT_PX);
          }
        }
      }
    };

    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      if (now - lastDraw < 1000 / FPS) return;
      lastDraw = now;
      draw(now);
    };

    const startLoop = () => {
      if (!visible) return;
      if (reducedMotion) return draw(performance.now());
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(loop);
    };

    let lastPointerDrop = 0;
    const onPointerMove = (e: PointerEvent) => {
      const now = (performance.now() - start) / 1000;
      if (now - lastPointerDrop < 0.15) return;
      lastPointerDrop = now;
      const rect = canvas.getBoundingClientRect();
      ripples.push({
        x: (e.clientX - rect.left) / CELL_PX,
        y: (e.clientY - rect.top) / CELL_PX,
        born: now,
      });
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) startLoop();
      else cancelAnimationFrame(frame);
    });

    const onResize = () => {
      resize();
      draw(performance.now());
    };

    resize();
    draw(performance.now());
    observer.observe(canvas);
    window.addEventListener("resize", onResize);
    if (!reducedMotion) canvas.addEventListener("pointermove", onPointerMove);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("pointermove", onPointerMove);
    };
  });

  return <canvas ref={canvasRef} aria-hidden className={className} />;
}
