import { Easing, interpolate } from "remotion";

export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** 0..1 progress of an animation that starts at `start` and lasts `dur` frames. */
export const prog = (frame: number, start: number, dur: number, easing = EASE_OUT) =>
  interpolate(frame, [start, start + dur], [0, 1], { ...clamp, easing });

/** Button press curve: 0 → 1 (pressed) → 0 around a tap at `at`. */
export const press = (frame: number, at: number) =>
  interpolate(frame, [at - 2, at + 2, at + 9], [0, 1, 0], clamp);

/** Finger-tap indicator progress (0..1) for a tap landing at `at`. */
export const tap = (frame: number, at: number) => interpolate(frame, [at - 5, at + 14], [0, 1], clamp);

type Key = { f: number; s: number; ox: number; oy: number; x?: number; y?: number };

/** Interpolates camera keyframes (scale, transform-origin, offset) with easing. */
export const camera = (frame: number, keys: Key[]) => {
  const fs = keys.map((k) => k.f);
  const opt = { ...clamp, easing: EASE_IN_OUT };
  return {
    s: interpolate(frame, fs, keys.map((k) => k.s), opt),
    ox: interpolate(frame, fs, keys.map((k) => k.ox), opt),
    oy: interpolate(frame, fs, keys.map((k) => k.oy), opt),
    x: interpolate(frame, fs, keys.map((k) => k.x ?? 0), opt),
    y: interpolate(frame, fs, keys.map((k) => k.y ?? 0), opt),
  };
};

/** In/out envelope for elements that live between `from` and `to`. */
export const life = (frame: number, from: number, to: number, inDur = 14, outDur = 10) => {
  const i = prog(frame, from, inDur);
  const o = interpolate(frame, [to - outDur, to], [1, 0], { ...clamp, easing: EASE_IN_OUT });
  return Math.min(i, o);
};
