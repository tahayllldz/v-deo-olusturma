import React from "react";
import { CalendarDays, Check, Clock3, MapPin, Sparkles } from "lucide-react";
import { AppButton, DemoTag, Label, NavBar, ScreenBg } from "../components/ui";
import { RESERVATION, TIME_SLOTS } from "../data";
import { C, GOLD_GRADIENT } from "../theme";

export const BRANCH_CARD = { x: 196, y: 215 };
export const BT_CONTINUE = { x: 196, y: 644 };
const GRID_TOP = 392;
const SLOT_H = 52;
const SLOT_GAP = 10;

export const slotCenter = (time: string) => {
  const i = TIME_SLOTS.indexOf(time as (typeof TIME_SLOTS)[number]);
  const col = i % 3;
  const row = Math.floor(i / 3);
  const w = (393 - 36 - SLOT_GAP * 2) / 3;
  return { x: 18 + col * (w + SLOT_GAP) + w / 2, y: GRID_TOP + row * (SLOT_H + SLOT_GAP) + SLOT_H / 2 };
};

/** Abstract map tile (not a real map): coast to the east, gold pin in the middle. */
export const MiniMap: React.FC<{ width: number; height: number; pinPulse?: number }> = ({
  width,
  height,
  pinPulse = 0,
}) => (
  <svg width={width} height={height} viewBox="0 0 360 150" preserveAspectRatio="xMidYMid slice">
    <rect width="360" height="150" fill="#16161A" />
    <path d="M270 0 C 250 40, 290 70, 262 110 C 248 130, 262 150, 262 150 L360 150 L360 0 Z" fill="#11161D" />
    <path d="M270 0 C 250 40, 290 70, 262 110 C 248 130, 262 150, 262 150" stroke="#2A2F38" strokeWidth="2" fill="none" />
    {[
      "M0 40 L240 52",
      "M0 104 L250 92",
      "M60 0 L84 150",
      "M150 0 L170 150",
      "M210 0 L230 150",
      "M0 74 L120 70 L250 76",
    ].map((d) => (
      <path key={d} d={d} stroke="#26262D" strokeWidth="7" fill="none" strokeLinecap="round" />
    ))}
    <path d="M0 74 L120 70 L250 76" stroke="rgba(205,166,82,0.45)" strokeWidth="2.5" fill="none" />
    <circle cx="164" cy="72" r={14 + pinPulse * 16} fill={`rgba(205,166,82,${0.25 * (1 - pinPulse)})`} />
    <circle cx="164" cy="72" r="9" fill="#CDA652" stroke="#0A0A0C" strokeWidth="3" />
  </svg>
);

export const BranchTimeScreen: React.FC<{
  branchSelected?: number;
  selectedTime?: string | null;
  timePress?: number;
  continuePress?: number;
  pinPulse?: number;
}> = ({ branchSelected = 1, selectedTime = RESERVATION.time, timePress = 0, continuePress = 0, pinPulse = 0 }) => (
  <ScreenBg>
    <NavBar title="Teslim Noktası" step={2} />

    <Label style={{ position: "absolute", top: 116, left: 22 }}>Şube</Label>
    <div
      style={{
        position: "absolute",
        top: 138,
        left: 18,
        right: 18,
        height: 154,
        borderRadius: 22,
        overflow: "hidden",
        background: C.surface,
        boxShadow: `inset 0 0 0 ${1 + branchSelected}px rgba(205,166,82,${0.15 + 0.6 * branchSelected})`,
      }}
    >
      <MiniMap width={357} height={98} pinPulse={pinPulse} />
      <div style={{ height: 56, display: "flex", alignItems: "center", padding: "0 14px", gap: 10 }}>
        <MapPin size={20} color={C.gold} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700 }}>{RESERVATION.branch}</div>
          <div style={{ fontSize: 13, color: C.muted, marginTop: 1 }}>{RESERVATION.branchArea}</div>
        </div>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 14,
            background: branchSelected > 0.5 ? GOLD_GRADIENT : "transparent",
            boxShadow: branchSelected > 0.5 ? "none" : `inset 0 0 0 1.5px ${C.lineStrong}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            scale: String(0.85 + 0.15 * branchSelected),
          }}
        >
          {branchSelected > 0.5 ? <Check size={17} color="#17120A" strokeWidth={3} /> : null}
        </div>
      </div>
    </div>

    <Label style={{ position: "absolute", top: 308, left: 22 }}>Gelmek istediğiniz zaman</Label>
    <div style={{ position: "absolute", top: 332, left: 18, right: 18, display: "flex", gap: 8 }}>
      {["Bugün", "Yarın"].map((d, i) => (
        <div
          key={d}
          style={{
            height: 40,
            padding: "0 18px",
            borderRadius: 20,
            display: "flex",
            alignItems: "center",
            fontSize: 15,
            fontWeight: 700,
            background: i === 0 ? "rgba(205,166,82,0.16)" : C.surface2,
            color: i === 0 ? C.goldLight : C.muted,
            boxShadow: i === 0 ? "inset 0 0 0 1.5px rgba(205,166,82,0.6)" : "none",
          }}
        >
          {d}
        </div>
      ))}
      <div
        style={{
          height: 40,
          padding: "0 14px",
          borderRadius: 20,
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: 15,
          fontWeight: 600,
          background: C.surface2,
          color: C.muted,
        }}
      >
        <CalendarDays size={16} /> Tarih seç
      </div>
    </div>

    <div
      style={{
        position: "absolute",
        top: GRID_TOP,
        left: 18,
        right: 18,
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gridAutoRows: SLOT_H,
        gap: SLOT_GAP,
      }}
    >
      {TIME_SLOTS.map((t) => {
        const sel = t === selectedTime;
        return (
          <div
            key={t}
            style={{
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              fontWeight: 700,
              fontVariantNumeric: "tabular-nums",
              background: sel ? GOLD_GRADIENT : C.surface,
              color: sel ? "#17120A" : C.text,
              boxShadow: sel ? "0 8px 22px rgba(205,166,82,0.3)" : `inset 0 0 0 1px ${C.line}`,
              scale: sel ? String(1 - 0.05 * timePress) : "1",
            }}
          >
            {t}
          </div>
        );
      })}
    </div>
    <div style={{ position: "absolute", top: 520, left: 22, right: 22, display: "flex", alignItems: "center", gap: 8 }}>
      <DemoTag label="DEMO" />
      <div style={{ fontSize: 12, color: C.muted }}>Örnek saat aralıkları</div>
    </div>

    <div
      style={{
        position: "absolute",
        top: 552,
        left: 18,
        right: 18,
        height: 52,
        borderRadius: 16,
        background: C.surface,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "0 14px",
        fontSize: 15,
        fontWeight: 600,
        opacity: selectedTime ? 1 : 0.35,
      }}
    >
      <Clock3 size={19} color={C.gold} />
      {selectedTime ? `Bugün, ${selectedTime} · ${RESERVATION.branchArea}` : "Saat seçin"}
    </div>

    <div style={{ position: "absolute", top: 617, left: 18, right: 18 }}>
      <AppButton label="Devam Et" press={continuePress} height={54} />
    </div>

    <div
      style={{
        position: "absolute",
        top: 700,
        left: 22,
        right: 22,
        display: "flex",
        gap: 10,
        alignItems: "flex-start",
        fontSize: 13,
        color: C.muted,
        lineHeight: 1.45,
      }}
    >
      <Sparkles size={18} color={C.gold} style={{ flexShrink: 0, marginTop: 1 }} />
      Rezervasyonunuz şubeye iletilir. Naga ekibi işleminizi siz gelmeden hazırlar.
    </div>
  </ScreenBg>
);
