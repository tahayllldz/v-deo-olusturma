import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop } from "../components/Background";
import { DesktopFrame, desktopOuterSize } from "../components/DesktopFrame";
import { PhoneFrame, SCREEN_H, SCREEN_W, phoneOuterSize } from "../components/PhoneFrame";
import { StatusBar } from "../components/PhoneFrame";
import { Eyebrow, DemoTag } from "../components/ui";
import { NagaVipWordmark } from "../components/Wordmark";
import { DISPLAY, UI } from "../fonts";
import { AdminDashboard } from "../screens/AdminDashboard";
import { BranchTimeScreen } from "../screens/BranchTimeScreen";
import { ConfirmationScreen } from "../screens/ConfirmationScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { SuccessScreen } from "../screens/SuccessScreen";
import { StatusScreen } from "../screens/StatusScreen";
import { TransactionScreen } from "../screens/TransactionScreen";
import { C } from "../theme";

export type MockupId =
  | "home"
  | "transaction"
  | "branch-time"
  | "confirmation"
  | "success"
  | "status"
  | "admin"
  | "admin-ready";

export const PHONE_MOCKUPS: { id: Exclude<MockupId, "admin" | "admin-ready">; n: string; title: string; text: string }[] = [
  { id: "home", n: "01", title: "Ana Sayfa", text: "Güncel kurlar ve tek dokunuşla işlem oluşturma." },
  { id: "transaction", n: "02", title: "İşlem Oluştur", text: "Döviz ve miktar girilir, alınacak tutar anında görünür." },
  { id: "branch-time", n: "03", title: "Şube ve Saat", text: "Teslim noktası ve gelinecek saat seçilir." },
  { id: "confirmation", n: "04", title: "Rezervasyon Özeti", text: "Müşteri tüm detayları tek ekranda onaylar." },
  { id: "success", n: "05", title: "Rezervasyon Oluşturuldu", text: "Naga işlemi müşteri gelmeden hazırlamaya başlar." },
  { id: "status", n: "06", title: "Rezervasyon Durumu", text: "İşlem hazır olduğunda müşteri bildirim alır." },
];

export const PhoneScreen: React.FC<{ id: MockupId }> = ({ id }) => {
  switch (id) {
    case "home":
      return <HomeScreen />;
    case "transaction":
      return <TransactionScreen />;
    case "branch-time":
      return <BranchTimeScreen />;
    case "confirmation":
      return <ConfirmationScreen />;
    case "success":
      return <SuccessScreen />;
    case "status":
      return <StatusScreen stage={2} notification={1} />;
    default:
      return null;
  }
};

/** Bare app screen, 393×852 (render with --scale=3 for 1179×2556). */
export const ScreenOnly: React.FC<{ id: MockupId }> = ({ id }) => (
  <AbsoluteFill style={{ background: C.ink }}>
    <PhoneScreen id={id} />
    <StatusBar />
  </AbsoluteFill>
);
export const SCREEN_ONLY_SIZE = { width: SCREEN_W, height: SCREEN_H };

/** Phone in frame on a transparent background. */
const FRAMED_PAD = 70;
export const FRAMED_SIZE = {
  width: phoneOuterSize().w + FRAMED_PAD * 2,
  height: phoneOuterSize().h + FRAMED_PAD * 2,
};
export const FramedPhone: React.FC<{ id: MockupId; variant?: "iphone" | "android" }> = ({ id, variant = "iphone" }) => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
    <PhoneFrame variant={variant} glow={0}>
      <PhoneScreen id={id} />
    </PhoneFrame>
  </AbsoluteFill>
);

/** 1920×1080 presentation shot for each phone screen. */
export const PhoneShowcase: React.FC<{ id: MockupId }> = ({ id }) => {
  const meta = PHONE_MOCKUPS.find((m) => m.id === id)!;
  return (
    <AbsoluteFill style={{ fontFamily: UI, color: C.text }}>
      <Backdrop focusX={66} focusY={50} />
      <div style={{ position: "absolute", left: 150, top: 330, width: 760 }}>
        <Eyebrow size={22}>NAGA VIP · Ekran {meta.n}</Eyebrow>
        <div style={{ fontFamily: DISPLAY, fontSize: 84, fontWeight: 800, lineHeight: 1.05, marginTop: 22 }}>{meta.title}</div>
        <div style={{ fontSize: 36, color: C.muted, marginTop: 26, lineHeight: 1.35 }}>{meta.text}</div>
        <div style={{ marginTop: 40, display: "flex", gap: 14, alignItems: "center" }}>
          <DemoTag label="DEMO VERİ" size={14} />
          <span style={{ fontSize: 22, color: C.muted2 }}>Kur ve saatler örnektir</span>
        </div>
      </div>
      <div style={{ position: "absolute", right: 230, top: 85 }}>
        <PhoneFrame scale={0.995}>
          <PhoneScreen id={id} />
        </PhoneFrame>
      </div>
      <div style={{ position: "absolute", left: 150, bottom: 70 }}>
        <NagaVipWordmark size={26} />
      </div>
    </AbsoluteFill>
  );
};

/** Admin dashboard in a browser frame. */
export const AdminShowcase: React.FC<{ ready?: boolean }> = ({ ready }) => {
  const { w, h } = desktopOuterSize();
  const scale = 0.84;
  return (
    <AbsoluteFill style={{ fontFamily: UI, color: C.text }}>
      <Backdrop focusX={50} focusY={55} />
      <div style={{ position: "absolute", left: (1920 - w * scale) / 2, top: (1080 - h * scale) / 2 + 10 }}>
        <DesktopFrame scale={scale}>
          <AdminDashboard statuses={ready ? { "NGR-1042": "READY" } : {}} />
        </DesktopFrame>
      </div>
    </AbsoluteFill>
  );
};

/** Admin dashboard content only, 1440×900. */
export const AdminOnly: React.FC<{ ready?: boolean }> = ({ ready }) => (
  <AbsoluteFill>
    <AdminDashboard statuses={ready ? { "NGR-1042": "READY" } : {}} />
  </AbsoluteFill>
);
