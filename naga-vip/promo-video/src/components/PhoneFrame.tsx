import React from "react";
import { UI } from "../fonts";
import { C } from "../theme";

export const SCREEN_W = 393;
export const SCREEN_H = 852;

type Variant = "iphone" | "android";

const SPEC = {
  iphone: { bezel: 13, outerRadius: 68, screenRadius: 56 },
  android: { bezel: 10, outerRadius: 52, screenRadius: 44 },
} as const;

export const phoneOuterSize = (variant: Variant = "iphone") => ({
  w: SCREEN_W + SPEC[variant].bezel * 2,
  h: SCREEN_H + SPEC[variant].bezel * 2,
});

const SideButton: React.FC<{ side: "left" | "right"; top: number; height: number }> = ({
  side,
  top,
  height,
}) => (
  <div
    style={{
      position: "absolute",
      [side]: -3,
      top,
      width: 4,
      height,
      borderRadius: 2,
      background: "linear-gradient(90deg, #4a4a50, #2a2a2f)",
    }}
  />
);

const StatusIcons: React.FC<{ color: string }> = ({ color }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
    {/* signal */}
    <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 12 }}>
      {[5, 7, 9, 11].map((h) => (
        <div key={h} style={{ width: 3, height: h, borderRadius: 1, background: color }} />
      ))}
    </div>
    {/* wifi */}
    <svg width="16" height="12" viewBox="0 0 16 12">
      <path d="M8 11.5 L5.6 8.9 A3.4 3.4 0 0 1 10.4 8.9 Z" fill={color} />
      <path d="M3.5 6.8 A6.4 6.4 0 0 1 12.5 6.8" stroke={color} strokeWidth="1.7" fill="none" strokeLinecap="round" />
      <path d="M1.2 4.4 A9.6 9.6 0 0 1 14.8 4.4" stroke={color} strokeWidth="1.7" fill="none" strokeLinecap="round" />
    </svg>
    {/* battery */}
    <div style={{ display: "flex", alignItems: "center", gap: 1 }}>
      <div
        style={{
          width: 24,
          height: 12,
          borderRadius: 4,
          border: `1.2px solid ${color}`,
          opacity: 0.9,
          padding: 1.5,
          boxSizing: "border-box",
        }}
      >
        <div style={{ width: "80%", height: "100%", borderRadius: 2, background: color }} />
      </div>
      <div style={{ width: 1.5, height: 4, borderRadius: 1, background: color, opacity: 0.5 }} />
    </div>
  </div>
);

export const StatusBar: React.FC<{
  variant?: Variant;
  time?: string;
  color?: string;
}> = ({ variant = "iphone", time = "9:41", color = C.white }) => (
  <div
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 54,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: variant === "iphone" ? "6px 30px 0 40px" : "4px 24px 0 26px",
      fontFamily: UI,
      fontWeight: 600,
      fontSize: variant === "iphone" ? 17 : 15,
      color,
      zIndex: 50,
      boxSizing: "border-box",
    }}
  >
    <span>{time}</span>
    <StatusIcons color={color} />
  </div>
);

/**
 * Realistic phone frame. Children are laid out on a 393×852 screen.
 * Use the `scale` prop to size it in the frame.
 */
export const PhoneFrame: React.FC<{
  children: React.ReactNode;
  variant?: Variant;
  scale?: number;
  style?: React.CSSProperties;
  glow?: number;
  statusTime?: string;
  hideStatusBar?: boolean;
}> = ({
  children,
  variant = "iphone",
  scale = 1,
  style,
  glow = 0.5,
  statusTime,
  hideStatusBar,
}) => {
  const s = SPEC[variant];
  const { w, h } = phoneOuterSize(variant);
  return (
    <div style={{ width: w * scale, height: h * scale, position: "relative", ...style }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: w,
          height: h,
          scale: String(scale),
          transformOrigin: "0 0",
        }}
      >
        {/* glow */}
        <div
          style={{
            position: "absolute",
            inset: -60,
            borderRadius: s.outerRadius + 60,
            background: `radial-gradient(closest-side, rgba(205,166,82,${0.28 * glow}), rgba(205,166,82,0) 100%)`,
            filter: "blur(30px)",
          }}
        />
        {/* body */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: s.outerRadius,
            background:
              variant === "iphone"
                ? "linear-gradient(145deg, #4b4b52 0%, #1d1d22 22%, #2e2e34 55%, #121216 80%, #3a3a40 100%)"
                : "linear-gradient(145deg, #2c2c33 0%, #17171b 50%, #25252b 100%)",
            boxShadow:
              "0 60px 120px rgba(0,0,0,0.65), 0 20px 40px rgba(0,0,0,0.5), inset 0 0 0 1.5px rgba(255,255,255,0.10)",
          }}
        />
        {variant === "iphone" ? (
          <>
            <SideButton side="left" top={150} height={32} />
            <SideButton side="left" top={215} height={62} />
            <SideButton side="left" top={290} height={62} />
            <SideButton side="right" top={250} height={96} />
          </>
        ) : (
          <>
            <SideButton side="right" top={190} height={110} />
            <SideButton side="right" top={330} height={56} />
          </>
        )}
        {/* black display border */}
        <div
          style={{
            position: "absolute",
            inset: s.bezel - 4,
            borderRadius: s.screenRadius + 4,
            background: "#000",
          }}
        />
        {/* screen */}
        <div
          style={{
            position: "absolute",
            left: s.bezel,
            top: s.bezel,
            width: SCREEN_W,
            height: SCREEN_H,
            borderRadius: s.screenRadius,
            overflow: "hidden",
            background: C.ink,
            fontFamily: UI,
            color: C.text,
          }}
        >
          {children}
          {hideStatusBar ? null : <StatusBar variant={variant} time={statusTime} />}
          {variant === "iphone" ? (
            <div
              style={{
                position: "absolute",
                top: 11,
                left: (SCREEN_W - 122) / 2,
                width: 122,
                height: 36,
                borderRadius: 20,
                background: "#000",
                zIndex: 60,
              }}
            />
          ) : (
            <div
              style={{
                position: "absolute",
                top: 14,
                left: SCREEN_W / 2 - 7,
                width: 14,
                height: 14,
                borderRadius: 7,
                background: "#000",
                boxShadow: "inset 0 0 0 2px #1a1a1f",
                zIndex: 60,
              }}
            />
          )}
          {/* home indicator */}
          <div
            style={{
              position: "absolute",
              bottom: 8,
              left: (SCREEN_W - 134) / 2,
              width: 134,
              height: 5,
              borderRadius: 3,
              background: "rgba(255,255,255,0.75)",
              zIndex: 60,
            }}
          />
          {/* glass reflection */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(118deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 28%, rgba(255,255,255,0) 40%)",
              pointerEvents: "none",
              zIndex: 70,
            }}
          />
        </div>
      </div>
    </div>
  );
};
