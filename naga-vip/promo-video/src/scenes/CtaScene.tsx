import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { EASE_OUT, clamp, prog } from "../anim";
import { Backdrop } from "../components/Background";
import { Sfx } from "../components/Sfx";
import { NagaExchangeWordmark } from "../components/Wordmark";
import { BRAND } from "../brand";
import { DISPLAY, UI } from "../fonts";
import { useLayout } from "../LayoutContext";
import { C } from "../theme";

export const CtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { isPortrait } = useLayout();
  const a = prog(frame, 2, 26, EASE_OUT);
  const b = prog(frame, 16, 22, EASE_OUT);
  const c = prog(frame, 40, 20, EASE_OUT);
  const shine = interpolate(frame, [10, 60], [-30, 130], clamp);
  const wm = isPortrait ? 150 : 170;

  return (
    <AbsoluteFill style={{ backgroundColor: C.ink, alignItems: "center", justifyContent: "center", textAlign: "center" }}>
      <Backdrop drift={frame / 300} intensity={1.3} focusX={50} focusY={45} />

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", translate: `0 ${isPortrait ? -40 : -10}px` }}>
        <div style={{ opacity: a * 0.9, marginBottom: isPortrait ? 70 : 54 }}>
          <NagaExchangeWordmark size={isPortrait ? 46 : 40} />
        </div>

        <div
          style={{
            display: "flex",
            gap: wm * 0.28,
            fontFamily: DISPLAY,
            fontWeight: 800,
            fontSize: wm,
            letterSpacing: "0.06em",
            lineHeight: 1,
            opacity: a,
            scale: String(0.92 + 0.08 * a),
            filter: `blur(${(1 - a) * 12}px)`,
          }}
        >
          <span style={{ color: C.white }}>NAGA</span>
          <span
            style={{
              backgroundImage: `linear-gradient(105deg, #B48937 ${shine - 30}%, #F6E3AE ${shine - 8}%, #FFFFFF ${shine}%, #F6E3AE ${shine + 8}%, #C9A24A ${shine + 30}%)`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            VIP
          </span>
        </div>

        <div
          style={{
            marginTop: isPortrait ? 70 : 54,
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: isPortrait ? 70 : 64,
            lineHeight: 1.18,
            color: C.ivory,
            opacity: b,
            translate: `0 ${(1 - b) * 24}px`,
          }}
        >
          Müşteriniz gelsin.
          {isPortrait ? <br /> : " "}
          İşlemi <span style={{ color: C.goldLight }}>hazır</span> olsun.
        </div>
      </div>

      <div style={{ position: "absolute", bottom: isPortrait ? 210 : 70, left: 0, right: 0, opacity: c, fontFamily: UI }}>
        <div style={{ fontSize: isPortrait ? 30 : 26, color: C.text, fontWeight: 700, letterSpacing: "0.08em" }}>
          {BRAND.studio.toUpperCase()}
        </div>
        <div style={{ fontSize: isPortrait ? 24 : 20, color: C.muted, marginTop: 8 }}>{BRAND.studioLine}</div>
        <div style={{ fontSize: isPortrait ? 20 : 17, color: C.muted2, marginTop: isPortrait ? 26 : 18 }}>
          Konsept demo · Kurlar ve veriler örnektir (DEMO)
        </div>
      </div>

      <Sfx name="shimmer" at={8} volume={0.5} />
    </AbsoluteFill>
  );
};
