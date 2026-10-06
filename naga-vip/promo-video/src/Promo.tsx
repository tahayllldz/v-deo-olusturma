import React from "react";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { SoundTrack } from "./components/SoundTrack";
import { LayoutProvider } from "./LayoutContext";
import { AdminScene } from "./scenes/AdminScene";
import { ArrivalScene } from "./scenes/ArrivalScene";
import { CtaScene } from "./scenes/CtaScene";
import { CustomerFlow } from "./scenes/CustomerFlow";
import { MessageScene } from "./scenes/MessageScene";
import { C } from "./theme";
import { TRANSITION } from "./timeline";
import { goldSwoosh } from "./transitions/GoldSwoosh";

/** The full NAGA VIP promo. Durations mirror SCENES in timeline.ts. */
export const Promo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.ink }}>
      <TransitionSeries>
        <TransitionSeries.Sequence name="S1-S6 Customer flow" durationInFrames={630} premountFor={fps}>
          <CustomerFlow />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={goldSwoosh()} timing={linearTiming({ durationInFrames: TRANSITION })} />
        <TransitionSeries.Sequence name="S7 Naga admin" durationInFrames={150} premountFor={fps}>
          <AdminScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={goldSwoosh()} timing={linearTiming({ durationInFrames: TRANSITION })} />
        <TransitionSeries.Sequence name="S8 Arrival" durationInFrames={120} premountFor={fps}>
          <ArrivalScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={goldSwoosh()} timing={linearTiming({ durationInFrames: TRANSITION })} />
        <TransitionSeries.Sequence name="S9 Message" durationInFrames={108} premountFor={fps}>
          <MessageScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={goldSwoosh()} timing={linearTiming({ durationInFrames: TRANSITION })} />
        <TransitionSeries.Sequence name="S10 CTA" durationInFrames={150} premountFor={fps}>
          <CtaScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <SoundTrack />
    </AbsoluteFill>
  );
};

export const PromoLandscape: React.FC = () => (
  <LayoutProvider width={1920} height={1080}>
    <Promo />
  </LayoutProvider>
);

export const PromoPortrait: React.FC = () => (
  <LayoutProvider width={1080} height={1920}>
    <Promo />
  </LayoutProvider>
);
