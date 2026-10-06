// NAGA VIP design tokens.
// Palette derived from the Naga Exchange logo shared by the client:
// black field, metallic gold "N" monogram, white "NAGA / EXCHANGE LTD" wordmark.

export const C = {
  ink: "#08080A",
  ink2: "#0E0E11",
  surface: "#16161A",
  surface2: "#1E1E23",
  surface3: "#27272D",
  line: "rgba(255,255,255,0.08)",
  lineStrong: "rgba(255,255,255,0.14)",
  gold: "#CDA652",
  goldLight: "#EED597",
  goldDeep: "#8C6A27",
  goldSoft: "rgba(205,166,82,0.14)",
  ivory: "#F7F2E8",
  white: "#FFFFFF",
  text: "#F4F2EE",
  muted: "#A3A1AA",
  muted2: "#6F6D77",
  green: "#3FCB8E",
  greenSoft: "rgba(63,203,142,0.14)",
  blue: "#78A2FF",
  blueSoft: "rgba(120,162,255,0.14)",
  amber: "#F2B544",
} as const;

export const GOLD_GRADIENT =
  "linear-gradient(135deg, #F3DDA2 0%, #D7B062 38%, #B98D3C 70%, #8C6A27 100%)";

export const GOLD_TEXT_GRADIENT =
  "linear-gradient(180deg, #F6E3AE 0%, #D9B467 55%, #B48937 100%)";

export const RADIUS = { card: 22, button: 16, pill: 999 } as const;

export type ReservationStatus = "NEW" | "PREPARING" | "READY";

export const STATUS_STYLE: Record<
  ReservationStatus,
  { fg: string; bg: string; label: string; labelTr: string }
> = {
  NEW: { fg: C.goldLight, bg: "rgba(205,166,82,0.16)", label: "NEW", labelTr: "Yeni" },
  PREPARING: { fg: C.blue, bg: C.blueSoft, label: "PREPARING", labelTr: "Hazırlanıyor" },
  READY: { fg: C.green, bg: C.greenSoft, label: "READY", labelTr: "Hazır" },
};
