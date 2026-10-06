import React from "react";
import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";
import { AbsoluteFill, interpolate } from "remotion";

// promo-video-skill "metallic swoosh" (crossfade + shine band, no clipPath),
// tinted gold for the Naga palette.
const GoldSwooshPresentation: React.FC<TransitionPresentationComponentProps<Record<string, never>>> = ({
  children,
  presentationDirection,
  presentationProgress,
}) => {
  const isEntering = presentationDirection === "entering";
  const pos = interpolate(presentationProgress, [0, 1], [-20, 120]);
  const opacity = isEntering
    ? interpolate(presentationProgress, [0, 0.4, 1], [0, 1, 1])
    : interpolate(presentationProgress, [0, 0.6, 1], [1, 1, 0]);

  return (
    <AbsoluteFill style={{ opacity }}>
      {children}
      {isEntering ? (
        <AbsoluteFill
          style={{
            background: `linear-gradient(105deg,
              transparent ${pos - 16}%,
              rgba(205,166,82,0.0) ${pos - 10}%,
              rgba(205,166,82,0.18) ${pos - 5}%,
              rgba(238,213,151,0.55) ${pos - 2}%,
              rgba(255,246,222,0.85) ${pos}%,
              rgba(238,213,151,0.55) ${pos + 2}%,
              rgba(205,166,82,0.18) ${pos + 5}%,
              rgba(205,166,82,0.0) ${pos + 10}%,
              transparent ${pos + 16}%)`,
            pointerEvents: "none",
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};

export const goldSwoosh = (): TransitionPresentation<Record<string, never>> => ({
  component: GoldSwooshPresentation,
  props: {},
});
