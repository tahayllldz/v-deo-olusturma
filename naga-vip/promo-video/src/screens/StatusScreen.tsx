import React from "react";
import { interpolate } from "remotion";
import { Check } from "lucide-react";
import { AppIcon, NagaVipWordmark } from "../components/Wordmark";
import { NavBar, ScreenBg, StatusBadge } from "../components/ui";
import { RESERVATION } from "../data";
import { DISPLAY } from "../fonts";
import { C, GOLD_GRADIENT } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** iOS-style push notification banner. progress 0 = hidden above, 1 = in place. */
export const ReadyNotification: React.FC<{ progress: number; top?: number }> = ({ progress, top = 58 }) => (
  <div
    style={{
      position: "absolute",
      top,
      left: 10,
      right: 10,
      borderRadius: 24,
      padding: "13px 14px",
      background: "rgba(40,40,46,0.985)",
      backdropFilter: "blur(20px)",
      boxShadow: "0 16px 40px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(255,255,255,0.08)",
      display: "flex",
      gap: 12,
      alignItems: "center",
      zIndex: 55,
      opacity: interpolate(progress, [0, 0.4], [0, 1], clamp),
      translate: `0 ${interpolate(progress, [0, 1], [-130, 0], clamp)}px`,
    }}
  >
    <AppIcon size={42} />
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: C.muted, fontWeight: 600 }}>
        <span>NAGA VIP</span>
        <span>şimdi</span>
      </div>
      <div style={{ fontSize: 15.5, fontWeight: 700, marginTop: 2, color: C.white }}>
        Rezervasyonunuz hazır ✓
      </div>
      <div style={{ fontSize: 13.5, color: "#D9D7DE", marginTop: 1 }}>
        Your reservation is ready · {RESERVATION.branchArea} {RESERVATION.time}
      </div>
    </div>
  </div>
);

const STEPS = [
  { title: "Rezervasyon oluşturuldu", sub: "#" + RESERVATION.id },
  { title: "Naga işleminizi hazırlıyor", sub: "Şube ekibi işlemi hazırlıyor" },
  { title: "İşleminiz hazır", sub: `${RESERVATION.branchArea} şubesinde sizi bekliyor` },
];

/** Reservation status. stage: 0 created, 1 preparing, 2 ready (fractional values animate). */
export const StatusScreen: React.FC<{ stage?: number; notification?: number }> = ({
  stage = 2,
  notification = 0,
}) => {
  const ready = interpolate(stage, [1.5, 2], [0, 1], clamp);
  return (
    <ScreenBg>
      <NavBar title="Rezervasyonum" />

      <div
        style={{
          position: "absolute",
          top: 118,
          left: 18,
          right: 18,
          borderRadius: 24,
          padding: "18px 20px",
          background: `linear-gradient(150deg, rgba(${ready > 0.5 ? "63,203,142" : "205,166,82"},0.18), rgba(255,255,255,0.02) 75%)`,
          boxShadow: `inset 0 0 0 1px ${ready > 0.5 ? "rgba(63,203,142,0.4)" : "rgba(205,166,82,0.35)"}`,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontFamily: DISPLAY, fontSize: 22, fontWeight: 800, color: C.goldLight }}>
            {RESERVATION.id}
          </div>
          <StatusBadge status={ready > 0.5 ? "READY" : "PREPARING"} lang="tr" size={12.5} />
        </div>
        <div style={{ fontSize: 26, fontWeight: 800, marginTop: 14 }}>
          {RESERVATION.sell.amount} GBP <span style={{ color: C.muted, fontWeight: 600 }}>→</span> TRY
        </div>
        <div style={{ fontSize: 14, color: C.muted, marginTop: 6 }}>
          {RESERVATION.branch} · {RESERVATION.branchArea} · Bugün {RESERVATION.time}
        </div>
      </div>

      <div style={{ position: "absolute", top: 300, left: 26, right: 22 }}>
        {STEPS.map((s, i) => {
          const done = interpolate(stage, [i - 0.5, i], [0, 1], clamp);
          const isLast = i === STEPS.length - 1;
          const color = isLast ? C.green : C.gold;
          return (
            <div key={s.title} style={{ display: "flex", gap: 16, height: isLast ? 70 : 92 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 17,
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: done > 0.5 ? (isLast ? C.green : GOLD_GRADIENT) : C.surface2,
                    boxShadow: done > 0.5 ? `0 0 ${18 * done}px ${isLast ? "rgba(63,203,142,0.6)" : "rgba(205,166,82,0.45)"}` : `inset 0 0 0 1.5px ${C.lineStrong}`,
                    scale: String(0.9 + 0.1 * done),
                  }}
                >
                  {done > 0.5 ? <Check size={19} color="#0B0B0B" strokeWidth={3} /> : null}
                </div>
                {isLast ? null : (
                  <div style={{ width: 2, flex: 1, margin: "6px 0", background: C.surface3, position: "relative" }}>
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        width: 2,
                        height: `${interpolate(stage, [i, i + 0.6], [0, 100], clamp)}%`,
                        background: color,
                      }}
                    />
                  </div>
                )}
              </div>
              <div style={{ paddingTop: 5, opacity: 0.45 + 0.55 * done }}>
                <div style={{ fontSize: 17, fontWeight: 700, color: isLast && done > 0.5 ? C.green : C.text }}>{s.title}</div>
                <div style={{ fontSize: 13.5, color: C.muted, marginTop: 3 }}>{s.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          top: 580,
          left: 18,
          right: 18,
          borderRadius: 22,
          padding: "16px 18px",
          background: C.surface,
          boxShadow: `inset 0 0 0 1px ${C.line}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, letterSpacing: "0.06em" }}>ŞUBEDE GÖSTERİN</div>
          <div style={{ fontFamily: DISPLAY, fontSize: 26, fontWeight: 800, letterSpacing: "0.04em", marginTop: 4 }}>
            {RESERVATION.id}
          </div>
        </div>
        <NagaVipWordmark size={15} />
      </div>

      <ReadyNotification progress={notification} />
    </ScreenBg>
  );
};
