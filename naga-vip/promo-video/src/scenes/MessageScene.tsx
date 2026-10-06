import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EASE_OUT, prog } from "../anim";
import { Backdrop } from "../components/Background";
import { WordReveal } from "../components/Kinetic";
import { PhoneFrame, phoneOuterSize } from "../components/PhoneFrame";
import { Sfx } from "../components/Sfx";
import { DISPLAY } from "../fonts";
import { useLayout } from "../LayoutContext";
import { StatusScreen } from "../screens/StatusScreen";
import { SuccessScreen } from "../screens/SuccessScreen";
import { C } from "../theme";
import { MESSAGE } from "../timeline";

const LINES = ["Daha hızlı.", "Daha kolay.", "Daha VIP."];

export const MessageScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { isPortrait, width } = useLayout();
  const outer = phoneOuterSize();
  const s = isPortrait ? 0.86 : 0.86;
  const enter = prog(frame, 0, 28, EASE_OUT);
  const drift = frame * 0.15;

  return (
    <AbsoluteFill style={{ backgroundColor: C.ink }}>
      <Backdrop drift={frame / 200} intensity={1.2} focusX={isPortrait ? 50 : 70} focusY={isPortrait ? 70 : 50} />

      <div
        style={{
          position: "absolute",
          ...(isPortrait
            ? { left: 60, right: 60, top: 170, textAlign: "center" }
            : { left: 150, top: 0, bottom: 0, display: "flex", flexDirection: "column", justifyContent: "center" }),
          fontFamily: DISPLAY,
          fontWeight: 800,
          fontSize: isPortrait ? 118 : 132,
          lineHeight: 1.1,
          color: C.white,
        }}
      >
        {LINES.map((line, i) => (
          <div key={line}>
            <WordReveal
              text={line}
              start={MESSAGE.lines[i]}
              stagger={5}
              wordStyle={(w) => (w === "VIP." ? { color: C.goldLight } : i < 2 && frame > MESSAGE.lines[2] ? { opacity: 0.55 } : undefined)}
            />
          </div>
        ))}
      </div>

      {/* iPhone + Android: same experience on both platforms */}
      <div
        style={{
          position: "absolute",
          ...(isPortrait
            ? { left: width / 2 - outer.w * s - 10, top: 760 }
            : { left: 1030, top: 120 }),
          display: "flex",
          gap: isPortrait ? 20 : 30,
          opacity: enter,
          translate: `${-drift}px ${(1 - enter) * 80}px`,
        }}
      >
        <div style={{ translate: `0 ${isPortrait ? 0 : 60}px`, transform: isPortrait ? undefined : "perspective(1800px) rotateY(14deg)" }}>
          <PhoneFrame scale={s} glow={0.5}>
            <SuccessScreen progress={1} />
          </PhoneFrame>
        </div>
        <div style={{ translate: `0 ${isPortrait ? 70 : -20}px`, transform: isPortrait ? undefined : "perspective(1800px) rotateY(14deg)" }}>
          <PhoneFrame scale={s} variant="android" glow={0.5}>
            <StatusScreen stage={2} />
          </PhoneFrame>
        </div>
      </div>

      {MESSAGE.lines.map((at) => (
        <Sfx key={at} name="swipe" at={at} volume={0.35} />
      ))}
    </AbsoluteFill>
  );
};
