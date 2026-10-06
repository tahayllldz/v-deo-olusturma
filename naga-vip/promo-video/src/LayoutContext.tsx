import React, { createContext, useContext } from "react";
import { useVideoConfig } from "remotion";

// promo-video-skill multi-format pattern: one set of scenes, two formats.
type LayoutInfo = {
  width: number;
  height: number;
  isPortrait: boolean;
  /** Padding from frame edges — larger in portrait to stay clear of phone UI overlays. */
  padding: number;
  /** Multiplier for font sizes. */
  fontScale: number;
};

const LayoutContext = createContext<LayoutInfo | null>(null);

const make = (width: number, height: number): LayoutInfo => {
  const isPortrait = height > width;
  return {
    width,
    height,
    isPortrait,
    padding: isPortrait ? 80 : 120,
    fontScale: isPortrait ? 1.1 : 1,
  };
};

// Falls back to the composition size, so scenes also work when previewed on
// their own (connected compositions) without a provider.
export const useLayout = (): LayoutInfo => {
  const ctx = useContext(LayoutContext);
  const { width, height } = useVideoConfig();
  return ctx ?? make(width, height);
};

export const LayoutProvider: React.FC<{
  width: number;
  height: number;
  children: React.ReactNode;
}> = ({ width, height, children }) => (
  <LayoutContext.Provider value={make(width, height)}>{children}</LayoutContext.Provider>
);
