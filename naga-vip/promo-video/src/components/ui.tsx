import React from "react";
import { ChevronLeft } from "lucide-react";
import { DISPLAY, UI } from "../fonts";
import { C, GOLD_GRADIENT, RADIUS, STATUS_STYLE, type ReservationStatus } from "../theme";

export const DemoTag: React.FC<{
  label?: string;
  size?: number;
  style?: React.CSSProperties;
}> = ({ label = "DEMO RATE", size = 10, style }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      height: size * 2,
      padding: `0 ${size * 0.75}px`,
      borderRadius: size * 0.5,
      border: `1px solid rgba(205,166,82,0.55)`,
      color: C.goldLight,
      fontFamily: UI,
      fontWeight: 700,
      fontSize: size,
      letterSpacing: "0.08em",
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {label}
  </span>
);

export const StatusBadge: React.FC<{
  status: ReservationStatus;
  size?: number;
  lang?: "en" | "tr";
  style?: React.CSSProperties;
}> = ({ status, size = 12, lang = "en", style }) => {
  const s = STATUS_STYLE[status];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: size * 0.5,
        height: size * 2.2,
        padding: `0 ${size * 0.85}px`,
        borderRadius: RADIUS.pill,
        background: s.bg,
        color: s.fg,
        fontFamily: UI,
        fontWeight: 700,
        fontSize: size,
        letterSpacing: lang === "en" ? "0.08em" : "0.01em",
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      <span style={{ width: size * 0.55, height: size * 0.55, borderRadius: 99, background: s.fg }} />
      {lang === "en" ? s.label : s.labelTr}
    </span>
  );
};

export const CurrencyBadge: React.FC<{
  symbol: string;
  size?: number;
  gold?: boolean;
  style?: React.CSSProperties;
}> = ({ symbol, size = 40, gold, style }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      flexShrink: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: gold ? GOLD_GRADIENT : C.surface3,
      color: gold ? "#1A1407" : C.goldLight,
      fontFamily: UI,
      fontWeight: 700,
      fontSize: size * 0.46,
      boxShadow: gold ? "none" : `inset 0 0 0 1px ${C.lineStrong}`,
      ...style,
    }}
  >
    {symbol}
  </div>
);

/** press: 0 = idle, 1 = fully pressed (scale down + brighten). */
export const AppButton: React.FC<{
  label: string;
  variant?: "gold" | "outline" | "dark";
  press?: number;
  icon?: React.ReactNode;
  height?: number;
  style?: React.CSSProperties;
  fontSize?: number;
}> = ({ label, variant = "gold", press = 0, icon, height = 56, style, fontSize = 17 }) => (
  <div
    style={{
      height,
      borderRadius: RADIUS.button,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      fontFamily: UI,
      fontWeight: 700,
      fontSize,
      letterSpacing: "0.01em",
      scale: String(1 - press * 0.04),
      filter: `brightness(${1 + press * 0.12})`,
      ...(variant === "gold"
        ? {
            background: GOLD_GRADIENT,
            color: "#17120A",
            boxShadow: "0 10px 26px rgba(205,166,82,0.28)",
          }
        : variant === "outline"
          ? { background: "transparent", color: C.text, boxShadow: `inset 0 0 0 1.5px ${C.lineStrong}` }
          : { background: C.surface2, color: C.text }),
      ...style,
    }}
  >
    {icon}
    {label}
  </div>
);

export const NavBar: React.FC<{ title: string; step?: number; steps?: number }> = ({
  title,
  step,
  steps = 3,
}) => (
  <div
    style={{
      position: "absolute",
      top: 54,
      left: 0,
      right: 0,
      height: 52,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 18px 0 12px",
    }}
  >
    <div
      style={{
        width: 38,
        height: 38,
        borderRadius: 19,
        background: C.surface2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ChevronLeft size={22} color={C.text} strokeWidth={2.2} />
    </div>
    <div style={{ fontFamily: UI, fontWeight: 700, fontSize: 18, color: C.text }}>{title}</div>
    <div style={{ width: 38, display: "flex", justifyContent: "flex-end", gap: 4 }}>
      {step !== undefined
        ? Array.from({ length: steps }).map((_, i) => (
            <div
              key={i}
              style={{
                width: i === step - 1 ? 14 : 6,
                height: 6,
                borderRadius: 3,
                background: i < step ? C.gold : C.surface3,
              }}
            />
          ))
        : null}
    </div>
  </div>
);

export const ScreenBg: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      background:
        "radial-gradient(120% 60% at 50% -10%, rgba(205,166,82,0.16) 0%, rgba(205,166,82,0) 60%), #0A0A0C",
      fontFamily: UI,
      color: C.text,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Label: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <div
    style={{
      fontFamily: UI,
      fontSize: 13,
      fontWeight: 600,
      color: C.muted,
      letterSpacing: "0.02em",
      ...style,
    }}
  >
    {children}
  </div>
);

/** Finger-tap indicator. progress 0..1 over the tap; invisible outside. */
export const TapIndicator: React.FC<{ x: number; y: number; progress: number; size?: number }> = ({
  x,
  y,
  progress,
  size = 56,
}) => {
  if (progress <= 0 || progress >= 1) return null;
  const appear = Math.min(1, progress / 0.25);
  const ripple = Math.max(0, (progress - 0.3) / 0.7);
  return (
    <div style={{ position: "absolute", left: x - size / 2, top: y - size / 2, width: size, height: size, zIndex: 40, pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: size,
          background: "rgba(255,255,255,0.38)",
          boxShadow: "0 0 0 1.5px rgba(255,255,255,0.55)",
          opacity: appear * (1 - ripple),
          scale: String(1 - 0.18 * Math.min(1, progress / 0.35)),
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: size,
          border: "2px solid rgba(238,213,151,0.8)",
          opacity: ripple > 0 ? 1 - ripple : 0,
          scale: String(1 + ripple * 1.1),
        }}
      />
    </div>
  );
};

export const Eyebrow: React.FC<{ children: React.ReactNode; size?: number; style?: React.CSSProperties }> = ({
  children,
  size = 22,
  style,
}) => (
  <div
    style={{
      fontFamily: DISPLAY,
      fontWeight: 700,
      fontSize: size,
      letterSpacing: "0.22em",
      textTransform: "uppercase",
      color: C.gold,
      ...style,
    }}
  >
    {children}
  </div>
);
