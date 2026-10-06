import React from "react";
import { ArrowDown, Info } from "lucide-react";
import { AppButton, DemoTag, Label, NavBar, ScreenBg } from "../components/ui";
import { RESERVATION } from "../data";
import { DISPLAY } from "../fonts";
import { C } from "../theme";

export const CONFIRM_CTA = { x: 196, y: 640 };

const Row: React.FC<{ label: string; value: React.ReactNode; first?: boolean }> = ({ label, value, first }) => (
  <div
    style={{
      height: 52,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      borderTop: first ? "none" : `1px solid ${C.line}`,
      fontSize: 15,
    }}
  >
    <span style={{ color: C.muted, fontWeight: 500 }}>{label}</span>
    <span style={{ fontWeight: 700 }}>{value}</span>
  </div>
);

export const ConfirmationScreen: React.FC<{ press?: number }> = ({ press = 0 }) => (
  <ScreenBg>
    <NavBar title="Rezervasyon Özeti" step={3} />

    <div
      style={{
        position: "absolute",
        top: 118,
        left: 18,
        right: 18,
        borderRadius: 24,
        padding: "20px 20px 18px",
        background: "linear-gradient(150deg, rgba(205,166,82,0.2), rgba(205,166,82,0.03) 70%)",
        boxShadow: "inset 0 0 0 1px rgba(205,166,82,0.35)",
        boxSizing: "border-box",
        textAlign: "center",
      }}
    >
      <Label>Satıyorsunuz</Label>
      <div style={{ fontFamily: DISPLAY, fontSize: 38, fontWeight: 800, marginTop: 4 }}>
        {RESERVATION.sell.amount} <span style={{ color: C.goldLight }}>GBP</span>
      </div>
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 17,
          margin: "10px auto",
          background: C.surface3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ArrowDown size={18} color={C.goldLight} />
      </div>
      <Label>Tahmini alacağınız</Label>
      <div style={{ fontFamily: DISPLAY, fontSize: 30, fontWeight: 800, color: C.goldLight, marginTop: 4 }}>
        ₺{RESERVATION.receive.amount} <span style={{ color: C.text, fontSize: 20 }}>TRY</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 10 }}>
        <span style={{ fontSize: 13, color: C.muted }}>1 GBP = {RESERVATION.rate} TRY</span>
        <DemoTag />
      </div>
    </div>

    <div
      style={{
        position: "absolute",
        top: 400,
        left: 18,
        right: 18,
        borderRadius: 20,
        padding: "2px 18px",
        background: C.surface,
        boxShadow: `inset 0 0 0 1px ${C.line}`,
      }}
    >
      <Row first label="Şube" value={`${RESERVATION.branch} · ${RESERVATION.branchArea}`} />
      <Row label="Zaman" value={`${RESERVATION.day}, ${RESERVATION.time}`} />
      <Row label="Rezervasyon" value={<span style={{ color: C.goldLight }}>#{RESERVATION.id}</span>} />
    </div>

    <div
      style={{
        position: "absolute",
        top: 568,
        left: 22,
        right: 22,
        display: "flex",
        gap: 9,
        fontSize: 12.5,
        color: C.muted,
        lineHeight: 1.4,
      }}
    >
      <Info size={16} color={C.gold} style={{ flexShrink: 0, marginTop: 1 }} />
      Kur bilgisi tahminidir. Kesin kur ve işlem koşulları şubede onaylanır.
    </div>

    <div style={{ position: "absolute", top: 611, left: 18, right: 18 }}>
      <AppButton label="REZERVASYONU OLUŞTUR" press={press} height={58} fontSize={16} style={{ letterSpacing: "0.04em" }} />
    </div>
  </ScreenBg>
);
