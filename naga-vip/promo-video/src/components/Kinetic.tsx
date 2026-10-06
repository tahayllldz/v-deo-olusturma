import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { EASE_OUT, clamp } from "../anim";
import { useLayout } from "../LayoutContext";
import { DISPLAY, UI } from "../fonts";
import { C } from "../theme";
import { Eyebrow } from "./ui";

/** Word-by-word reveal (fade + rise + blur-to-sharp). */
export const WordReveal: React.FC<{
  text: string;
  start: number;
  stagger?: number;
  style?: React.CSSProperties;
  wordStyle?: (word: string, i: number) => React.CSSProperties | undefined;
}> = ({ text, start, stagger = 5, style, wordStyle }) => {
  const frame = useCurrentFrame();
  const words = text.split(" ");
  return (
    <span style={style}>
      {words.map((w, i) => {
        const p = interpolate(frame, [start + i * stagger, start + i * stagger + 14], [0, 1], { ...clamp, easing: EASE_OUT });
        return (
          <span
            key={`${w}-${i}`}
            style={{
              display: "inline-block",
              opacity: p,
              translate: `0 ${(1 - p) * 34}px`,
              filter: `blur(${(1 - p) * 10}px)`,
              marginRight: i < words.length - 1 ? "0.26em" : 0,
              ...wordStyle?.(w, i),
            }}
          >
            {w}
          </span>
        );
      })}
    </span>
  );
};

/**
 * Format-aware caption block: eyebrow + big value + subline.
 * Landscape: left column. Portrait: centered at the top.
 */
export const Caption: React.FC<{
  visibility: number;
  eyebrow?: string;
  children: React.ReactNode;
  sub?: React.ReactNode;
  valueSize?: number;
  style?: React.CSSProperties;
}> = ({ visibility, eyebrow, children, sub, valueSize = 112, style }) => {
  const { isPortrait, fontScale } = useLayout();
  if (visibility <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        ...(isPortrait
          ? { left: 70, right: 70, top: 190, textAlign: "center", alignItems: "center" }
          : { left: 150, width: 900, top: 0, bottom: 0, justifyContent: "center" }),
        display: "flex",
        flexDirection: "column",
        opacity: visibility,
        translate: `0 ${(1 - visibility) * 26}px`,
        filter: `blur(${(1 - visibility) * 6}px)`,
        ...style,
      }}
    >
      {eyebrow ? <Eyebrow size={26 * fontScale}>{eyebrow}</Eyebrow> : null}
      <div
        style={{
          fontFamily: DISPLAY,
          fontWeight: 800,
          fontSize: valueSize * (isPortrait ? 0.95 : 1) * fontScale,
          lineHeight: 1.04,
          color: C.white,
          marginTop: eyebrow ? 22 : 0,
          letterSpacing: "-0.01em",
        }}
      >
        {children}
      </div>
      {sub ? (
        <div style={{ fontFamily: UI, fontSize: 36 * fontScale, color: C.muted, marginTop: 24, lineHeight: 1.35, fontWeight: 500 }}>
          {sub}
        </div>
      ) : null}
    </div>
  );
};
