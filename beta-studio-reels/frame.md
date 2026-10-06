---
version: 1
name: Beta Studio — Reels Frame System
description: >
  Video-first design system for Beta Studio Instagram Reels (1080×1920, 9:16). A warm
  "paper + ink" editorial canvas, one cobalt signal color that marks the answer, a red-pen
  color that marks the problem, and three type voices (statement / human aside / system).
  PLACEHOLDER BRAND VALUES: Beta Studio's official logo and brand colors were not supplied.
  Every color below is a working placeholder defined once in components/tokens.css — replace
  the hex values there (and here) with the official palette; nothing else needs to change.
unit: the frame — 1080×1920 portrait (Instagram Reels)
principle: atoms are sacred · composition is free · every number on screen is illustrative, never a claimed statistic

colors:
  paper: "#F3EEE5"          # warm canvas (light theme bg)
  paper-2: "#E8E1D4"        # card / panel on paper
  paper-3: "#D9D0C0"        # hairlines on paper
  ink: "#16130F"            # warm near-black (text on paper, dark theme bg)
  ink-2: "#26211B"          # panel on ink
  ink-3: "#3A332B"          # hairlines on ink
  muted: "#655C51"          # secondary text on paper (5.7:1)
  muted-on-ink: "#A69C8E"   # secondary text on ink (6.9:1)
  signal: "#2B47E8"         # PLACEHOLDER brand accent — "the answer" (5.7:1 on paper)
  signal-deep: "#1F35C4"    # signal surfaces carrying paper text (7.7:1)
  signal-on-ink: "#8E9DFF"  # signal as text on ink (7.4:1)
  redpen: "#C9331D"         # "the problem" — annotations, strikes (large text/shapes only)
  redpen-on-ink: "#FF6A50"
  ok: "#0F7542"             # success states inside synthetic UI only
  ok-on-ink: "#4CD38A"

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
  beta-caret: "Cobalt block caret (0.5em × 1em). Blinks before every hook and after the wordmark on the end card. The brand's motion signature: always in beta, always improving."
  series-tag: "Top-left mono pill: ● SERIES NAME · NN, with chapter ticks that fill as the story moves (hook / problem / solution / payoff)."
  handle: "Top-right mono '@betastudio.cy' — the only always-on branding."
  red-pen: "Hand-drawn SVG circles, underlines, strikes and scribbles in redpen. Only ever marks a problem."
  cobalt-ruler: "Straight cobalt guides, brackets and check marks. Only ever marks a fix."
  end-card: "≤ 2 s. Typed 'beta studio' wordmark + caret, 'Digital Growth & Technology Studio', @betastudio.cy. Never a long ad card."
---

# Beta Studio — Frame System

## Concept angle

**Beta Studio speaks like a sharp friend at a whiteboard:** warm paper, confident ink, a red pen that circles what's broken and one cobalt line that shows the fix. The motion signature is the **Beta caret** — a blinking cobalt cursor that "writes" every hook and closes every video, because a good digital business is never finished: it is always in beta.

## Three themes, one system

| Theme | Background | Text | Use for |
|---|---|---|---|
| `paper` | paper | ink | Education, before/after (default) |
| `signal` | signal-deep | paper | Psychology, data stories |
| `ink` | ink | paper | AI, hot takes, "night" scenes |

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
- Don't: gradient text, neon glows, purple-blue gradients, stock-photo people, pure #000/#fff.
- Don't: real third-party logos or screenshots without permission — build synthetic UI.
- Don't: invent statistics. Mock counters inside mock UI are illustrative and must look it.
- Don't: show the logo loudly. Branding = caret + tag + handle + end card.
