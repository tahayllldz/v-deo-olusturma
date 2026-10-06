import React from "react";
import {
  ArrowDown,
  ArrowRight,
  Banknote,
  BadgeCheck,
  Bell,
  BellRing,
  Bot,
  Building2,
  Calculator,
  CalendarCheck2,
  ChartColumn,
  Check,
  Clock3,
  Crown,
  DoorOpen,
  Gift,
  Globe,
  HeartHandshake,
  History,
  Hourglass,
  LayoutDashboard,
  LineChart,
  ListChecks,
  MapPin,
  MessageCircle,
  MessageSquare,
  Repeat,
  Smartphone,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { DesktopFrame } from "../components/DesktopFrame";
import { PhoneFrame } from "../components/PhoneFrame";
import { DemoTag, Eyebrow, StatusBadge } from "../components/ui";
import { GoldText, NagaExchangeWordmark, NagaVipWordmark } from "../components/Wordmark";
import { DISPLAY } from "../fonts";
import { AdminDashboard } from "../screens/AdminDashboard";
import { BranchTimeScreen } from "../screens/BranchTimeScreen";
import { ConfirmationScreen } from "../screens/ConfirmationScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { SuccessScreen } from "../screens/SuccessScreen";
import { TransactionScreen } from "../screens/TransactionScreen";
import { C, STATUS_STYLE } from "../theme";
import { Card, IconCircle, SlideFrame, SlideTitle } from "./SlideKit";

const Arrow: React.FC<{ size?: number; color?: string; down?: boolean }> = ({ size = 40, color = C.muted2, down }) =>
  down ? <ArrowDown size={size} color={color} strokeWidth={2.2} /> : <ArrowRight size={size} color={color} strokeWidth={2.2} />;

// 01 — Title -----------------------------------------------------------------
export const Slide01: React.FC = () => (
  <SlideFrame n={1} demo focusX={72} focusY={48} intensity={1.3}>
    <div style={{ position: "absolute", left: 140, top: 290, width: 960 }}>
      <Eyebrow size={24}>Naga Exchange · İskele için ürün konsepti</Eyebrow>
      <NagaVipWordmark size={176} style={{ marginTop: 40 }} />
      <div style={{ fontFamily: DISPLAY, fontSize: 58, fontWeight: 700, lineHeight: 1.2, marginTop: 56, color: C.ivory }}>
        Döviz işlemini müşteriniz
        <br />
        <GoldText>gelmeden</GoldText> hazırlayın.
      </div>
    </div>
    <div style={{ position: "absolute", right: 210, top: 70, transform: "perspective(2000px) rotateY(-10deg) rotateX(2deg)" }}>
      <PhoneFrame scale={1.06} glow={1}>
        <SuccessScreen />
      </PhoneFrame>
    </div>
  </SlideFrame>
);

// 02 — Bugün -----------------------------------------------------------------
const TODAY = [
  { icon: DoorOpen, title: "Müşteri gelir", text: "Şubeye gelir" },
  { icon: MessageSquare, title: "İşlemini söyler", text: "Döviz ve miktar" },
  { icon: Hourglass, title: "Bekler", text: "Sıra ve hazırlık" },
  { icon: Banknote, title: "İşlem hazırlanır", text: "Müşteri oradayken" },
];
export const Slide02: React.FC = () => (
  <SlideFrame n={2} muted focusX={50} focusY={60}>
    <SlideTitle eyebrow="Bugün" style={{ position: "absolute", left: 140, top: 150 }} sub="Her şey, müşteri şubeye geldikten sonra başlıyor.">
      Döviz işlemi bugün böyle.
    </SlideTitle>
    <div style={{ position: "absolute", left: 120, right: 120, top: 500, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
      {TODAY.map(({ icon: Icon, title, text }, i) => (
        <React.Fragment key={title}>
          <div style={{ width: 340, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <IconCircle size={150} muted>
              <Icon size={64} strokeWidth={1.6} />
            </IconCircle>
            <div style={{ fontFamily: DISPLAY, fontSize: 38, fontWeight: 700, marginTop: 34, color: C.text, whiteSpace: "nowrap" }}>{title}</div>
            <div style={{ fontSize: 28, color: C.muted2, marginTop: 10 }}>{text}</div>
          </div>
          {i < TODAY.length - 1 ? (
            <div style={{ marginTop: 49 }}>
              <Arrow size={52} />
            </div>
          ) : null}
        </React.Fragment>
      ))}
    </div>
  </SlideFrame>
);

// 03 — Big question ------------------------------------------------------------
export const Slide03: React.FC = () => (
  <SlideFrame n={3} focusX={50} focusY={50} intensity={1.1}>
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
      <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 132, lineHeight: 1.08, letterSpacing: "-0.015em" }}>
        Peki ya müşteri
        <br />
        <GoldText>gelmeden</GoldText> hazırlasak?
      </div>
    </div>
  </SlideFrame>
);

// 04 — NAGA VIP ------------------------------------------------------------------
const FLOW_STEPS = [
  { icon: Banknote, label: "Döviz" },
  { icon: Calculator, label: "Miktar" },
  { icon: MapPin, label: "Şube" },
  { icon: Clock3, label: "Saat" },
  { icon: CalendarCheck2, label: "Rezervasyon" },
];
export const Slide04: React.FC = () => (
  <SlideFrame n={4} demo focusX={74} focusY={50}>
    <div style={{ position: "absolute", left: 140, top: 150, width: 980 }}>
      <Eyebrow size={24}>Yeni müşteri deneyimi</Eyebrow>
      <NagaVipWordmark size={112} style={{ marginTop: 28 }} />
      <div style={{ fontSize: 38, lineHeight: 1.4, color: C.muted, marginTop: 34 }}>
        Naga&apos;nın VIP müşterileri döviz işlemlerini
        <br />
        <span style={{ color: C.text }}>şubeye gelmeden önce</span> planlar.
      </div>
      <div style={{ fontSize: 26, color: C.goldLight, fontWeight: 600, marginTop: 64, letterSpacing: "0.04em" }}>
        Müşteri telefonundan:
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 22 }}>
        {FLOW_STEPS.map(({ icon: Icon, label }, i) => (
          <React.Fragment key={label}>
            <div
              style={{
                height: 76,
                padding: "0 22px",
                borderRadius: 38,
                display: "flex",
                alignItems: "center",
                gap: 12,
                fontSize: 27,
                fontWeight: 700,
                background: i === FLOW_STEPS.length - 1 ? "rgba(205,166,82,0.18)" : C.surface,
                boxShadow: i === FLOW_STEPS.length - 1 ? "inset 0 0 0 1.5px rgba(205,166,82,0.7)" : `inset 0 0 0 1px ${C.lineStrong}`,
                color: i === FLOW_STEPS.length - 1 ? C.goldLight : C.text,
              }}
            >
              <Icon size={28} color={C.gold} />
              {label}
            </div>
            {i < FLOW_STEPS.length - 1 ? <ArrowRight size={30} color={C.gold} /> : null}
          </React.Fragment>
        ))}
      </div>
    </div>
    <div style={{ position: "absolute", right: 170, top: 80 }}>
      <PhoneFrame scale={1.04} glow={0.9}>
        <HomeScreen />
      </PhoneFrame>
    </div>
  </SlideFrame>
);

// 05 — 30 saniyede rezervasyon ------------------------------------------------------
const STEPS5 = [
  { n: 1, label: "Kurları görür", el: <HomeScreen /> },
  { n: 2, label: "Tutarı girer", el: <TransactionScreen /> },
  { n: 3, label: "Şube ve saat", el: <BranchTimeScreen /> },
  { n: 4, label: "Onaylar", el: <ConfirmationScreen /> },
  { n: 5, label: "Hazır", el: <SuccessScreen /> },
];
export const Slide05: React.FC = () => (
  <SlideFrame n={5} demo focusX={50} focusY={62}>
    <SlideTitle style={{ position: "absolute", left: 140, top: 96 }} size={80} eyebrow="5 adım">
      30 saniyede <GoldText>rezervasyon</GoldText>
    </SlideTitle>
    <div style={{ position: "absolute", right: 140, top: 150, fontSize: 24, color: C.muted2, textAlign: "right", lineHeight: 1.45 }}>
      Hedeflenen akış süresi
      <br />
      (konsept prototip)
    </div>
    <div style={{ position: "absolute", left: 120, right: 120, top: 330, display: "flex", justifyContent: "space-between" }}>
      {STEPS5.map((s) => (
        <div key={s.n} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <PhoneFrame scale={0.6} glow={s.n === 5 ? 0.9 : 0.25}>
            {s.el}
          </PhoneFrame>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 26 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: DISPLAY,
                fontWeight: 800,
                fontSize: 22,
                background: s.n === 5 ? "linear-gradient(135deg,#F3DDA2,#B98D3C)" : C.surface2,
                color: s.n === 5 ? "#17120A" : C.goldLight,
              }}
            >
              {s.n}
            </div>
            <div style={{ fontSize: 30, fontWeight: 700 }}>{s.label}</div>
          </div>
        </div>
      ))}
    </div>
  </SlideFrame>
);

// 06 — Naga tarafında -----------------------------------------------------------------
const STAFF = [
  { status: "NEW" as const, title: "Rezervasyon düşer", text: "£10,000 · GBP → TRY · 16:30 · İskele" },
  { status: "PREPARING" as const, title: "Ekip hazırlar", text: "Müşteri yoldayken işlem hazırlanır" },
  { status: "READY" as const, title: "Durum güncellenir", text: "Müşteriye “hazır” bildirimi gider" },
];
export const Slide06: React.FC = () => (
  <SlideFrame n={6} demo focusX={66} focusY={55}>
    <div style={{ position: "absolute", left: 120, top: 120, width: 520 }}>
      <SlideTitle eyebrow="Naga tarafında" size={68}>
        Siz <GoldText>hazırlayın.</GoldText>
      </SlideTitle>
      <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 14 }}>
        {STAFF.map((s, i) => (
          <React.Fragment key={s.status}>
            <Card style={{ padding: "18px 24px" }} gold={s.status === "READY"}>
              <StatusBadge status={s.status} size={16} />
              <div style={{ fontFamily: DISPLAY, fontSize: 30, fontWeight: 700, marginTop: 12 }}>{s.title}</div>
              <div style={{ fontSize: 22, color: C.muted, marginTop: 6 }}>{s.text}</div>
            </Card>
            {i < STAFF.length - 1 ? (
              <div style={{ display: "flex", justifyContent: "center", marginTop: -6, marginBottom: -6 }}>
                <ArrowDown size={28} color={STATUS_STYLE[STAFF[i + 1].status].fg} />
              </div>
            ) : null}
          </React.Fragment>
        ))}
      </div>
    </div>
    <div style={{ position: "absolute", left: 690, top: 150 }}>
      <DesktopFrame scale={0.79}>
        <AdminDashboard statuses={{ "NGR-1042": "NEW" }} />
      </DesktopFrame>
    </div>
  </SlideFrame>
);

// 07 — Müşteri deneyimi: before / after -------------------------------------------------
const BEFORE = ["Şubeye gelir", "Bekler", "İşlem hazırlanır"];
const AFTER = ["Uygulamadan rezervasyon", "Naga hazırlar", "Müşteri gelir", "İşlem tamamlanır"];
const Column: React.FC<{ title: string; items: string[]; gold?: boolean; tag: string }> = ({ title, items, gold, tag }) => (
  <Card gold={gold} style={{ flex: 1, padding: "46px 54px", position: "relative" }}>
    <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "0.22em", color: gold ? C.gold : C.muted2 }}>{tag}</div>
    <div style={{ fontFamily: DISPLAY, fontSize: 52, fontWeight: 800, marginTop: 12, color: gold ? C.white : C.muted }}>{title}</div>
    <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 0 }}>
      {items.map((it, i) => (
        <div key={it} style={{ display: "flex", gap: 24 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 26,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: gold ? (i === items.length - 1 ? "linear-gradient(135deg,#F3DDA2,#B98D3C)" : "rgba(205,166,82,0.18)") : C.surface2,
                color: gold ? (i === items.length - 1 ? "#17120A" : C.goldLight) : C.muted,
                fontFamily: DISPLAY,
                fontWeight: 800,
                fontSize: 24,
              }}
            >
              {gold && i === items.length - 1 ? <Check size={28} strokeWidth={3} /> : i + 1}
            </div>
            {i < items.length - 1 ? <div style={{ width: 2, height: 46, background: gold ? "rgba(205,166,82,0.4)" : C.surface3 }} /> : null}
          </div>
          <div style={{ fontSize: 36, fontWeight: 600, paddingTop: 6, color: gold ? C.text : C.muted }}>
            {it}
            {!gold && it === "Bekler" ? <Hourglass size={30} color={C.muted2} style={{ marginLeft: 14, verticalAlign: "-4px" }} /> : null}
          </div>
        </div>
      ))}
    </div>
  </Card>
);
export const Slide07: React.FC = () => (
  <SlideFrame n={7} focusX={72} focusY={55}>
    <SlideTitle eyebrow="Müşteri deneyimi" style={{ position: "absolute", left: 140, top: 110 }} size={80}>
      Bekleme yerine <GoldText>hazır işlem.</GoldText>
    </SlideTitle>
    <div style={{ position: "absolute", left: 140, right: 140, top: 340, display: "flex", gap: 40, alignItems: "stretch" }}>
      <Column tag="BEFORE · BUGÜN" title="Şubede başlar" items={BEFORE} />
      <div style={{ display: "flex", alignItems: "center" }}>
        <ArrowRight size={56} color={C.gold} />
      </div>
      <Column tag="AFTER · NAGA VIP" title="Telefonda başlar" items={AFTER} gold />
    </div>
  </SlideFrame>
);

// 08 — Naga'ya ne kazandırır? ----------------------------------------------------------------
const BENEFITS = [
  { icon: Zap, title: "Daha hızlı hizmet", text: "İşlem, müşteri gelmeden hazır." },
  { icon: Crown, title: "VIP müşteri deneyimi", text: "Müşteri kendini öncelikli hisseder." },
  { icon: ListChecks, title: "Daha düzenli operasyon", text: "Günün talebi önceden görünür." },
  { icon: HeartHandshake, title: "Müşteri sadakati", text: "Kolay deneyim, tekrar gelen müşteri." },
  { icon: BadgeCheck, title: "Güçlü dijital marka", text: "Naga, müşterinin telefonunda." },
];
export const Slide08: React.FC = () => (
  <SlideFrame n={8} focusX={50} focusY={65}>
    <SlideTitle eyebrow="İşletme değeri" style={{ position: "absolute", left: 140, top: 120 }} size={84}>
      Naga&apos;ya ne <GoldText>kazandırır?</GoldText>
    </SlideTitle>
    <div style={{ position: "absolute", left: 140, right: 140, top: 400, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 26 }}>
      {BENEFITS.map(({ icon: Icon, title, text }, i) => (
        <Card key={title} gold={i === 1} style={{ padding: "40px 30px 44px", minHeight: 400, display: "flex", flexDirection: "column" }}>
          <IconCircle size={96}>
            <Icon size={44} strokeWidth={1.8} />
          </IconCircle>
          <div style={{ fontFamily: DISPLAY, fontSize: 34, fontWeight: 800, lineHeight: 1.15, marginTop: 36 }}>{title}</div>
          <div style={{ fontSize: 26, color: C.muted, lineHeight: 1.4, marginTop: 16 }}>{text}</div>
        </Card>
      ))}
    </div>
  </SlideFrame>
);

// 09 — İlk versiyon (MVP) -------------------------------------------------------------------
const MVP_APP = [
  { icon: Smartphone, label: "Mobil uygulama" },
  { icon: LineChart, label: "Kur görüntüleme" },
  { icon: Calculator, label: "Döviz hesaplama" },
  { icon: CalendarCheck2, label: "Rezervasyon" },
  { icon: MapPin, label: "Şube seçimi" },
  { icon: Clock3, label: "Tarih / saat" },
  { icon: ListChecks, label: "Rezervasyon durumu" },
  { icon: Bell, label: "Bildirim" },
  { icon: History, label: "İşlem geçmişi" },
];
export const Slide09: React.FC = () => (
  <SlideFrame n={9} focusX={30} focusY={50}>
    <div style={{ position: "absolute", left: 140, top: 140, width: 560 }}>
      <SlideTitle eyebrow="MVP · Faz 1" size={84}>
        İlk <GoldText>versiyon</GoldText>
      </SlideTitle>
      <div style={{ fontSize: 32, color: C.muted, lineHeight: 1.45, marginTop: 30 }}>
        Rezervasyon deneyimini uçtan uca çalıştıran, sade bir başlangıç.
      </div>
      <Card style={{ padding: "26px 30px", marginTop: 56 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <DemoTag label="RATE RESERVATION" size={14} />
        </div>
        <div style={{ fontSize: 23, color: C.muted, lineHeight: 1.45, marginTop: 14 }}>
          Uygulama tahmini kuru gösterir. Kurun kesin olarak kilitlenmesi (Rate Lock) ve geçerlilik süresi, Naga Exchange&apos;in
          operasyonel ve yasal kurallarına göre belirlenir.
        </div>
      </Card>
    </div>
    <div style={{ position: "absolute", left: 800, right: 140, top: 150 }}>
      <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: "0.2em", color: C.gold }}>MÜŞTERİ UYGULAMASI</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginTop: 22 }}>
        {MVP_APP.map(({ icon: Icon, label }) => (
          <Card key={label} style={{ padding: "0 26px", height: 92, display: "flex", alignItems: "center", gap: 18, gridColumn: label === "Mobil uygulama" ? "1 / -1" : undefined }}>
            <Icon size={32} color={C.gold} />
            <span style={{ fontSize: 29, fontWeight: 600 }}>{label}</span>
            {label === "Mobil uygulama" ? <span style={{ fontSize: 26, color: C.muted }}>iOS + Android</span> : null}
          </Card>
        ))}
      </div>
      <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: "0.2em", color: C.gold, marginTop: 40 }}>NAGA EKİBİ</div>
      <Card gold style={{ padding: "0 24px", height: 92, display: "flex", alignItems: "center", gap: 18, marginTop: 22 }}>
        <LayoutDashboard size={32} color={C.gold} />
        <span style={{ fontSize: 28, fontWeight: 700 }}>Admin panel</span>
        <span style={{ fontSize: 24, color: C.muted }}>— rezervasyon listesi, durum güncelleme, müşteriyle iletişim</span>
      </Card>
    </div>
  </SlideFrame>
);

// 10 — Sonraki aşama: NAGA VIP+ timeline -------------------------------------------------------
const PHASES = [
  { n: "Faz 1", title: "Rezervasyon", items: ["İlk versiyon (MVP)", "Uygulama + admin panel"], icon: CalendarCheck2, now: true },
  { n: "Faz 2", title: "VIP + Kur alarmı", items: ["Kur alarmı", "Favori para birimleri", "Tekrar işlem", "VIP seviyeleri"], icon: Star },
  { n: "Faz 3", title: "CRM + Otomasyon", items: ["CRM", "WhatsApp", "Analytics", "Loyalty"], icon: Users },
  { n: "Faz 4", title: "Çok şube / Kurumsal", items: ["Birden fazla şube", "Kurumsal müşteriler"], icon: Building2 },
];
const PHASE_ICONS: Record<string, React.FC<{ size?: number; color?: string }>> = {
  "Kur alarmı": BellRing,
  "Favori para birimleri": Star,
  "Tekrar işlem": Repeat,
  "VIP seviyeleri": Crown,
  CRM: Users,
  WhatsApp: MessageCircle,
  Analytics: ChartColumn,
  Loyalty: Gift,
};
export const Slide10: React.FC = () => (
  <SlideFrame n={10} focusX={60} focusY={55}>
    <SlideTitle eyebrow="Sonraki aşama" style={{ position: "absolute", left: 140, top: 110 }} size={84}>
      NAGA VIP<GoldText>+</GoldText>
    </SlideTitle>
    <div style={{ position: "absolute", right: 140, top: 150, maxWidth: 760, textAlign: "right", fontSize: 28, color: C.muted, lineHeight: 1.45 }}>
      İlk sürümün parçası değildir.
      <br />
      Kullanıma göre adım adım değerlendirilebilir.
    </div>
    {/* timeline line */}
    <div style={{ position: "absolute", left: 200, right: 200, top: 418, height: 3, background: `linear-gradient(90deg, ${C.gold}, rgba(205,166,82,0.15))` }} />
    <div style={{ position: "absolute", left: 140, right: 140, top: 380, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 28 }}>
      {PHASES.map((p) => (
        <div key={p.n}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: p.now ? "linear-gradient(135deg,#F3DDA2,#B98D3C)" : C.surface2,
              boxShadow: p.now ? "0 0 40px rgba(205,166,82,0.45)" : "inset 0 0 0 1.5px rgba(205,166,82,0.4)",
              color: p.now ? "#17120A" : C.goldLight,
              marginLeft: 30,
            }}
          >
            <p.icon size={36} />
          </div>
          <Card gold={p.now} style={{ padding: "28px 30px", marginTop: 28, minHeight: 330 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: "0.18em", color: C.gold }}>{p.n.toUpperCase()}</span>
              {p.now ? <DemoTag label="İLK SÜRÜM" size={12} /> : <span style={{ fontSize: 18, color: C.muted2 }}>ileride</span>}
            </div>
            <div style={{ fontFamily: DISPLAY, fontSize: 34, fontWeight: 800, marginTop: 14, lineHeight: 1.15 }}>{p.title}</div>
            <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 14 }}>
              {p.items.map((it) => {
                const Icon = PHASE_ICONS[it] ?? Check;
                return (
                  <div key={it} style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 26, color: p.now ? C.text : C.muted }}>
                    <Icon size={24} color={C.gold} />
                    {it}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      ))}
    </div>
  </SlideFrame>
);

// 11 — Beta Studio ------------------------------------------------------------------------------
const STUDIO = [
  { icon: Smartphone, title: "App", text: "iOS + Android müşteri uygulaması" },
  { icon: Globe, title: "Web", text: "Admin panel ve web varlığı" },
  { icon: Bot, title: "Automation", text: "Bildirim ve iş akışları" },
  { icon: TrendingUp, title: "Digital Growth", text: "Lansman ve büyüme" },
];
export const Slide11: React.FC = () => (
  <SlideFrame n={11} focusX={50} focusY={60}>
    <div style={{ position: "absolute", left: 140, top: 130 }}>
      <Eyebrow size={24}>Teknoloji partneri</Eyebrow>
      <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 112, marginTop: 24, letterSpacing: "0.01em" }}>Beta Studio</div>
      <div style={{ fontSize: 36, color: C.goldLight, marginTop: 14, fontWeight: 600 }}>Digital Growth &amp; Technology Studio</div>
    </div>
    <div style={{ position: "absolute", left: 140, right: 140, top: 450, display: "flex", alignItems: "stretch", gap: 22 }}>
      {STUDIO.map(({ icon: Icon, title, text }, i) => (
        <React.Fragment key={title}>
          <Card style={{ flex: 1, padding: "38px 32px", minHeight: 270 }}>
            <IconCircle size={88}>
              <Icon size={40} strokeWidth={1.8} />
            </IconCircle>
            <div style={{ fontFamily: DISPLAY, fontSize: 40, fontWeight: 800, marginTop: 28 }}>{title}</div>
            <div style={{ fontSize: 25, color: C.muted, marginTop: 10, lineHeight: 1.4 }}>{text}</div>
          </Card>
          {i < STUDIO.length - 1 ? <div style={{ alignSelf: "center", fontFamily: DISPLAY, fontSize: 56, fontWeight: 300, color: C.gold }}>+</div> : null}
        </React.Fragment>
      ))}
    </div>
    <div style={{ position: "absolute", left: 140, top: 862, fontSize: 32, color: C.text, display: "flex", alignItems: "center", gap: 16 }}>
      <Sparkles size={32} color={C.gold} />
      NAGA VIP&apos;i fikirden yayına taşıyacak ekip:
      <span style={{ color: C.goldLight, fontWeight: 600 }}>tasarım → geliştirme → yayın → büyüme.</span>
    </div>
  </SlideFrame>
);

// 12 — Closing ------------------------------------------------------------------------------------
export const Slide12: React.FC = () => (
  <SlideFrame n={12} focusX={50} focusY={46} intensity={1.35} hideFooter>
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
      <NagaExchangeWordmark size={44} style={{ opacity: 0.9 }} />
      <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 122, lineHeight: 1.08, marginTop: 70, letterSpacing: "-0.01em" }}>
        Müşteriniz gelsin.
        <br />
        İşlemi <GoldText>hazır</GoldText> olsun.
      </div>
      <NagaVipWordmark size={64} style={{ marginTop: 74 }} />
      <div style={{ marginTop: 70, fontSize: 26, color: C.muted, letterSpacing: "0.06em" }}>
        <span style={{ color: C.text, fontWeight: 700, letterSpacing: "0.14em" }}>BETA STUDIO</span>
        <span style={{ margin: "0 18px", color: C.muted2 }}>·</span>
        Digital Growth &amp; Technology Studio
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 46, textAlign: "center", fontSize: 18, color: C.muted2 }}>
      Konsept sunumu · Ekranlardaki kurlar, saatler ve veriler örnektir (DEMO) · Naga Exchange&apos;in gerçek fiyatlarını yansıtmaz.
    </div>
  </SlideFrame>
);

export const SLIDES = [Slide01, Slide02, Slide03, Slide04, Slide05, Slide06, Slide07, Slide08, Slide09, Slide10, Slide11, Slide12];
