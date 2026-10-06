import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { EASE_IN_OUT, EASE_OUT, camera, clamp, life, press, prog, tap } from "../anim";
import { Backdrop } from "../components/Background";
import { Caption, WordReveal } from "../components/Kinetic";
import { PhoneFrame, SCREEN_W, phoneOuterSize } from "../components/PhoneFrame";
import { Sfx } from "../components/Sfx";
import { DemoTag, TapIndicator } from "../components/ui";
import { Check } from "lucide-react";
import { UI } from "../fonts";
import { GoldText } from "../components/Wordmark";
import { RESERVATION, formatThousands } from "../data";
import { useLayout } from "../LayoutContext";
import { BRANCH_CARD, BT_CONTINUE, BranchTimeScreen, slotCenter } from "../screens/BranchTimeScreen";
import { CONFIRM_CTA, ConfirmationScreen } from "../screens/ConfirmationScreen";
import { HOME_CTA, HomeScreen } from "../screens/HomeScreen";
import { SplashScreen } from "../screens/SplashScreen";
import { SuccessScreen } from "../screens/SuccessScreen";
import { TX_CONTINUE, TransactionScreen, keyCenter } from "../screens/TransactionScreen";
import { FLOW } from "../timeline";
import { C } from "../theme";

const BEZEL = 13;
const AMOUNTS = ["1", "10", "100", "1,000", "10,000"];
const KEY_SEQ = ["1", "0", "0", "0", "0"];

const ConfirmedBadge: React.FC<{ p: number; big?: boolean }> = ({ p, big }) => {
  const size = big ? 30 : 26;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: size * 0.45,
        height: size * 2.1,
        padding: `0 ${size * 0.9}px`,
        borderRadius: 999,
        background: "rgba(63,203,142,0.15)",
        boxShadow: "inset 0 0 0 2px rgba(63,203,142,0.55)",
        color: C.green,
        fontFamily: UI,
        fontWeight: 800,
        fontSize: size,
        letterSpacing: "0.12em",
        opacity: p,
        scale: String(0.85 + 0.15 * p),
      }}
    >
      <Check size={size * 1.1} strokeWidth={3} />
      CONFIRMED
    </span>
  );
};

/** Navigation inside the phone: push from the right, or fade-scale for "app open"/"success". */
const ScreenLayer: React.FC<{
  frame: number;
  start: number;
  next?: number;
  mode: "push" | "fade";
  children: React.ReactNode;
}> = ({ frame, start, next, mode, children }) => {
  if (frame < start - 1) return null;
  const enter = prog(frame, start, 16, EASE_OUT);
  const leave = next !== undefined ? prog(frame, next, 16, EASE_OUT) : 0;
  if (next !== undefined && frame > next + 16) return null;
  const style: React.CSSProperties =
    mode === "push"
      ? { translate: `${(1 - enter) * SCREEN_W - leave * SCREEN_W * 0.28}px 0`, filter: `brightness(${1 - leave * 0.45})` }
      : { opacity: enter, scale: String(1.05 - 0.05 * enter), translate: `${-leave * SCREEN_W * 0.28}px 0`, filter: `brightness(${1 - leave * 0.45})` };
  return <AbsoluteFill style={{ ...style, boxShadow: mode === "push" && enter < 1 ? "-20px 0 40px rgba(0,0,0,0.5)" : undefined }}>{children}</AbsoluteFill>;
};

export const CustomerFlow: React.FC = () => {
  const frame = useCurrentFrame();
  const { isPortrait, width, height } = useLayout();
  const F = FLOW;

  // ---- phone placement ---------------------------------------------------
  const outer = phoneOuterSize();
  const base = isPortrait ? 1.36 : 1.06;
  const pw = outer.w * base;
  const ph = outer.h * base;
  const left = isPortrait ? (width - pw) / 2 : 1400 - pw / 2;
  const top = isPortrait ? height - ph - 110 : (height - ph) / 2;

  // camera (origin in screen coordinates; scale > 1 pushes in on that point)
  // push-ins sized so the whole phone (incl. the keypad) stays inside the frame
  const zoom = isPortrait ? 1.1 : 1.12;
  const cam = camera(frame, [
    { f: 0, s: 1, ox: 196, oy: 426 },
    { f: F.txIn + 4, s: 1, ox: 196, oy: 426 },
    { f: F.txIn + 24, s: zoom, ox: 196, oy: 240 },
    { f: F.receive - 6, s: zoom, ox: 196, oy: 240 },
    { f: F.receive + 12, s: zoom, ox: 196, oy: 320 },
    { f: F.tapContinue1 - 14, s: zoom, ox: 196, oy: 320 },
    { f: F.tapContinue1 + 2, s: 1, ox: 196, oy: 426 },
    { f: F.tapBranch + 14, s: 1, ox: 196, oy: 426 },
    { f: F.tapTime - 6, s: isPortrait ? 1.08 : 1.1, ox: 196, oy: 430 },
    { f: F.tapContinue2 - 8, s: isPortrait ? 1.08 : 1.1, ox: 196, oy: 430 },
    { f: F.confirmIn + 6, s: 1, ox: 196, oy: 426 },
    { f: F.successIn, s: 1, ox: 196, oy: 426 },
    { f: 630, s: 1.07, ox: 196, oy: 330 },
  ]);

  const enter = prog(frame, 0, 40, EASE_OUT);
  const float = Math.sin(frame / 38) * 5;

  // ---- screen state -------------------------------------------------------
  const typed = F.keys.filter((k) => frame >= k + 2).length;
  const amount = typed > 0 ? AMOUNTS[typed - 1] : "";
  const activeKeyIdx = F.keys.findIndex((k) => frame >= k - 2 && frame < k + 8);
  const receiveP = prog(frame, F.receive, 34, EASE_IN_OUT);
  const receive = frame < F.receive ? "₺0" : `₺${formatThousands(RESERVATION.receive.value * receiveP)}`;
  const cursorOn = frame >= F.txIn + 10 && frame < F.receive && Math.floor(frame / 15) % 2 === 0;
  const highlightReceive = interpolate(frame, [F.receive, F.receive + 10, F.tapContinue1 - 10, F.tapContinue1], [0, 1, 1, 0.3], clamp);

  const taps: { at: number; x: number; y: number }[] = [
    { at: F.tapCreate, ...HOME_CTA },
    ...F.keys.map((k, i) => ({ at: k, ...keyCenter(KEY_SEQ[i]) })),
    { at: F.tapContinue1, ...TX_CONTINUE },
    { at: F.tapBranch, ...BRANCH_CARD },
    { at: F.tapTime, ...slotCenter(RESERVATION.time) },
    { at: F.tapContinue2, ...BT_CONTINUE },
    { at: F.tapCreateRes, ...CONFIRM_CTA },
  ];

  // ---- captions -------------------------------------------------------------
  const hook1 = life(frame, F.hook1, F.hook2 - 2, 1, 10);
  const hook2 = life(frame, F.hook2, F.txIn, 1, 12);
  const cap3 = life(frame, F.txIn + 6, F.receive);
  const cap4 = life(frame, F.receive, F.branchIn);
  const cap5 = life(frame, F.branchIn + 6, F.confirmIn);
  const cap6a = life(frame, F.confirmIn + 4, F.successIn + 4);
  const cap6b = life(frame, F.successIn + 6, 640);
  const hookSize = isPortrait ? 112 : 128;
  const hookStyle: React.CSSProperties = isPortrait
    ? { position: "absolute", left: 60, right: 60, top: 200, textAlign: "center" }
    : { position: "absolute", left: 150, width: 980, top: 0, bottom: 0, display: "flex", flexDirection: "column", justifyContent: "center" };

  return (
    <AbsoluteFill style={{ backgroundColor: C.ink }}>
      <Backdrop drift={frame / 630} focusX={isPortrait ? 50 : 72} focusY={isPortrait ? 62 : 50} />

      {/* Hook — S1/S2 */}
      {hook1 > 0 ? (
        <div style={{ ...hookStyle, opacity: hook1, fontFamily: "Montserrat, Inter, sans-serif", fontWeight: 800, fontSize: hookSize, lineHeight: 1.04, color: C.white }}>
          <div><WordReveal text="Müşteriniz" start={F.hook1 + 4} /></div>
          <div><WordReveal text="gelmeden..." start={F.hook1 + 26} /></div>
        </div>
      ) : null}
      {hook2 > 0 ? (
        <div style={{ ...hookStyle, opacity: hook2, fontFamily: "Montserrat, Inter, sans-serif", fontWeight: 800, fontSize: hookSize, lineHeight: 1.04, color: C.white }}>
          <div><WordReveal text="...işlemi" start={F.hook2} /></div>
          <div><WordReveal
            text="hazır olsun."
            start={F.hook2 + 14}
            stagger={6}
            wordStyle={(w) => (w === "hazır" ? { color: C.goldLight } : undefined)}
          /></div>
        </div>
      ) : null}

      {/* Step captions — S3..S6 */}
      <Caption visibility={cap3} eyebrow="1 · Döviz ve miktar" sub="Müşteri satacağı tutarı girer.">
        <GoldText>£</GoldText>
        {amount || "0"}
      </Caption>
      <Caption
        visibility={cap4}
        eyebrow="2 · Alacağı tutar"
        sub={
          <span style={{ display: "inline-flex", alignItems: "center", gap: 16, flexWrap: "wrap", justifyContent: isPortrait ? "center" : "flex-start" }}>
            Tahmini · 1 GBP = 64.95 TRY <DemoTag size={isPortrait ? 18 : 16} />
          </span>
        }
      >
        <GoldText>{receive}</GoldText>
      </Caption>
      <Caption visibility={cap5} eyebrow="3 · Şube ve saat" sub="Naga Exchange · İskele şubesi">
        İskele
        <span style={{ color: C.muted2, margin: "0 0.25em" }}>·</span>
        <span style={{ opacity: frame >= F.tapTime + 3 ? 1 : 0.18 }}>
          <GoldText>16:30</GoldText>
        </span>
      </Caption>
      <Caption visibility={cap6a} eyebrow="4 · Rezervasyon" valueSize={104} sub="Özeti kontrol eder, tek dokunuşla onaylar.">
        Tek <GoldText>dokunuş.</GoldText>
      </Caption>
      <Caption
        visibility={cap6b}
        eyebrow="4 · Rezervasyon"
        valueSize={isPortrait ? 84 : 96}
        sub={
          <span style={{ display: "inline-flex", flexDirection: "column", alignItems: isPortrait ? "center" : "flex-start", gap: 22 }}>
            <ConfirmedBadge p={prog(frame, F.confirmed, 14)} big={isPortrait} />
            {isPortrait ? null : <span>#{RESERVATION.id} · Bugün 16:30 · İskele</span>}
          </span>
        }
      >
        Rezervasyon
        <br />
        <GoldText>onaylandı.</GoldText>
      </Caption>

      {/* Phone */}
      <div
        style={{
          position: "absolute",
          left,
          top: top + float,
          width: pw,
          height: ph,
          transformOrigin: `${(BEZEL + cam.ox) * base}px ${(BEZEL + cam.oy) * base}px`,
          scale: String(cam.s),
          opacity: enter,
          translate: `0 ${(1 - enter) * 140}px`,
          transform: `perspective(1600px) rotateX(${(1 - enter) * 16}deg) rotateY(${isPortrait ? 0 : -4 * (1 - prog(frame, F.homeIn, 30))}deg)`,
        }}
      >
        <PhoneFrame scale={base} glow={0.6 + 0.4 * prog(frame, F.successIn, 20)}>
          <ScreenLayer frame={frame} start={0} next={F.homeIn} mode="fade">
            <SplashScreen reveal={prog(frame, 10, 24)} />
          </ScreenLayer>
          <ScreenLayer frame={frame} start={F.homeIn} next={F.txIn} mode="fade">
            <HomeScreen ctaPress={press(frame, F.tapCreate)} />
          </ScreenLayer>
          <ScreenLayer frame={frame} start={F.txIn} next={F.branchIn} mode="push">
            <TransactionScreen
              amount={amount}
              receive={receive}
              receiveOpacity={frame < F.receive ? 0.3 : 1}
              activeKey={activeKeyIdx >= 0 ? KEY_SEQ[activeKeyIdx] : null}
              keyPress={activeKeyIdx >= 0 ? press(frame, F.keys[activeKeyIdx]) : 0}
              cursorOn={cursorOn}
              continuePress={press(frame, F.tapContinue1)}
              highlightReceive={highlightReceive}
            />
          </ScreenLayer>
          <ScreenLayer frame={frame} start={F.branchIn} next={F.confirmIn} mode="push">
            <BranchTimeScreen
              branchSelected={prog(frame, F.tapBranch + 2, 8)}
              selectedTime={frame >= F.tapTime + 3 ? RESERVATION.time : null}
              timePress={press(frame, F.tapTime)}
              continuePress={press(frame, F.tapContinue2)}
              pinPulse={(frame % 40) / 40}
            />
          </ScreenLayer>
          <ScreenLayer frame={frame} start={F.confirmIn} next={F.successIn} mode="push">
            <ConfirmationScreen press={press(frame, F.tapCreateRes)} />
          </ScreenLayer>
          <ScreenLayer frame={frame} start={F.successIn} mode="fade">
            <SuccessScreen progress={prog(frame, F.successIn + 2, 46, EASE_IN_OUT)} />
          </ScreenLayer>
          {taps.map((t) => (
            <TapIndicator key={t.at} x={t.x} y={t.y} progress={tap(frame, t.at)} size={(F.keys as readonly number[]).includes(t.at) ? 48 : 56} />
          ))}
        </PhoneFrame>
      </div>

      {/* Sound design */}
      <Sfx name="whoosh" at={0} volume={0.45} />
      <Sfx name="shimmer" at={F.homeIn - 4} volume={0.35} />
      <Sfx name="click" at={F.tapCreate - 1} volume={0.7} />
      <Sfx name="swipe" at={F.txIn - 2} volume={0.5} />
      {F.keys.map((k) => (
        <Sfx key={k} name="key" at={k - 1} volume={0.6} />
      ))}
      <Sfx name="shimmer" at={F.receive} volume={0.4} />
      <Sfx name="click" at={F.tapContinue1 - 1} volume={0.7} />
      <Sfx name="swipe" at={F.branchIn - 2} volume={0.5} />
      <Sfx name="click" at={F.tapBranch - 1} volume={0.6} />
      <Sfx name="click" at={F.tapTime - 1} volume={0.6} />
      <Sfx name="click" at={F.tapContinue2 - 1} volume={0.7} />
      <Sfx name="swipe" at={F.confirmIn - 2} volume={0.5} />
      <Sfx name="click" at={F.tapCreateRes - 1} volume={0.8} />
      <Sfx name="confirm" at={F.successIn + 2} volume={0.85} />
    </AbsoluteFill>
  );
};
