import React from "react";
import { interpolate } from "remotion";
import {
  Bell,
  CalendarClock,
  ListChecks,
  MapPin,
  MessageCircle,
  PackageCheck,
  Settings,
  Timer,
  TrendingUp,
  Users,
} from "lucide-react";
import { NagaExchangeWordmark } from "../components/Wordmark";
import { DemoTag, StatusBadge } from "../components/ui";
import { ADMIN_ROWS, RESERVATION } from "../data";
import { DISPLAY, UI } from "../fonts";
import { C, GOLD_GRADIENT, STATUS_STYLE, type ReservationStatus } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const LIST_X = 264;
const LIST_Y = 220;
const LIST_W = 700;
const HEADER_H = 48;
const ROW_H = 84;
const DETAIL_X = 984;
const DETAIL_W = 424;

export const ADMIN_TARGETS = {
  newRow: { x: LIST_X + 330, y: LIST_Y + HEADER_H + 2 * ROW_H + ROW_H / 2 },
  prepare: { x: DETAIL_X + DETAIL_W / 2, y: 698 },
  contact: { x: DETAIL_X + DETAIL_W / 2, y: 762 },
  ready: { x: DETAIL_X + DETAIL_W / 2, y: 826 },
};

export type AdminProps = {
  statuses?: Partial<Record<string, ReservationStatus>>;
  newRowIn?: number;
  selected?: string | null;
  detailIn?: number;
  press?: { prepare?: number; contact?: number; ready?: number };
  cursor?: { x: number; y: number; opacity: number; click?: number } | null;
  toast?: number;
};

const NAV = [
  { icon: CalendarClock, label: "Today", active: true },
  { icon: ListChecks, label: "Reservations" },
  { icon: Users, label: "Customers" },
  { icon: TrendingUp, label: "Rates", demo: true },
  { icon: Settings, label: "Settings" },
];

const Cursor: React.FC<{ x: number; y: number; opacity: number; click?: number }> = ({ x, y, opacity, click = 0 }) => (
  <div style={{ position: "absolute", left: x, top: y, opacity, zIndex: 100, pointerEvents: "none" }}>
    {click > 0 && click < 1 ? (
      <div
        style={{
          position: "absolute",
          left: -22,
          top: -22,
          width: 44,
          height: 44,
          borderRadius: 22,
          border: "2.5px solid rgba(238,213,151,0.9)",
          opacity: 1 - click,
          scale: String(0.4 + click),
        }}
      />
    ) : null}
    <svg width="30" height="36" viewBox="0 0 30 36" style={{ position: "absolute", left: -3, top: -2, scale: String(1 - 0.12 * Math.sin(Math.PI * Math.min(1, click * 2))) }}>
      <path d="M3 2 L3 28 L10 21.5 L15 33 L20 30.8 L15 19.6 L24.5 19.6 Z" fill="#fff" stroke="#111" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  </div>
);

const Field: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div style={{ padding: "11px 0", borderTop: `1px solid ${C.line}` }}>
    <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</div>
    <div style={{ fontSize: 19, fontWeight: 700, marginTop: 3 }}>{value}</div>
  </div>
);

const AdminButton: React.FC<{
  label: string;
  kind: "gold" | "outline" | "green";
  press?: number;
  icon: React.ReactNode;
  top: number;
}> = ({ label, kind, press = 0, icon, top }) => (
  <div
    style={{
      position: "absolute",
      left: 24,
      right: 24,
      top,
      height: 52,
      borderRadius: 14,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      fontSize: 15,
      fontWeight: 800,
      letterSpacing: "0.06em",
      scale: String(1 - 0.04 * press),
      filter: `brightness(${1 + 0.15 * press})`,
      ...(kind === "gold"
        ? { background: GOLD_GRADIENT, color: "#17120A" }
        : kind === "green"
          ? { background: "rgba(63,203,142,0.16)", color: C.green, boxShadow: "inset 0 0 0 1.5px rgba(63,203,142,0.6)" }
          : { background: "transparent", color: C.text, boxShadow: `inset 0 0 0 1.5px ${C.lineStrong}` }),
    }}
  >
    {icon}
    {label}
  </div>
);

export const AdminDashboard: React.FC<AdminProps> = ({
  statuses = {},
  newRowIn = 1,
  selected = RESERVATION.id,
  detailIn = 1,
  press = {},
  cursor = null,
  toast = 0,
}) => {
  const rows = ADMIN_ROWS.map((r) => ({ ...r, status: statuses[r.id] ?? r.status }));
  const visible = rows.filter((r) => r.id !== RESERVATION.id || newRowIn > 0);
  const counts = {
    total: visible.length,
    NEW: visible.filter((r) => r.status === "NEW").length,
    PREPARING: visible.filter((r) => r.status === "PREPARING").length,
    READY: visible.filter((r) => r.status === "READY").length,
  };
  const target = rows.find((r) => r.id === RESERVATION.id)!;

  return (
    <div style={{ position: "absolute", inset: 0, background: "#0B0B0E", fontFamily: UI, color: C.text }}>
      {/* sidebar */}
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 232, background: "#0E0E12", borderRight: `1px solid ${C.line}` }}>
        <div style={{ position: "absolute", left: 28, top: 30 }}>
          <NagaExchangeWordmark size={30} align="left" />
          <div style={{ marginTop: 12, fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", color: C.gold }}>VIP ADMIN</div>
        </div>
        <div style={{ position: "absolute", top: 160, left: 16, right: 16, display: "flex", flexDirection: "column", gap: 6 }}>
          {NAV.map(({ icon: Icon, label, active, demo }) => (
            <div
              key={label}
              style={{
                height: 46,
                borderRadius: 12,
                padding: "0 14px",
                display: "flex",
                alignItems: "center",
                gap: 12,
                fontSize: 16,
                fontWeight: 600,
                background: active ? "rgba(205,166,82,0.13)" : "transparent",
                color: active ? C.goldLight : C.muted,
              }}
            >
              <Icon size={19} />
              <span style={{ flex: 1 }}>{label}</span>
              {demo ? <DemoTag label="DEMO" size={9} /> : null}
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 16, right: 16, bottom: 22, padding: 14, borderRadius: 14, background: C.surface, display: "flex", gap: 10, alignItems: "center" }}>
          <MapPin size={18} color={C.gold} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>İskele</div>
            <div style={{ fontSize: 12, color: C.muted }}>Front desk</div>
          </div>
        </div>
      </div>

      {/* header */}
      <div style={{ position: "absolute", left: LIST_X, right: 32, top: 26, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontFamily: DISPLAY, fontSize: 32, fontWeight: 800 }}>Today&apos;s Reservations</div>
          <div style={{ fontSize: 14, color: C.muted, marginTop: 4, display: "flex", gap: 8, alignItems: "center" }}>
            Naga Exchange · İskele <DemoTag label="DEMO DATA" size={9} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ height: 42, padding: "0 16px", borderRadius: 12, background: C.surface, display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600 }}>
            <MapPin size={16} color={C.gold} /> Branch: İskele
          </div>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: C.surface, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
            <Bell size={18} />
            {toast > 0 ? <div style={{ position: "absolute", top: 9, right: 10, width: 9, height: 9, borderRadius: 5, background: C.gold }} /> : null}
          </div>
        </div>
      </div>

      {/* stats */}
      <div style={{ position: "absolute", left: LIST_X, right: 32, top: 112, height: 86, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {[
          { label: "Total today", value: counts.total, color: C.text },
          { label: "New", value: counts.NEW, color: STATUS_STYLE.NEW.fg },
          { label: "Preparing", value: counts.PREPARING, color: STATUS_STYLE.PREPARING.fg },
          { label: "Ready", value: counts.READY, color: STATUS_STYLE.READY.fg },
        ].map((s) => (
          <div key={s.label} style={{ borderRadius: 16, background: C.surface, boxShadow: `inset 0 0 0 1px ${C.line}`, padding: "14px 18px" }}>
            <div style={{ fontSize: 13, color: C.muted, fontWeight: 600 }}>{s.label}</div>
            <div style={{ fontFamily: DISPLAY, fontSize: 32, fontWeight: 800, color: s.color, marginTop: 2 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* list */}
      <div style={{ position: "absolute", left: LIST_X, top: LIST_Y, width: LIST_W, height: HEADER_H + ROW_H * 4 + 12, borderRadius: 18, background: C.surface, boxShadow: `inset 0 0 0 1px ${C.line}`, overflow: "hidden" }}>
        <div style={{ height: HEADER_H, display: "flex", alignItems: "center", padding: "0 24px", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", color: C.muted2, borderBottom: `1px solid ${C.line}` }}>
          <div style={{ width: 110 }}>TIME</div>
          <div style={{ width: 150 }}>AMOUNT</div>
          <div style={{ width: 140 }}>PAIR</div>
          <div style={{ flex: 1 }}>CUSTOMER</div>
          <div style={{ width: 130, textAlign: "right" }}>STATUS</div>
        </div>
        {rows.map((r, i) => {
          const isTarget = r.id === RESERVATION.id;
          // rows after the inserted one slide down as it appears
          const offsetIndex = i > 2 ? 2 + newRowIn + (i - 3) : i;
          const sel = selected === r.id && detailIn > 0;
          const y = HEADER_H + offsetIndex * ROW_H;
          const appear = isTarget ? newRowIn : 1;
          return (
            <div
              key={r.id}
              style={{
                position: "absolute",
                left: 8,
                right: 8,
                top: y + 4,
                height: ROW_H - 8,
                borderRadius: 14,
                padding: "0 16px",
                display: "flex",
                alignItems: "center",
                opacity: appear,
                translate: `${(1 - appear) * -30}px 0`,
                background: sel ? "rgba(205,166,82,0.10)" : isTarget ? `rgba(205,166,82,${0.06 * appear})` : "transparent",
                boxShadow: sel ? "inset 0 0 0 1.5px rgba(205,166,82,0.65)" : "none",
              }}
            >
              <div style={{ width: 110, fontSize: 22, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>{r.time}</div>
              <div style={{ width: 150, fontSize: 22, fontWeight: 800 }}>{r.amount}</div>
              <div style={{ width: 140, fontSize: 15, color: C.muted, fontWeight: 600 }}>{r.pair}</div>
              <div style={{ flex: 1, fontSize: 15, fontWeight: 600 }}>VIP Customer</div>
              <div style={{ width: 130, display: "flex", justifyContent: "flex-end" }}>
                <StatusBadge status={r.status} size={12} />
              </div>
            </div>
          );
        })}
      </div>

      {/* activity hint under list */}
      <div style={{ position: "absolute", left: LIST_X, top: LIST_Y + HEADER_H + ROW_H * 4 + 32, width: LIST_W, display: "flex", gap: 12, alignItems: "center", fontSize: 14, color: C.muted }}>
        <Timer size={18} color={C.gold} />
        Reservations arrive from the NAGA VIP app before the customer visits the branch.
      </div>

      {/* detail */}
      <div
        style={{
          position: "absolute",
          left: DETAIL_X,
          top: LIST_Y,
          width: DETAIL_W,
          height: 656,
          borderRadius: 20,
          background: C.surface,
          boxShadow: `inset 0 0 0 1px ${detailIn > 0 ? "rgba(205,166,82,0.35)" : C.line}`,
          overflow: "hidden",
        }}
      >
        {detailIn > 0 ? (
          <div style={{ opacity: detailIn, translate: `${(1 - detailIn) * 30}px 0` }}>
            <div style={{ padding: "22px 24px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 12, color: C.muted, fontWeight: 700, letterSpacing: "0.14em" }}>RESERVATION</div>
                <div style={{ fontFamily: DISPLAY, fontSize: 26, fontWeight: 800, color: C.goldLight, marginTop: 2 }}>#{RESERVATION.id}</div>
              </div>
              <StatusBadge status={target.status} size={13} />
            </div>
            <div style={{ padding: "0 24px" }}>
              <Field label="Customer" value="VIP Customer" />
              <Field label="Currency" value="GBP → TRY" />
              <Field label="Amount" value={<span>£{RESERVATION.sell.amount} <span style={{ fontSize: 14, color: C.muted, fontWeight: 600 }}>≈ ₺{RESERVATION.receive.amount} · demo rate</span></span>} />
              <div style={{ display: "flex", gap: 24 }}>
                <div style={{ flex: 1 }}><Field label="Branch" value="İskele" /></div>
                <div style={{ flex: 1 }}><Field label="Time" value={RESERVATION.time} /></div>
              </div>
            </div>
            <AdminButton top={656 - 52 * 3 - 12 * 2 - 24} label="PREPARE" kind="gold" press={press.prepare} icon={<PackageCheck size={19} />} />
            <AdminButton top={656 - 52 * 2 - 12 - 24} label="CONTACT CUSTOMER" kind="outline" press={press.contact} icon={<MessageCircle size={19} />} />
            <AdminButton top={656 - 52 - 24} label="MARK AS READY" kind="green" press={press.ready} icon={<ListChecks size={19} />} />
          </div>
        ) : (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: C.muted2, fontSize: 16 }}>
            Select a reservation
          </div>
        )}
      </div>

      {/* toast */}
      {toast > 0 ? (
        <div
          style={{
            position: "absolute",
            right: 32,
            top: 84,
            width: 360,
            borderRadius: 16,
            padding: "14px 16px",
            background: "#24242A",
            boxShadow: "0 18px 40px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(205,166,82,0.45)",
            display: "flex",
            gap: 12,
            alignItems: "center",
            zIndex: 20,
            opacity: interpolate(toast, [0, 0.15, 0.85, 1], [0, 1, 1, 0], clamp),
            translate: `0 ${interpolate(toast, [0, 0.15], [-16, 0], clamp)}px`,
          }}
        >
          <div style={{ width: 38, height: 38, borderRadius: 12, background: GOLD_GRADIENT, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Bell size={19} color="#17120A" />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800 }}>New reservation · #{RESERVATION.id}</div>
            <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>£{RESERVATION.sell.amount} · GBP → TRY · {RESERVATION.time}</div>
          </div>
        </div>
      ) : null}

      {cursor ? <Cursor {...cursor} /> : null}
    </div>
  );
};
