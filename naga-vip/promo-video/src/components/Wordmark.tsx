import React from "react";
import { Img, staticFile } from "remotion";
import { OFFICIAL_LOGO } from "../brand";
import { DISPLAY } from "../fonts";
import { C, GOLD_TEXT_GRADIENT } from "../theme";

export const GoldText: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <span
    style={{
      backgroundImage: GOLD_TEXT_GRADIENT,
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent",
      ...style,
    }}
  >
    {children}
  </span>
);

/**
 * Typographic NAGA EXCHANGE wordmark (stand-in until the official logo file
 * is dropped into public/brand — see src/brand.ts).
 */
export const NagaExchangeWordmark: React.FC<{
  size?: number;
  color?: string;
  align?: "left" | "center";
  style?: React.CSSProperties;
}> = ({ size = 64, color = C.white, align = "center", style }) => {
  if (OFFICIAL_LOGO) {
    return (
      <Img
        src={staticFile(OFFICIAL_LOGO)}
        style={{ height: size * 2.1, width: "auto", ...style }}
      />
    );
  }
  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: align === "center" ? "center" : "flex-start",
        fontFamily: DISPLAY,
        color,
        lineHeight: 1,
        ...style,
      }}
    >
      <div style={{ fontSize: size, fontWeight: 800, letterSpacing: "0.06em" }}>NAGA</div>
      <div
        style={{
          fontSize: size * 0.24,
          fontWeight: 600,
          letterSpacing: "0.52em",
          marginTop: size * 0.16,
          marginRight: align === "center" ? "-0.52em" : 0,
          opacity: 0.92,
        }}
      >
        EXCHANGE
      </div>
    </div>
  );
};

/** Product wordmark: NAGA (white) + VIP (gold). */
export const NagaVipWordmark: React.FC<{
  size?: number;
  style?: React.CSSProperties;
  color?: string;
}> = ({ size = 64, style, color = C.white }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "baseline",
      gap: size * 0.28,
      fontFamily: DISPLAY,
      fontWeight: 800,
      fontSize: size,
      letterSpacing: "0.06em",
      lineHeight: 1,
      color,
      ...style,
    }}
  >
    <span>NAGA</span>
    <GoldText>VIP</GoldText>
  </div>
);

/** Concept app icon for NAGA VIP (typographic, not the corporate monogram). */
export const AppIcon: React.FC<{ size?: number; style?: React.CSSProperties }> = ({
  size = 64,
  style,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.23,
      background: "linear-gradient(160deg, #1C1C21 0%, #0A0A0C 100%)",
      boxShadow: `inset 0 0 0 ${Math.max(1, size * 0.02)}px rgba(205,166,82,0.55)`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: DISPLAY,
      lineHeight: 1,
      ...style,
    }}
  >
    <GoldText style={{ fontSize: size * 0.5, fontWeight: 800 }}>N</GoldText>
    <div
      style={{
        fontSize: size * 0.13,
        fontWeight: 700,
        letterSpacing: "0.28em",
        marginRight: "-0.28em",
        color: C.white,
        marginTop: size * 0.03,
      }}
    >
      VIP
    </div>
  </div>
);
