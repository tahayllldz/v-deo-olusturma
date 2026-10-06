import React from "react";
import { NagaVipWordmark } from "../components/Wordmark";
import { ScreenBg } from "../components/ui";
import { DISPLAY } from "../fonts";
import { C } from "../theme";

export const SplashScreen: React.FC<{ reveal?: number }> = ({ reveal = 1 }) => (
  <ScreenBg
    style={{
      background:
        "radial-gradient(80% 45% at 50% 46%, rgba(205,166,82,0.22) 0%, rgba(205,166,82,0) 70%), #08080A",
    }}
  >
    <div
      style={{
        position: "absolute",
        top: 360,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity: reveal,
        scale: String(0.94 + 0.06 * reveal),
      }}
    >
      <NagaVipWordmark size={44} />
      <div
        style={{
          marginTop: 18,
          fontFamily: DISPLAY,
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.42em",
          marginRight: "-0.42em",
          color: C.muted,
        }}
      >
        NAGA EXCHANGE · İSKELE
      </div>
    </div>
  </ScreenBg>
);
