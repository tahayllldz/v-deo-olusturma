import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Clock3, MapPin } from "lucide-react";
import { EASE_IN_OUT, EASE_OUT, prog } from "../anim";
import { Backdrop } from "../components/Background";
import { Caption } from "../components/Kinetic";
import { PhoneFrame, phoneOuterSize } from "../components/PhoneFrame";
import { Sfx } from "../components/Sfx";
import { GoldText } from "../components/Wordmark";
import { UI } from "../fonts";
import { useLayout } from "../LayoutContext";
import { StatusScreen } from "../screens/StatusScreen";
import { C } from "../theme";
import { ARRIVAL } from "../timeline";

export const ArrivalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { isPortrait, width, height, fontScale } = useLayout();

  const outer = phoneOuterSize();
  const base = isPortrait ? 1.36 : 1.06;
  const pw = outer.w * base;
  const ph = outer.h * base;
  const left = isPortrait ? (width - pw) / 2 : 1400 - pw / 2;
  const top = isPortrait ? height - ph - 110 : (height - ph) / 2;
  const enter = prog(frame, 0, 22, EASE_OUT);
  const push = 1 + 0.05 * prog(frame, ARRIVAL.notification, 60, EASE_IN_OUT);

  return (
    <AbsoluteFill style={{ backgroundColor: C.ink }}>
      <Backdrop drift={0.6 + frame / 240} focusX={isPortrait ? 50 : 72} focusY={isPortrait ? 62 : 48} />

      <Caption
        visibility={prog(frame, 4, 16)}
        valueSize={isPortrait ? 84 : 96}
        sub="Rezervasyon koduyla işlem hızlıca tamamlanır."
      >
        <div
          style={{
            display: "flex",
            gap: 26,
            justifyContent: isPortrait ? "center" : "flex-start",
            fontFamily: UI,
            fontSize: 30 * fontScale,
            fontWeight: 700,
            color: C.goldLight,
            letterSpacing: "0.04em",
            marginBottom: 26,
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
            <Clock3 size={32 * fontScale} /> 16:30
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
            <MapPin size={32 * fontScale} /> Naga Exchange · İskele
          </span>
        </div>
        Müşteri geldiğinde,
        <br />
        işlemi <GoldText>hazır.</GoldText>
      </Caption>

      <div
        style={{
          position: "absolute",
          left,
          top,
          width: pw,
          height: ph,
          opacity: enter,
          translate: `${(1 - enter) * (isPortrait ? 0 : 120)}px ${(1 - enter) * (isPortrait ? 120 : 0)}px`,
          scale: String(push),
          transformOrigin: "50% 20%",
        }}
      >
        <PhoneFrame scale={base} statusTime="16:24" glow={0.8}>
          <StatusScreen stage={1 + prog(frame, ARRIVAL.ready, 14)} notification={prog(frame, ARRIVAL.notification, 16, EASE_OUT)} />
        </PhoneFrame>
      </div>

      <Sfx name="notify" at={ARRIVAL.notification} volume={0.8} />
    </AbsoluteFill>
  );
};
