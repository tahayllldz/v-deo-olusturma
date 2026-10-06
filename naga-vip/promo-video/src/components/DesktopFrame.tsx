import React from "react";
import { UI } from "../fonts";
import { C } from "../theme";

export const DESKTOP_W = 1440;
export const DESKTOP_H = 900;
const CHROME_H = 44;

export const desktopOuterSize = () => ({ w: DESKTOP_W, h: DESKTOP_H + CHROME_H });

/** Browser-window mockup for the Naga admin dashboard (1440×900 content area). */
export const DesktopFrame: React.FC<{
  children: React.ReactNode;
  scale?: number;
  style?: React.CSSProperties;
  title?: string;
}> = ({ children, scale = 1, style, title = "NAGA VIP — Admin Panel (demo)" }) => {
  const { w, h } = desktopOuterSize();
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
          borderRadius: 18,
          overflow: "hidden",
          background: C.ink2,
          boxShadow:
            "0 70px 140px rgba(0,0,0,0.7), 0 24px 48px rgba(0,0,0,0.5), inset 0 0 0 1.5px rgba(255,255,255,0.10)",
          fontFamily: UI,
          color: C.text,
        }}
      >
        <div
          style={{
            height: CHROME_H,
            display: "flex",
            alignItems: "center",
            padding: "0 18px",
            gap: 9,
            background: "#151519",
            borderBottom: `1px solid ${C.line}`,
          }}
        >
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <div key={c} style={{ width: 13, height: 13, borderRadius: 7, background: c }} />
          ))}
          <div
            style={{
              marginLeft: 22,
              height: 28,
              padding: "0 16px",
              display: "flex",
              alignItems: "center",
              borderRadius: 8,
              background: "#202026",
              color: C.muted,
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            {title}
          </div>
        </div>
        <div style={{ position: "relative", width: DESKTOP_W, height: DESKTOP_H }}>{children}</div>
      </div>
    </div>
  );
};
