import React from "react";
import { AbsoluteFill } from "remotion";
import { C } from "../theme";

/**
 * Warm premium backdrop: near-black with soft gold light pools.
 * `drift` (0..1) slowly moves the light so static shots stay alive.
 */
export const Backdrop: React.FC<{
  drift?: number;
  intensity?: number;
  focusX?: number;
  focusY?: number;
  muted?: boolean;
}> = ({ drift = 0, intensity = 1, focusX = 70, focusY = 45, muted = false }) => {
  const x = focusX + Math.sin(drift * Math.PI * 2) * 4;
  const y = focusY + Math.cos(drift * Math.PI * 2) * 3;
  const gold = muted ? "120,120,128" : "205,166,82";
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(48% 62% at ${x}% ${y}%, rgba(${gold},${0.2 * intensity}) 0%, rgba(${gold},0) 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(40% 50% at ${100 - x}% ${100 - y + 20}%, rgba(${gold},${0.07 * intensity}) 0%, rgba(${gold},0) 70%)`,
        }}
      />
      {/* fine grid for depth, barely visible */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage: "radial-gradient(70% 70% at 50% 50%, black 0%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(70% 70% at 50% 50%, black 0%, transparent 100%)",
        }}
      />
      {/* vignette */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(90% 90% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
