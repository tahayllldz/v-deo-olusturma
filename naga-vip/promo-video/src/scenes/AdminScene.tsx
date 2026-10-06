import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { EASE_IN_OUT, EASE_OUT, camera, clamp, press, prog } from "../anim";
import { Backdrop } from "../components/Background";
import { DesktopFrame, desktopOuterSize } from "../components/DesktopFrame";
import { Sfx } from "../components/Sfx";
import { Eyebrow } from "../components/ui";
import { GoldText } from "../components/Wordmark";
import { RESERVATION } from "../data";
import { DISPLAY, UI } from "../fonts";
import { useLayout } from "../LayoutContext";
import { ADMIN_TARGETS, AdminDashboard } from "../screens/AdminDashboard";
import { C, STATUS_STYLE, type ReservationStatus } from "../theme";
import { ADMIN } from "../timeline";

const CHROME = 44;

const BigStatus: React.FC<{ status: ReservationStatus; morph: number; size: number }> = ({ status, morph, size }) => {
  const s = STATUS_STYLE[status];
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: size * 0.45,
        height: size * 2.1,
        padding: `0 ${size * 0.95}px`,
        borderRadius: 999,
        background: s.bg,
        boxShadow: `inset 0 0 0 2px ${s.fg}88`,
        color: s.fg,
        fontFamily: UI,
        fontWeight: 800,
        fontSize: size,
        letterSpacing: "0.12em",
        scale: String(1 + 0.08 * Math.sin(Math.PI * morph)),
      }}
    >
      <span style={{ width: size * 0.5, height: size * 0.5, borderRadius: 99, background: s.fg, boxShadow: `0 0 ${size * 0.6}px ${s.fg}` }} />
      {s.label}
    </div>
  );
};

export const AdminScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { isPortrait, width } = useLayout();
  const A = ADMIN;

  const status: ReservationStatus =
    frame >= A.clickReady + 3 ? "READY" : frame >= A.clickPrepare + 3 ? "PREPARING" : "NEW";
  const morph = Math.max(
    interpolate(frame, [A.clickPrepare + 3, A.clickPrepare + 13], [0, 1], clamp) * (frame < A.clickPrepare + 13 ? 1 : 0),
    interpolate(frame, [A.clickReady + 3, A.clickReady + 13], [0, 1], clamp) * (frame < A.clickReady + 13 ? 1 : 0),
  );

  // cursor path in dashboard coordinates
  const cx = interpolate(
    frame,
    [28, A.cursorToRow, A.cursorToRow + 16, A.cursorToPrepare, A.cursorToPrepare + 14, A.cursorToReady, A.cursorToReady + 14],
    [1160, 1160, ADMIN_TARGETS.newRow.x, ADMIN_TARGETS.newRow.x, ADMIN_TARGETS.prepare.x, ADMIN_TARGETS.prepare.x, ADMIN_TARGETS.ready.x],
    { ...clamp, easing: EASE_IN_OUT },
  );
  const cy = interpolate(
    frame,
    [28, A.cursorToRow, A.cursorToRow + 16, A.cursorToPrepare, A.cursorToPrepare + 14, A.cursorToReady, A.cursorToReady + 14],
    [560, 560, ADMIN_TARGETS.newRow.y, ADMIN_TARGETS.newRow.y, ADMIN_TARGETS.prepare.y, ADMIN_TARGETS.prepare.y, ADMIN_TARGETS.ready.y],
    { ...clamp, easing: EASE_IN_OUT },
  );
  const click = (at: number) => interpolate(frame, [at, at + 12], [0, 1], clamp);
  const clickNow = [A.clickRow, A.clickPrepare, A.clickReady].map(click).find((c) => c > 0 && c < 1) ?? 0;

  // desktop placement + camera (origin in frame-content coordinates incl. browser chrome)
  const outer = desktopOuterSize();
  const base = isPortrait ? 0.72 : 0.8;
  const dw = outer.w * base;
  const dh = outer.h * base;
  const left = (width - dw) / 2;
  const top = isPortrait ? 860 : 250;
  // Portrait: push in so list + detail panel exactly fill the width (only the
  // sidebar leaves the frame). Landscape: the zoomed window still fits 1920 px.
  const z = 1.2;
  const ox = isPortrait ? 1414 : 1040;
  const cam = camera(frame, [
    { f: 0, s: 1, ox: 720, oy: 472 },
    { f: A.cursorToRow, s: 1, ox: isPortrait ? ox : 720, oy: 472 },
    { f: A.clickRow, s: z, ox: isPortrait ? ox : 700, oy: CHROME + ADMIN_TARGETS.newRow.y },
    { f: A.cursorToPrepare + 4, s: z, ox, oy: CHROME + 600 },
    { f: A.clickReady + 10, s: z, ox, oy: CHROME + 620 },
    { f: 150, s: z * 0.97, ox, oy: CHROME + 620 },
  ]);
  const enter = prog(frame, 0, 26, EASE_OUT);

  const cap = prog(frame, 4, 16);
  const headSize = isPortrait ? 84 : 66;

  return (
    <AbsoluteFill style={{ backgroundColor: C.ink }}>
      <Backdrop drift={0.3 + frame / 300} focusX={50} focusY={isPortrait ? 62 : 70} />

      {/* dashboard */}
      <div
        style={{
          position: "absolute",
          left,
          top,
          width: dw,
          height: dh,
          opacity: enter,
          transformOrigin: `${cam.ox * base}px ${cam.oy * base}px`,
          scale: String(cam.s),
          translate: `0 ${(1 - enter) * 120}px`,
          transform: `perspective(2200px) rotateX(${(1 - enter) * 14}deg)`,
        }}
      >
        <DesktopFrame scale={base}>
          <AdminDashboard
            statuses={{ [RESERVATION.id]: status }}
            newRowIn={prog(frame, A.toast + 2, 14)}
            selected={RESERVATION.id}
            detailIn={prog(frame, A.clickRow + 2, 12)}
            press={{ prepare: press(frame, A.clickPrepare), ready: press(frame, A.clickReady) }}
            cursor={{ x: cx, y: cy, opacity: interpolate(frame, [26, 34, 140, 150], [0, 1, 1, 0], clamp), click: clickNow }}
            toast={interpolate(frame, [A.toast, A.toast + 70], [0, 1], clamp)}
          />
        </DesktopFrame>
      </div>

      {/* scrim keeps the caption readable when the camera pushes in */}
      <AbsoluteFill
        style={{
          background: isPortrait
            ? "linear-gradient(180deg, rgba(8,8,10,1) 0%, rgba(8,8,10,0.92) 36%, rgba(8,8,10,0) 46%)"
            : "linear-gradient(180deg, rgba(8,8,10,1) 0%, rgba(8,8,10,0.9) 17%, rgba(8,8,10,0) 27%)",
        }}
      />

      {/* caption */}
      <div
        style={{
          position: "absolute",
          ...(isPortrait
            ? { left: 70, right: 70, top: 170, alignItems: "center", textAlign: "center" }
            : { left: 150, right: 150, top: 64, flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" }),
          display: "flex",
          flexDirection: isPortrait ? "column" : "row",
          opacity: cap,
          translate: `0 ${(1 - cap) * 20}px`,
        }}
      >
        <div>
          <Eyebrow size={isPortrait ? 30 : 24}>Naga tarafında</Eyebrow>
          <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: headSize, lineHeight: 1.06, marginTop: 16, color: C.white }}>
            Müşteri gelmeden,
            {isPortrait ? <br /> : " "}
            <GoldText>siz hazırlayın.</GoldText>
          </div>
        </div>
        <div style={{ marginTop: isPortrait ? 44 : 0, display: "flex", flexDirection: "column", alignItems: isPortrait ? "center" : "flex-end", gap: 12 }}>
          <BigStatus status={status} morph={morph} size={isPortrait ? 34 : 26} />
          <div style={{ fontFamily: UI, fontSize: isPortrait ? 30 : 24, color: C.muted, fontWeight: 600 }}>
            £{RESERVATION.sell.amount} · {RESERVATION.time} · İskele
          </div>
        </div>
      </div>

      <Sfx name="notify" at={A.toast} volume={0.75} />
      <Sfx name="click" at={A.clickRow - 1} volume={0.6} />
      <Sfx name="click" at={A.clickPrepare - 1} volume={0.6} />
      <Sfx name="click" at={A.clickReady - 1} volume={0.6} />
      <Sfx name="ready" at={A.clickReady + 3} volume={0.7} />
    </AbsoluteFill>
  );
};
