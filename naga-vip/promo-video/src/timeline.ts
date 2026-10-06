// Single source of truth for promo timing (30 fps).
// Narrative: Demo First + Transformation (promo-video-skill templates 3 + 4).
//
// If you change scene durations, re-check the voiceover cue times in
// audio/voiceover-config.json:  npx tsx ../scripts/timing-calculator.ts --scenes "630,150,120,108,150" --transition 12 --fps 30

export const FPS = 30;
export const TRANSITION = 12; // 0.4 s gold swoosh between sections

export const SCENES = {
  flow: 630, // S1–S6  hook → app flow → confirmed (one continuous phone shot)
  admin: 150, // S7     Naga admin dashboard: NEW → PREPARING → READY
  arrival: 120, // S8   customer arrives, "your reservation is ready"
  message: 108, // S9   Daha hızlı. Daha kolay. Daha VIP.
  cta: 150, // S10      NAGA VIP — Müşteriniz gelsin. İşlemi hazır olsun.
} as const;

const order = ["flow", "admin", "arrival", "message", "cta"] as const;

/** Global start frame of each section (accounts for transition overlap). */
export const SCENE_START: Record<(typeof order)[number], number> = (() => {
  const out = {} as Record<(typeof order)[number], number>;
  let f = 0;
  for (const k of order) {
    out[k] = f;
    f += SCENES[k] - TRANSITION;
  }
  return out;
})();

export const TOTAL_FRAMES =
  Object.values(SCENES).reduce((a, b) => a + b, 0) - TRANSITION * (order.length - 1);

/** Beats inside the continuous customer-flow shot (local frames). */
export const FLOW = {
  hook1: 0, // "Müşteriniz gelmeden..."
  hook2: 84, // "...işlemi hazır olsun."
  homeIn: 112, // app opens
  tapCreate: 166,
  txIn: 180, // S3 — currency + amount
  keys: [204, 216, 228, 240, 252],
  receive: 290, // S4 — TRY amount appears
  tapContinue1: 364,
  branchIn: 378, // S5 — branch + time
  tapBranch: 402,
  tapTime: 434,
  tapContinue2: 478,
  confirmIn: 492, // S6 — summary → confirmed
  tapCreateRes: 538,
  successIn: 552,
  confirmed: 586,
} as const;

export const ADMIN = {
  toast: 22,
  cursorToRow: 40,
  clickRow: 60,
  cursorToPrepare: 74,
  clickPrepare: 90,
  cursorToReady: 100,
  clickReady: 116,
} as const;

export const ARRIVAL = { ready: 10, notification: 22 } as const;
export const MESSAGE = { lines: [8, 33, 56] } as const;
