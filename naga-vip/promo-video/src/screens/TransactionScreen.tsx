import React from "react";
import { ArrowDownUp, ChevronDown, Delete } from "lucide-react";
import { AppButton, CurrencyBadge, DemoTag, Label, NavBar, ScreenBg } from "../components/ui";
import { RESERVATION } from "../data";
import { C } from "../theme";

export const TX_CONTINUE = { x: 196, y: 479 };
const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "⌫"];
const KEYPAD_TOP = 528;
const KEY_H = 62;
const KEY_GAP = 7;

/** Center of a keypad key in screen coordinates (for tap indicators). */
export const keyCenter = (key: string) => {
  const i = KEYS.indexOf(key);
  const col = i % 3;
  const row = Math.floor(i / 3);
  const w = (393 - 16 - KEY_GAP * 2) / 3;
  return { x: 8 + col * (w + KEY_GAP) + w / 2, y: KEYPAD_TOP + 8 + row * (KEY_H + KEY_GAP) + KEY_H / 2 };
};

const CurrencyPill: React.FC<{ symbol: string; code: string }> = ({ symbol, code }) => (
  <div
    style={{
      height: 40,
      padding: "0 10px 0 5px",
      borderRadius: 20,
      background: C.surface3,
      display: "flex",
      alignItems: "center",
      gap: 8,
      fontWeight: 700,
      fontSize: 16,
    }}
  >
    <CurrencyBadge symbol={symbol} size={30} gold />
    {code}
    <ChevronDown size={16} color={C.muted} />
  </div>
);

export const TransactionScreen: React.FC<{
  amount?: string;
  receive?: string;
  receiveOpacity?: number;
  activeKey?: string | null;
  keyPress?: number;
  cursorOn?: boolean;
  continuePress?: number;
  showKeypad?: boolean;
  highlightReceive?: number;
}> = ({
  amount = RESERVATION.sell.amount,
  receive = `₺${RESERVATION.receive.amount}`,
  receiveOpacity = 1,
  activeKey = null,
  keyPress = 0,
  cursorOn = false,
  continuePress = 0,
  showKeypad = true,
  highlightReceive = 0,
}) => (
  <ScreenBg>
    <NavBar title="İşlem Oluştur" step={1} />

    {/* sell card */}
    <div
      style={{
        position: "absolute",
        top: 118,
        left: 18,
        right: 18,
        height: 122,
        borderRadius: 22,
        background: C.surface,
        boxShadow: `inset 0 0 0 1.5px ${cursorOn ? "rgba(205,166,82,0.55)" : C.line}`,
        padding: "16px 18px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Label>Satacağınız</Label>
        <CurrencyPill symbol="£" code="GBP" />
      </div>
      <div style={{ display: "flex", alignItems: "center", marginTop: 4, height: 54 }}>
        <div
          style={{
            fontSize: 46,
            fontWeight: 800,
            letterSpacing: "-0.01em",
            fontVariantNumeric: "tabular-nums",
            color: amount ? C.text : C.muted2,
          }}
        >
          {amount || "0"}
        </div>
        {cursorOn ? (
          <div style={{ width: 3, height: 42, marginLeft: 4, borderRadius: 2, background: C.gold }} />
        ) : null}
      </div>
    </div>

    {/* swap */}
    <div
      style={{
        position: "absolute",
        top: 228,
        left: 196 - 21,
        width: 42,
        height: 42,
        borderRadius: 21,
        background: C.surface3,
        boxShadow: `0 0 0 5px ${C.ink}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2,
      }}
    >
      <ArrowDownUp size={19} color={C.goldLight} />
    </div>

    {/* receive card */}
    <div
      style={{
        position: "absolute",
        top: 258,
        left: 18,
        right: 18,
        height: 122,
        borderRadius: 22,
        background: `linear-gradient(120deg, rgba(205,166,82,${0.1 + highlightReceive * 0.12}), rgba(205,166,82,0.02))`,
        boxShadow: `inset 0 0 0 1.5px rgba(205,166,82,${0.22 + highlightReceive * 0.4})`,
        padding: "16px 18px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Label>Alacağınız (tahmini)</Label>
        <CurrencyPill symbol="₺" code="TRY" />
      </div>
      <div
        style={{
          fontSize: 42,
          fontWeight: 800,
          marginTop: 6,
          color: C.goldLight,
          fontVariantNumeric: "tabular-nums",
          opacity: receiveOpacity,
        }}
      >
        {receive}
      </div>
    </div>

    {/* rate line */}
    <div
      style={{
        position: "absolute",
        top: 394,
        left: 22,
        right: 22,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div style={{ fontSize: 14, fontWeight: 600 }}>
        1 GBP = <span style={{ color: C.goldLight }}>{RESERVATION.rate}</span> TRY
      </div>
      <DemoTag />
    </div>
    <div style={{ position: "absolute", top: 420, left: 22, right: 22, fontSize: 12, color: C.muted, lineHeight: 1.4 }}>
      Tahmini tutardır. Kesin kur, işlem sırasında şubede onaylanır.
    </div>

    <div style={{ position: "absolute", top: 452, left: 18, right: 18 }}>
      <AppButton label="Devam Et" press={continuePress} height={54} />
    </div>

    {/* keypad */}
    {showKeypad ? (
      <div
        style={{
          position: "absolute",
          top: KEYPAD_TOP,
          left: 0,
          right: 0,
          bottom: 0,
          background: "#141418",
          borderTop: `1px solid ${C.line}`,
          padding: 8,
          boxSizing: "border-box",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gridAutoRows: KEY_H,
          gap: KEY_GAP,
        }}
      >
        {KEYS.map((k) => {
          const active = k === activeKey ? keyPress : 0;
          const isAction = k === "." || k === "⌫";
          return (
            <div
              key={k}
              style={{
                borderRadius: 12,
                background: active > 0 ? `rgba(205,166,82,${0.18 + 0.3 * active})` : isAction ? "transparent" : C.surface2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 26,
                fontWeight: 500,
                color: C.text,
              }}
            >
              {k === "⌫" ? <Delete size={24} color={C.text} /> : k}
            </div>
          );
        })}
      </div>
    ) : null}
  </ScreenBg>
);
