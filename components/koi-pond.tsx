"use client";

import { useRef } from "react";
import { useMountEffect } from "@/hooks/use-mount-effect";

const CELL_PX = 3;
const DOT_PX = 2;
const FPS = 30;

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(
  (v) => (v + 0.5) / 16
);

const OUTSIDE = -1;
const CLEAR = 0;
const WATER = 1;
const SHADE = 2;
const LIGHT = 3;
const TONE_ALPHA = [0, 0.22, 0.55, 1];

type Pattern = "plain" | "patched" | "crown";

type KoiSpec = {
  length: number;
  width: number;
  speed: number;
  pattern: Pattern;
  seed: number;
};

type Koi = KoiSpec & {
  x: number;
  y: number;
  heading: number;
  tail: number;
  targetX: number;
  targetY: number;
  nextSurface: number;
  boost: number;
};

type Ripple = { x: number; y: number; born: number; strength: number };

const KOI_SPECS: KoiSpec[] = [
  { length: 32, width: 4.6, speed: 8, pattern: "patched", seed: 1.3 },
  { length: 28, width: 4, speed: 9, pattern: "crown", seed: 4.2 },
  { length: 24, width: 3.4, speed: 10, pattern: "plain", seed: 2.7 },
  { length: 20, width: 2.9, speed: 12, pattern: "patched", seed: 5.6 },
];

const LILY_PADS = [
  { xRatio: 0.22, yRatio: 0.6, radius: 12, notch: 0.6, lotus: true },
  { xRatio: 0.3, yRatio: 0.88, radius: 7, notch: 2.4, lotus: false },
  { xRatio: 0.76, yRatio: 0.52, radius: 10, notch: 3.6, lotus: false },
  { xRatio: 0.82, yRatio: 0.86, radius: 6, notch: 5.1, lotus: false },
];

const SWIM_AREA = { left: 0.18, right: 0.82, top: 0.35, bottom: 0.88 };
const RIPPLE_CELLS_PER_SECOND = 16;
const RIPPLE_LIFE_SECONDS = 2.4;
const STARTLE_DECAY_PER_SECOND = 0.7;

function wrapAngle(a: number) {
  return Math.atan2(Math.sin(a), Math.cos(a));
}

function randomIn(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function clampToSwimArea(
  koi: Koi,
  x: number,
  y: number,
  cols: number,
  rows: number
) {
  koi.targetX = Math.min(
    cols * SWIM_AREA.right,
    Math.max(cols * SWIM_AREA.left, x)
  );
  koi.targetY = Math.min(
    rows * SWIM_AREA.bottom,
    Math.max(rows * SWIM_AREA.top, y)
  );
}

function pickTarget(koi: Koi, cols: number, rows: number) {
  do {
    koi.targetX = cols * randomIn(SWIM_AREA.left, SWIM_AREA.right);
    koi.targetY = rows * randomIn(SWIM_AREA.top, SWIM_AREA.bottom);
  } while (Math.hypot(koi.targetX - koi.x, koi.targetY - koi.y) < koi.length);
}

function koiTone(
  koi: Koi,
  cos: number,
  sin: number,
  flap: number,
  px: number,
  py: number,
  threshold: number
) {
  const ox = px - koi.x;
  const oy = py - koi.y;
  const s = (ox * cos + oy * sin) / koi.length + 0.5;
  if (s < -0.22 || s > 1) return OUTSIDE;

  const sway = Math.sin(koi.tail - s * 5) * (1 - s) ** 2 * koi.width * 0.8;
  const across = -ox * sin + oy * cos - sway;
  const a = Math.abs(across);

  if (s < 0.14) {
    const spread = (0.14 - s) * koi.width * 7 + 0.5;
    if (a > spread) return OUTSIDE;
    if (s < -0.08 && a < (-0.08 - s) * koi.width * 9) return OUTSIDE;
    return threshold < 0.7 ? SHADE : OUTSIDE;
  }

  const u = (s - 0.12) / 0.88;
  const half = koi.width * 1.9 * u ** 0.55 * (1 - u) ** 0.4 + 0.35;
  if (a > half) {
    const finReach = (0.74 - s) * koi.length * 0.9 * flap;
    const inFin = s > 0.5 && s < 0.74 && a - half < finReach;
    return inFin && threshold < 0.7 ? SHADE : OUTSIDE;
  }

  if (s > 0.84 && s < 0.9 && Math.abs(a - half * 0.55) < 0.7) return CLEAR;
  if (a < 0.5 && s > 0.3 && s < 0.72) return SHADE;

  if (koi.pattern === "patched") {
    const patch =
      Math.sin(s * 14 + koi.seed) + Math.sin(across * 0.8 + koi.seed * 2);
    return patch > 0.8 ? SHADE : LIGHT;
  }
  if (koi.pattern === "crown") {
    const spot = Math.hypot((s - 0.8) * koi.length, across);
    return spot < koi.width * 0.75 ? SHADE : LIGHT;
  }
  return LIGHT;
}

function padTone(
  pad: (typeof LILY_PADS)[number],
  dx: number,
  dy: number,
  threshold: number
) {
  const d = Math.hypot(dx, dy);
  if (d > pad.radius) return OUTSIDE;
  const angle = Math.atan2(dy, dx);
  if (Math.abs(wrapAngle(angle - pad.notch)) < 0.35) return OUTSIDE;

  if (pad.lotus && d < 3.7) {
    return d < 1.3 + 2.1 * Math.abs(Math.cos(2.5 * angle)) ? LIGHT : CLEAR;
  }
  if (d > pad.radius - 1) return SHADE;
  if (d > 1.5 && Math.abs(Math.sin(angle * 3.5)) < 0.2) return SHADE;
  return threshold < 0.3 ? SHADE : CLEAR;
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
    let tones = new Uint8Array(0);
    let padCells: number[] = [];
    let colWave = new Float64Array(0);
    let frame = 0;
    let lastDraw = 0;
    let lastStep = 0;
    let visible = false;

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.floor(width / CELL_PX);
      rows = Math.floor(height / CELL_PX);
      tones = new Uint8Array(cols * rows);
      colWave = new Float64Array(cols * 4);
      padCells = [];
      for (const pad of LILY_PADS) {
        const cx = pad.xRatio * cols;
        const cy = pad.yRatio * rows;
        const reach = Math.ceil(pad.radius);
        const x0 = Math.max(0, Math.floor(cx) - reach);
        const x1 = Math.min(cols - 1, Math.ceil(cx) + reach);
        const y0 = Math.max(0, Math.floor(cy) - reach);
        const y1 = Math.min(rows - 1, Math.ceil(cy) + reach);
        for (let y = y0; y <= y1; y++) {
          for (let x = x0; x <= x1; x++) {
            const tone = padTone(
              pad,
              x - cx,
              y - cy,
              BAYER[(y & 3) * 4 + (x & 3)]
            );
            if (tone !== OUTSIDE) padCells.push(y * cols + x, tone);
          }
        }
      }
    };

    resize();

    const kois: Koi[] = KOI_SPECS.map((spec) => {
      const koi: Koi = {
        ...spec,
        x: cols * randomIn(SWIM_AREA.left, SWIM_AREA.right),
        y: rows * randomIn(SWIM_AREA.top, SWIM_AREA.bottom),
        heading: randomIn(-Math.PI, Math.PI),
        tail: spec.seed,
        targetX: 0,
        targetY: 0,
        nextSurface: randomIn(1, 5),
        boost: 0,
      };
      pickTarget(koi, cols, rows);
      return koi;
    });

    const step = (dt: number, time: number) => {
      for (const koi of kois) {
        koi.boost = Math.max(0, koi.boost - dt * STARTLE_DECAY_PER_SECOND);
        if (Math.hypot(koi.targetX - koi.x, koi.targetY - koi.y) < 7) {
          pickTarget(koi, cols, rows);
        }

        const toX = koi.targetX - koi.x;
        const toY = koi.targetY - koi.y;
        const dist = Math.hypot(toX, toY) || 1;
        let dirX = toX / dist;
        let dirY = toY / dist;
        for (const other of kois) {
          if (other === koi) continue;
          const awayX = koi.x - other.x;
          const awayY = koi.y - other.y;
          const gap = Math.hypot(awayX, awayY) || 1;
          const personal = (koi.length + other.length) * 0.55;
          if (gap < personal) {
            dirX += (awayX / gap) * (1 - gap / personal) * 2.5;
            dirY += (awayY / gap) * (1 - gap / personal) * 2.5;
          }
        }

        const meander =
          Math.sin(time * 0.5 + koi.seed * 2) * 0.6 * (1 - koi.boost);
        const turnRate = 1 + koi.boost * 5;
        const turn = wrapAngle(Math.atan2(dirY, dirX) + meander - koi.heading);
        koi.heading += Math.max(-turnRate * dt, Math.min(turnRate * dt, turn));

        const cruise = 0.75 + 0.25 * Math.sin(time * 0.3 + koi.seed * 5);
        const speed =
          koi.speed *
          (cruise + koi.boost * 3) *
          Math.max(0.4, Math.min(1, dist / 10));
        koi.x += Math.cos(koi.heading) * speed * dt;
        koi.y += Math.sin(koi.heading) * speed * dt;
        koi.tail += dt * (2.5 + speed * 0.4);

        if (time > koi.nextSurface) {
          ripples.push({
            x: koi.x + Math.cos(koi.heading) * koi.length * 0.45,
            y: koi.y + Math.sin(koi.heading) * koi.length * 0.45,
            born: time,
            strength: 0.8,
          });
          koi.nextSurface = time + randomIn(4, 9);
        }
      }
    };

    const draw = (time: number) => {
      while (ripples.length && time - ripples[0].born > RIPPLE_LIFE_SECONDS)
        ripples.shift();

      for (let x = 0; x < cols; x++) {
        const a = x * 0.09 + time * 0.4;
        const c = Math.sin(x * 0.07 - time * 0.5) * 1.6;
        colWave[x * 4] = Math.sin(a);
        colWave[x * 4 + 1] = Math.cos(a);
        colWave[x * 4 + 2] = Math.sin(c);
        colWave[x * 4 + 3] = Math.cos(c);
      }
      for (let y = 0; y < rows; y++) {
        const b = Math.sin(y * 0.17 + time * 0.7) * 1.8;
        const sinB = Math.sin(b);
        const cosB = Math.cos(b);
        const rowPhase = y * 0.21 - time * 0.3;
        const sinR = Math.sin(rowPhase);
        const cosR = Math.cos(rowPhase);
        for (let x = 0; x < cols; x++) {
          const k = x * 4;
          const w1 = colWave[k] * cosB + colWave[k + 1] * sinB;
          const w2 = sinR * colWave[k + 3] + cosR * colWave[k + 2];
          const caustic = Math.max(0, 1 - Math.abs(w1 + w2) * 4) * 0.45;
          tones[y * cols + x] =
            caustic > BAYER[(y & 3) * 4 + (x & 3)] ? WATER : CLEAR;
        }
      }

      for (const r of ripples) {
        const age = time - r.born;
        const radius = age * RIPPLE_CELLS_PER_SECOND;
        const fade = r.strength * (1 - age / RIPPLE_LIFE_SECONDS);
        const reach = Math.ceil(radius + 2);
        const x0 = Math.max(0, Math.floor(r.x) - reach);
        const x1 = Math.min(cols - 1, Math.ceil(r.x) + reach);
        const y0 = Math.max(0, Math.floor(r.y) - reach);
        const y1 = Math.min(rows - 1, Math.ceil(r.y) + reach);
        for (let y = y0; y <= y1; y++) {
          for (let x = x0; x <= x1; x++) {
            const ring = Math.hypot(x - r.x, y - r.y) - radius;
            if (ring <= -2 || ring >= 2) continue;
            if (
              fade * Math.exp(-ring * ring * 1.5) >
              BAYER[(y & 3) * 4 + (x & 3)]
            )
              tones[y * cols + x] = SHADE;
          }
        }
      }

      for (const koi of kois) {
        const cos = Math.cos(koi.heading);
        const sin = Math.sin(koi.heading);
        const flap = 0.75 + 0.25 * Math.sin(koi.tail * 0.5);
        const reach = Math.ceil(koi.length * 0.75);
        const x0 = Math.max(0, Math.floor(koi.x) - reach);
        const x1 = Math.min(cols - 1, Math.ceil(koi.x) + reach);
        const y0 = Math.max(0, Math.floor(koi.y) - reach);
        const y1 = Math.min(rows - 1, Math.ceil(koi.y) + reach);
        for (let y = y0; y <= y1; y++) {
          for (let x = x0; x <= x1; x++) {
            const tone = koiTone(
              koi,
              cos,
              sin,
              flap,
              x,
              y,
              BAYER[(y & 3) * 4 + (x & 3)]
            );
            if (tone !== OUTSIDE) tones[y * cols + x] = tone;
          }
        }
      }

      for (let i = 0; i < padCells.length; i += 2) {
        tones[padCells[i]] = padCells[i + 1];
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = getComputedStyle(canvas).color;
      for (let tone = WATER; tone <= LIGHT; tone++) {
        ctx.globalAlpha = TONE_ALPHA[tone];
        ctx.beginPath();
        for (let y = 0, i = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++, i++) {
            if (tones[i] === tone)
              ctx.rect(x * CELL_PX, y * CELL_PX, DOT_PX, DOT_PX);
          }
        }
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      if (now - lastDraw < 1000 / FPS) return;
      const time = (now - start) / 1000;
      step(Math.min(0.1, time - lastStep), time);
      lastStep = time;
      lastDraw = now - ((now - lastDraw) % (1000 / FPS));
      draw(time);
    };

    const startLoop = () => {
      if (!visible) return;
      if (reducedMotion) return draw((performance.now() - start) / 1000);
      cancelAnimationFrame(frame);
      lastStep = (performance.now() - start) / 1000;
      frame = requestAnimationFrame(loop);
    };

    const toCells = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: (e.clientX - rect.left) / CELL_PX,
        y: (e.clientY - rect.top) / CELL_PX,
      };
    };

    let lastPointerRipple = 0;
    const onPointerMove = (e: PointerEvent) => {
      const now = (performance.now() - start) / 1000;
      if (now - lastPointerRipple < 0.25) return;
      lastPointerRipple = now;
      ripples.push({ ...toCells(e), born: now, strength: 0.5 });
    };

    const onPointerDown = (e: PointerEvent) => {
      const tap = toCells(e);
      ripples.push({
        ...tap,
        born: (performance.now() - start) / 1000,
        strength: 1,
      });
      for (const koi of kois) {
        const awayX = koi.x - tap.x;
        const awayY = koi.y - tap.y;
        const gap = Math.hypot(awayX, awayY);
        if (gap > koi.length) continue;
        const dirX = gap > 1 ? awayX / gap : Math.cos(koi.heading);
        const dirY = gap > 1 ? awayY / gap : Math.sin(koi.heading);
        koi.boost = 1;
        clampToSwimArea(koi, koi.x + dirX * 60, koi.y + dirY * 60, cols, rows);
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) startLoop();
      else cancelAnimationFrame(frame);
    });

    const onResize = () => {
      resize();
      draw((performance.now() - start) / 1000);
    };

    draw(0);
    observer.observe(canvas);
    window.addEventListener("resize", onResize);
    if (!reducedMotion) {
      canvas.addEventListener("pointermove", onPointerMove);
      canvas.addEventListener("pointerdown", onPointerDown);
    }

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerdown", onPointerDown);
    };
  });

  return <canvas ref={canvasRef} aria-hidden className={className} />;
}
