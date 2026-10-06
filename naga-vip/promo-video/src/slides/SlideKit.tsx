import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop } from "../components/Background";
import { DemoTag, Eyebrow } from "../components/ui";
import { NagaVipWordmark } from "../components/Wordmark";
import { DISPLAY, UI } from "../fonts";
import { C } from "../theme";

export const TOTAL_SLIDES = 12;

/** Shared 1920×1080 slide frame: backdrop, footer, page number. */
export const SlideFrame: React.FC<{
  n: number;
  children: React.ReactNode;
  demo?: boolean;
  focusX?: number;
  focusY?: number;
  muted?: boolean;
  intensity?: number;
  hideFooter?: boolean;
}> = ({ n, children, demo, focusX = 70, focusY = 50, muted, intensity = 1, hideFooter }) => (
  <AbsoluteFill style={{ fontFamily: UI, color: C.text, backgroundColor: C.ink }}>
    <Backdrop focusX={focusX} focusY={focusY} muted={muted} intensity={intensity} />
    {children}
    {hideFooter ? null : (
      <div
        style={{
          position: "absolute",
          left: 120,
          right: 120,
          bottom: 52,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 20,
          color: C.muted2,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <NagaVipWordmark size={20} />
          <span>Ürün konsepti · Beta Studio</span>
          {demo ? <DemoTag label="DEMO VERİ · KURLAR ÖRNEKTİR" size={12} /> : null}
        </div>
        <div style={{ fontWeight: 600, letterSpacing: "0.08em" }}>
          {String(n).padStart(2, "0")} / {TOTAL_SLIDES}
        </div>
      </div>
    )}
  </AbsoluteFill>
);

export const SlideTitle: React.FC<{
  eyebrow?: string;
  children: React.ReactNode;
  sub?: React.ReactNode;
  size?: number;
  style?: React.CSSProperties;
}> = ({ eyebrow, children, sub, size = 92, style }) => (
  <div style={style}>
    {eyebrow ? <Eyebrow size={24}>{eyebrow}</Eyebrow> : null}
    <div
      style={{
        fontFamily: DISPLAY,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.05,
        letterSpacing: "-0.01em",
        color: C.white,
        marginTop: eyebrow ? 22 : 0,
      }}
    >
      {children}
    </div>
    {sub ? (
      <div style={{ fontSize: 36, lineHeight: 1.4, color: C.muted, marginTop: 26, fontWeight: 500 }}>{sub}</div>
    ) : null}
  </div>
);

export const IconCircle: React.FC<{
  children: React.ReactNode;
  size?: number;
  muted?: boolean;
  style?: React.CSSProperties;
}> = ({ children, size = 84, muted, style }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      flexShrink: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: muted ? C.surface2 : "rgba(205,166,82,0.14)",
      boxShadow: muted ? `inset 0 0 0 1.5px ${C.lineStrong}` : "inset 0 0 0 1.5px rgba(205,166,82,0.55)",
      color: muted ? C.muted : C.goldLight,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; gold?: boolean }> = ({
  children,
  style,
  gold,
}) => (
  <div
    style={{
      borderRadius: 28,
      background: gold ? "linear-gradient(150deg, rgba(205,166,82,0.16), rgba(205,166,82,0.03) 70%)" : C.surface,
      boxShadow: gold ? "inset 0 0 0 1.5px rgba(205,166,82,0.5)" : `inset 0 0 0 1px ${C.line}`,
      ...style,
    }}
  >
    {children}
  </div>
);
