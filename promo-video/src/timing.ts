/**
 * One clock for picture and music.
 *
 * Music: "The Upbeat Inspiring Corporate" (Pixabay #142313, bundled with
 * AKCodez/promo-video-skill), 110 BPM. Its light intro gives way to the full
 * arrangement (kick on every beat) at 18.54 s of the track. The track is
 * trimmed so that entrance lands on DROP, the moment the website appears.
 * Every later cue sits on that beat grid.
 */
export const FPS = 30;
export const DURATION = 18; // seconds
export const BPM = 110;
export const BEAT = 60 / BPM; // 0.545 s

export const MUSIC_FILE = 'music/the-upbeat-inspiring-corporate-142313.mp3';
export const MUSIC_DROP_IN_TRACK = 18.54; // seconds into the track
export const DROP = 3; // seconds into the video: the website reveal
export const MUSIC_START_IN_TRACK = MUSIC_DROP_IN_TRACK - DROP;

/** Seconds on the video timeline of beat k (beat 0 = the drop). */
export const beat = (k: number) => DROP + k * BEAT;

/** Scene boundaries (seconds): 0–3 opening, 3–12.8 website (reveal + services), 12.8–18 closing. */
export const OPENING_END = DROP;
export const SERVICES_START = beat(9); // 7.91 s
export const CLOSING_START = beat(18); // 12.82 s

export const toFrames = (seconds: number, fps: number) => Math.round(seconds * fps);
