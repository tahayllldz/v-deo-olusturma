import React from "react";
import { Bell, CalendarCheck2, House, Plus, User } from "lucide-react";
import { NagaVipWordmark } from "../components/Wordmark";
import { AppButton, CurrencyBadge, DemoTag, ScreenBg } from "../components/ui";
import { CUSTOMER_NAME, DEMO_RATES } from "../data";
import { DISPLAY } from "../fonts";
import { C } from "../theme";

export const HOME_CTA = { x: 196, y: 646 };

export const HomeScreen: React.FC<{ ctaPress?: number }> = ({ ctaPress = 0 }) => (
  <ScreenBg>
    {/* header */}
    <div
      style={{
        position: "absolute",
        top: 62,
        left: 22,
        right: 22,
        height: 44,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <NagaVipWordmark size={20} />
      <div style={{ display: "flex", gap: 10 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            background: C.surface2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Bell size={19} color={C.text} />
        </div>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            background: "linear-gradient(135deg,#3a3326,#1d1a14)",
            boxShadow: "inset 0 0 0 1.5px rgba(205,166,82,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: C.goldLight,
            fontWeight: 700,
            fontSize: 16,
          }}
        >
          A
        </div>
      </div>
    </div>

    {/* greeting */}
    <div style={{ position: "absolute", top: 124, left: 22 }}>
      <div style={{ fontSize: 16, color: C.muted, fontWeight: 500 }}>Hoş geldiniz,</div>
      <div style={{ fontFamily: DISPLAY, fontSize: 30, fontWeight: 700, marginTop: 2 }}>
        {CUSTOMER_NAME}
      </div>
    </div>

    {/* concept card */}
    <div
      style={{
        position: "absolute",
        top: 210,
        left: 22,
        right: 22,
        height: 88,
        borderRadius: 22,
        padding: "0 18px",
        display: "flex",
        alignItems: "center",
        gap: 14,
        background: "linear-gradient(120deg, rgba(205,166,82,0.22), rgba(205,166,82,0.05))",
        boxShadow: "inset 0 0 0 1px rgba(205,166,82,0.35)",
      }}
    >
      <div
        style={{
          width: 46,
          height: 46,
          borderRadius: 14,
          background: "rgba(0,0,0,0.35)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CalendarCheck2 size={24} color={C.goldLight} />
      </div>
      <div style={{ fontSize: 15, lineHeight: 1.35, fontWeight: 600 }}>
        İşleminizi şubeye gelmeden
        <br />
        <span style={{ color: C.goldLight }}>önceden hazırlatın.</span>
      </div>
    </div>

    {/* rates */}
    <div
      style={{
        position: "absolute",
        top: 320,
        left: 22,
        right: 22,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div style={{ fontSize: 18, fontWeight: 700 }}>Güncel Kurlar</div>
      <DemoTag />
    </div>
    <div
      style={{
        position: "absolute",
        top: 356,
        left: 22,
        right: 22,
        borderRadius: 22,
        background: C.surface,
        boxShadow: `inset 0 0 0 1px ${C.line}`,
        overflow: "hidden",
      }}
    >
      {DEMO_RATES.map((r, i) => (
        <div
          key={r.code}
          style={{
            height: 58,
            padding: "0 16px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            borderTop: i === 0 ? "none" : `1px solid ${C.line}`,
          }}
        >
          <CurrencyBadge symbol={r.symbol} size={36} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{r.code}</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 1 }}>{r.name}</div>
          </div>
          <div style={{ fontSize: 19, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{r.rate}</div>
        </div>
      ))}
    </div>

    {/* actions */}
    <div style={{ position: "absolute", top: 618, left: 22, right: 22, display: "flex", flexDirection: "column", gap: 12 }}>
      <AppButton label="İşlem Oluştur" press={ctaPress} icon={<Plus size={20} strokeWidth={2.6} />} />
      <AppButton label="Rezervasyonlarım" variant="outline" />
    </div>

    {/* tab bar */}
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 84,
        borderTop: `1px solid ${C.line}`,
        background: "rgba(14,14,17,0.92)",
        display: "flex",
        justifyContent: "space-around",
        paddingTop: 10,
        boxSizing: "border-box",
      }}
    >
      {[
        { icon: House, label: "Ana Sayfa", active: true },
        { icon: CalendarCheck2, label: "Rezervasyonlar", active: false },
        { icon: User, label: "Profil", active: false },
      ].map(({ icon: Icon, label, active }) => (
        <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <Icon size={22} color={active ? C.gold : C.muted2} />
          <div style={{ fontSize: 11, fontWeight: 600, color: active ? C.gold : C.muted2 }}>{label}</div>
        </div>
      ))}
    </div>
  </ScreenBg>
);
