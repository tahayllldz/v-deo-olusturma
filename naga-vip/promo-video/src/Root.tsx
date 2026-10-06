import React from "react";
import { Composition, Folder, Still } from "remotion";
import "./fonts";
import { PromoLandscape, PromoPortrait } from "./Promo";
import { AdminScene } from "./scenes/AdminScene";
import { ArrivalScene } from "./scenes/ArrivalScene";
import { CtaScene } from "./scenes/CtaScene";
import { CustomerFlow } from "./scenes/CustomerFlow";
import { MessageScene } from "./scenes/MessageScene";
import {
  Slide01,
  Slide02,
  Slide03,
  Slide04,
  Slide05,
  Slide06,
  Slide07,
  Slide08,
  Slide09,
  Slide10,
  Slide11,
  Slide12,
} from "./slides/Slides";
import {
  AdminOnly,
  AdminShowcase,
  FRAMED_SIZE,
  FramedPhone,
  PHONE_MOCKUPS,
  PhoneShowcase,
  SCREEN_ONLY_SIZE,
  ScreenOnly,
} from "./mockups/Mockups";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Final promo — 1110 frames = 37.0 s (TOTAL_FRAMES in timeline.ts). */}
      <Composition id="Promo-Landscape" component={PromoLandscape} durationInFrames={1110} fps={30} width={1920} height={1080} />
      <Composition id="Promo-Portrait" component={PromoPortrait} durationInFrames={1110} fps={30} width={1080} height={1920} />

      {/* Individual sections for previewing in Studio. */}
      <Folder name="Scenes">
        <Composition id="Scene-Flow" component={CustomerFlow} durationInFrames={630} fps={30} width={1920} height={1080} />
        <Composition id="Scene-Admin" component={AdminScene} durationInFrames={150} fps={30} width={1920} height={1080} />
        <Composition id="Scene-Arrival" component={ArrivalScene} durationInFrames={120} fps={30} width={1920} height={1080} />
        <Composition id="Scene-Message" component={MessageScene} durationInFrames={108} fps={30} width={1920} height={1080} />
        <Composition id="Scene-CTA" component={CtaScene} durationInFrames={150} fps={30} width={1920} height={1080} />
      </Folder>

      {/* Owner presentation — 12 slides, exported to PDF + PPTX by scripts/build-deck.mjs */}
      <Folder name="Slides">
        <Still id="Slide-01" component={Slide01} width={1920} height={1080} />
        <Still id="Slide-02" component={Slide02} width={1920} height={1080} />
        <Still id="Slide-03" component={Slide03} width={1920} height={1080} />
        <Still id="Slide-04" component={Slide04} width={1920} height={1080} />
        <Still id="Slide-05" component={Slide05} width={1920} height={1080} />
        <Still id="Slide-06" component={Slide06} width={1920} height={1080} />
        <Still id="Slide-07" component={Slide07} width={1920} height={1080} />
        <Still id="Slide-08" component={Slide08} width={1920} height={1080} />
        <Still id="Slide-09" component={Slide09} width={1920} height={1080} />
        <Still id="Slide-10" component={Slide10} width={1920} height={1080} />
        <Still id="Slide-11" component={Slide11} width={1920} height={1080} />
        <Still id="Slide-12" component={Slide12} width={1920} height={1080} />
      </Folder>

      {/* Product mockups — one template, generated for every screen. */}
      <Folder name="Mockups">
        {PHONE_MOCKUPS.map((m) => (
          <React.Fragment key={m.id}>
            <Still id={`Screen-${m.id}`} component={ScreenOnly} {...SCREEN_ONLY_SIZE} defaultProps={{ id: m.id }} />
            <Still id={`Framed-${m.id}`} component={FramedPhone} {...FRAMED_SIZE} defaultProps={{ id: m.id }} />
            <Still id={`Showcase-${m.id}`} component={PhoneShowcase} width={1920} height={1080} defaultProps={{ id: m.id }} />
          </React.Fragment>
        ))}
        <Still id="Framed-success-android" component={FramedPhone} {...FRAMED_SIZE} defaultProps={{ id: "success", variant: "android" }} />
        <Still id="Screen-admin" component={AdminOnly} width={1440} height={900} defaultProps={{ ready: false }} />
        <Still id="Showcase-admin" component={AdminShowcase} width={1920} height={1080} defaultProps={{ ready: false }} />
        <Still id="Showcase-admin-ready" component={AdminShowcase} width={1920} height={1080} defaultProps={{ ready: true }} />
      </Folder>
    </>
  );
};
