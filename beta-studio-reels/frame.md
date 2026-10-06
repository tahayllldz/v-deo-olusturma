---
version: 1
name: Beta Studio — Reels Frame System
description: >
  Video-first design system for Beta Studio Instagram Reels (1080×1920, 9:16), matched to the
  official Beta Studio logo: a navy-black stage, an iridescent "B" mark (electric blue → violet →
  magenta → orange) and a white, widely tracked wordmark. Education scenes use a warm "paper"
  canvas; the logo's navy stage carries hot takes, night scenes and every end card. One cobalt
  signal color marks the answer, a red pen marks the problem, and three type voices speak
  (statement / human aside / system). Exact brand hex codes were not supplied: the values below
  are matched to the logo and live in components/beta.css — replace them there if official codes exist.
unit: the frame — 1080×1920 portrait (Instagram Reels)
principle: atoms are sacred · composition is free · every number on screen is illustrative, never a claimed statistic

colors:
  paper: "#F2F0EB"          # warm canvas (light theme bg)
  paper-2: "#E6E3DC"        # card / panel on paper
  paper-3: "#D6D2C8"        # hairlines on paper
  ink: "#0A0C16"            # the logo's navy-black stage (text on paper, dark theme bg)
  ink-2: "#161A2B"          # panel on ink
  ink-3: "#262B42"          # hairlines on ink
  muted: "#575A6B"          # secondary text on paper (6.0:1)
  muted-on-ink: "#9FA3B8"   # secondary text on ink (7.8:1)
  signal: "#4045E6"         # electric blue-violet from the B mark — "the answer" (5.7:1 on paper)
  signal-deep: "#2B2DB8"    # signal surfaces carrying paper text (8.5:1)
  signal-on-ink: "#A3A8FF"  # signal as text on ink (8.9:1)
  redpen: "#C9331D"         # "the problem" — annotations, strikes (4.6:1 on paper)
  redpen-on-ink: "#FF6A50"
  ok: "#0F7542"             # success states inside synthetic UI only
  ok-on-ink: "#4CD38A"
  iris: "linear-gradient(115deg, #4C6BFF, #8B5CF6 38%, #E05FC4 70%, #FF8A4C)"  # the B mark — shapes only (caret, tag dot, ticks, glow), never text

typography:
  hook:      { fontFamily: "Bricolage Grotesque", px: 128-150, weight: 800, lineHeight: 0.94, tracking: "-0.035em", role: "the statement voice — hooks, payoffs" }
  headline:  { fontFamily: "Bricolage Grotesque", px: 84-104, weight: 750, lineHeight: 1.0, tracking: "-0.03em" }
  support:   { fontFamily: "Bricolage Grotesque", px: 52-60, weight: 500, lineHeight: 1.12, tracking: "-0.015em" }
  aside:     { fontFamily: "Instrument Serif", style: italic, px: "same as the line it sits in × 1.08", weight: 400, role: "the human voice — one emphasized word per frame (güven, çalışan, sonuç)" }
  label:     { fontFamily: "JetBrains Mono", px: 28-34, weight: 700, tracking: "0.04em", upper: true, role: "the system voice — series tags, step numbers, UI metadata" }
  data:      { fontFamily: "JetBrains Mono", px: 40-220, weight: 700, numeric: tabular-nums }
  ui:        { fontFamily: "Bricolage Grotesque", px: 26-44, weight: 400-700, role: "text inside synthetic UI mockups" }

spacing:
  safe-top: "250px"       # Instagram Reels header
  safe-bottom: "420px"    # caption, handle, audio row
  safe-left: "72px"
  safe-right: "150px"     # like / comment / share rail
  gutter: "72px"

radii:
  pill: "999px"
  card: "28px"
  device: "64px"
  chip: "16px"

components:
  beta-caret: "Iridescent block caret (the B mark's gradient). Blinks after every payoff and after BETA on the end card. The brand's motion signature: always in beta, always improving."
  series-tag: "Top-left mono pill: ● SERIES NAME · NN, with chapter ticks that fill as the story moves (hook / problem / solution / payoff)."
  handle: "Top-right mono '@betastudio.cy' — the only always-on branding."
  red-pen: "Hand-drawn SVG circles, underlines, strikes and scribbles in redpen. Only ever marks a problem."
  cobalt-ruler: "Straight cobalt guides, brackets and check marks. Only ever marks a fix."
  end-card: "≤ 2 s on the logo's navy stage. Official logo file (assets/logo.png|svg) when present, otherwise a typographic BETA / STUDIO stand-in — the mark is never redrawn. 'Digital Growth & Technology Studio', @betastudio.cy. Never a long ad card."
---

# Beta Studio — Frame System

## Concept angle

**Beta Studio speaks like a sharp friend at a whiteboard:** warm paper, confident ink, a red pen that circles what's broken and one cobalt line that shows the fix — and every video lands on the logo's own navy stage. The motion signature is the **Beta caret** — a blinking cursor in the B mark's iridescent gradient that closes every payoff and the end card, because a good digital business is never finished: it is always in beta.

## Three themes, one system

| Theme | Background | Text | Use for |
|---|---|---|---|
| `paper` | paper | ink | Education, before/after (default) |
| `signal` | signal-deep | paper | Psychology, data stories |
| `ink` | ink (logo stage) | paper | AI, hot takes, "night" scenes, payoffs, end cards |

A video may switch theme once, on a hard cut, to mark the turn from problem to answer.

## Type voices

- **Statement** (Bricolage Grotesque 800) carries the hook. Hero lines fill 60–80 % of the frame width.
- **Human aside** (Instrument Serif italic) is used for exactly one emphasized word or phrase per frame. It is the warmth in the system.
- **System** (JetBrains Mono, uppercase, tracked) labels things: series, steps, UI metadata, numbers.

Never pair two sans-serifs in the same frame outside a diegetic UI mockup.

## Readability (3-metre rule)

On a phone the main message must be readable from across a room: hooks ≥ 120 px, support ≥ 52 px, labels ≥ 28 px. One idea per frame, ≤ 7 words in the hero line. A line on screen for 2 s must be readable in 1.

## Safe area

Main content lives in `x 72–930, y 250–1500`. The bottom 420 px is covered by the Instagram caption/handle/audio row and the right 150 px by the action rail.

## Do / Don't

- Do: real-looking synthetic UI, specific scenes ("Cuma 20:30"), one accent hit per frame.
- Do: red pen = problem, cobalt = answer. Never swap them.
- Don't: gradient text, neon glows, stock-photo people, pure #000/#fff. The iridescent gradient is the brand mark — use it only on small shapes (caret, dot, ticks) and soft background glows.
- Don't: real third-party logos or screenshots without permission — build synthetic UI.
- Don't: invent statistics. Mock counters inside mock UI are illustrative and must look it.
- Don't: show the logo loudly. Branding = caret + tag + handle + end card.
