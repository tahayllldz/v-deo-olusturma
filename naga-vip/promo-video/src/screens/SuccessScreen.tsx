import React from "react";
import { interpolate } from "remotion";
import { Clock3, MapPin } from "lucide-react";
import { AppButton, ScreenBg, StatusBadge } from "../components/ui";
import { RESERVATION } from "../data";
import { DISPLAY } from "../fonts";
import { C, GOLD_GRADIENT } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** progress 0..1 drives the check-mark reveal; 1 = final state. */
export const SuccessScreen: React.FC<{ progress?: number }> = ({ progress = 1 }) => {
  const circle = interpolate(progress, [0, 0.35], [0, 1], clamp);
  const check = interpolate(progress, [0.25, 0.55], [0, 1], clamp);
  const text = interpolate(progress, [0.4, 0.75], [0, 1], clamp);
  const card = interpolate(progress, [0.55, 1], [0, 1], clamp);
  return (
    <ScreenBg
      style={{
        background:
          "radial-gradient(90% 50% at 50% 18%, rgba(205,166,82,0.26) 0%, rgba(205,166,82,0) 65%), #0A0A0C",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 112,
          left: 196 - 58,
          width: 116,
          height: 116,
          borderRadius: 58,
          background: GOLD_GRADIENT,
          boxShadow: `0 0 0 ${14 * circle}px rgba(205,166,82,0.14), 0 18px 50px rgba(205,166,82,0.35)`,
          scale: String(0.4 + 0.6 * circle),
          opacity: circle,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="58" height="58" viewBox="0 0 58 58">
          <path
            d="M14 30 L25 41 L45 18"
            fill="none"
            stroke="#17120A"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="50"
            strokeDashoffset={50 * (1 - check)}
          />
        </svg>
      </div>

      <div
        style={{
          position: "absolute",
          top: 262,
          left: 24,
          right: 24,
          textAlign: "center",
          opacity: text,
          translate: `0 ${(1 - text) * 14}px`,
        }}
      >
        <div style={{ fontFamily: DISPLAY, fontSize: 25, fontWeight: 800, lineHeight: 1.2 }}>
          Rezervasyonunuz
          <br />
          oluşturuldu.
        </div>
        <div style={{ fontSize: 16, color: C.muted, marginTop: 12, lineHeight: 1.45 }}>
          Naga işleminizi
          <br />
          sizin için <span style={{ color: C.goldLight, fontWeight: 600 }}>hazırlıyor.</span>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 440,
          left: 22,
          right: 22,
          borderRadius: 24,
          background: C.surface,
          boxShadow: `inset 0 0 0 1px ${C.lineStrong}`,
          opacity: card,
          translate: `0 ${(1 - card) * 24}px`,
        }}
      >
        <div style={{ padding: "18px 20px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, letterSpacing: "0.06em" }}>REZERVASYON NO</div>
            <div style={{ fontFamily: DISPLAY, fontSize: 30, fontWeight: 800, color: C.goldLight, marginTop: 4, letterSpacing: "0.03em" }}>
              {RESERVATION.id}
            </div>
          </div>
          <StatusBadge status="PREPARING" lang="tr" size={12} />
        </div>
        {/* perforation */}
        <div style={{ position: "relative", height: 2 }}>
          <div style={{ position: "absolute", left: 18, right: 18, top: 0, borderTop: `2px dashed ${C.lineStrong}` }} />
          <div style={{ position: "absolute", left: -12, top: -11, width: 24, height: 24, borderRadius: 12, background: "#0A0A0C" }} />
          <div style={{ position: "absolute", right: -12, top: -11, width: 24, height: 24, borderRadius: 12, background: "#0A0A0C" }} />
        </div>
        <div style={{ display: "flex", padding: "16px 20px 18px" }}>
          {[
            { icon: Clock3, label: "Saat", value: RESERVATION.time },
            { icon: MapPin, label: "Şube", value: RESERVATION.branchArea },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} style={{ flex: 1, display: "flex", gap: 10, alignItems: "center" }}>
              <Icon size={22} color={C.gold} />
              <div>
                <div style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>{label}</div>
                <div style={{ fontSize: 22, fontWeight: 800, marginTop: 1 }}>{value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: "absolute", top: 690, left: 22, right: 22, opacity: card }}>
        <AppButton label="Rezervasyonu Gör" variant="outline" />
      </div>
    </ScreenBg>
  );
};
