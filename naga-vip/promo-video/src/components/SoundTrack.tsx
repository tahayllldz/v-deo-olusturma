import React from "react";
import { Audio } from "@remotion/media";
import { interpolate, staticFile, useVideoConfig } from "remotion";
import timing from "../../public/audio/voiceover-timing.json";
import { SCENE_START, TOTAL_FRAMES } from "../timeline";
import { Sfx } from "./Sfx";

type Section = { id: string; start: number; end: number };
const sections = (timing.sections as Section[]) ?? [];

// Music sits at ~0.22 between lines and ducks to ~0.08 under the voice
// (promo-video-skill guideline: 0.08–0.12 relative to the voice).
const MUSIC_BED = 0.22;
const MUSIC_DUCKED = 0.08;

export const SoundTrack: React.FC = () => {
  const { fps } = useVideoConfig();

  const musicVolume = (f: number) => {
    const t = f / fps;
    let duck = 0;
    for (const s of sections) {
      duck = Math.max(duck, interpolate(t, [s.start - 0.25, s.start, s.end, s.end + 0.4], [0, 1, 1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }));
    }
    const fade = interpolate(f, [0, fps * 1.2, TOTAL_FRAMES - fps * 2.5, TOTAL_FRAMES - 2], [0, 1, 1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return (MUSIC_BED - (MUSIC_BED - MUSIC_DUCKED) * duck) * fade;
  };

  return (
    <>
      <Audio name="Music" src={staticFile("audio/music.mp3")} volume={musicVolume} premountFor={fps} />
      {timing.available ? (
        <Audio name="Voiceover" src={staticFile(timing.file)} volume={1} premountFor={fps} />
      ) : null}
      {/* swoosh between sections */}
      <Sfx name="whoosh" at={SCENE_START.admin - 2} volume={0.55} />
      <Sfx name="whoosh" at={SCENE_START.arrival - 2} volume={0.5} />
      <Sfx name="whoosh" at={SCENE_START.message - 2} volume={0.5} />
      <Sfx name="whoosh" at={SCENE_START.cta - 2} volume={0.55} />
    </>
  );
};
