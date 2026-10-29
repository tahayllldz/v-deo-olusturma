# Beta Studio — website launch reel

"Dijital evimiz yayında." An 18-second Instagram Reel announcing that the Beta Studio website is live.
Built with Remotion following the [`AKCodez/promo-video-skill`](https://github.com/AKCodez/promo-video-skill)
workflow and the official [`remotion-dev/skills`](https://github.com/remotion-dev/skills) rules.

| | |
| --- | --- |
| Output | `../video-output/beta-studio-website-launch-reel.mp4` |
| Format | 1080 × 1920 (9:16), 30 fps, 18.0 s, H.264 + AAC |
| Composition | `WebsiteLaunch-Reel` (scenes also registered standalone under `Scenes/`) |
| Language | Turkish, no voiceover (reads with the sound off) |

## Storyboard

| Time | Scene | On screen |
| --- | --- | --- |
| 0.0–3.0 | Opening | The supplied logo artwork lights up on black. "Yeni dijital adresimiz…" |
| 3.0–7.9 | Website | The browser rises on the music's drop while the real homepage loads inside it, then a gentle push. "Artık yayındayız." |
| 7.9–12.8 | Services | Closer on the site's services section, one chapter per three beats, each named above: Web Tasarım & Geliştirme · Sosyal Medya Danışmanlığı · Profesyonel Video Reklam |
| 12.8–18.0 | Closing | Lockup · "Markanızın dijital yolculuğu burada başlıyor." · **betastudiocy.com** (spectrum underline) · ŞİMDİ KEŞFEDİN ▶. The address appears at 15.0 s and stays for the last 3 s |

All cues sit on the music's beat grid (110 BPM, `src/timing.ts`).

## Where everything comes from

Nothing is invented. Every visual element is the brand's own:

- **Website footage:** a frame-by-frame recording of the production build of the website repo
  (`tahayllldz/beta-web`, default branch = Vercel production, commit `f532d14`), captured with that repo's own
  deterministic capture script (`remotion/scripts/capture-site.mjs`: virtual clock, cut-text guard). Shots `d-hero`
  and `d-svc` at 1440×900 CSS px, device scale 1.5. Guard results are in `public/site/*.capture.json`. The client-work
  section is never shown.
- **Logo:** the supplied crops from `BETA-STUDIO-BRAND-KIT` (`logo-artwork`, `logo-lockup`), used as is, with
  uniform scale only. Screen-blended on black, the same way the website composites them. No redraw, recolour or added glow.
- **Colours and easing:** `BRAND-TOKENS.json` plus the site's `globals.css` (`src/brand.ts`).
- **Type:** Archivo variable, the site's only typeface (same files as `@fontsource-variable/archivo` 5.3.0, SIL OFL 1.1,
  `public/fonts/OFL-archivo.txt`). Weights and widths follow the site's type scale.
- **Service names:** verbatim from the site's Turkish dictionary (`src/i18n/dictionaries/tr.ts`).
- **Brand devices:** the stage beam (final CTA section), the Ξ service bars, the ▶ pointer and the spectrum line are
  the website's own.
- **Music:** "The Upbeat Inspiring Corporate" (Pixabay #142313), one of the three tracks bundled with the
  promo-video skill, which lists them as royalty-free Pixabay music. The track is trimmed so its full arrangement
  enters at 3.0 s, on the website reveal. It fades in over 0.4 s and out over the last 1.8 s.

## Commands

```bash
npm install
npm run dev            # Remotion Studio preview
npm run render         # → ../video-output/beta-studio-website-launch-reel.mp4
```

Where Remotion cannot download its headless browser (restricted networks), point it at a local Chromium headless
shell:

```bash
REMOTION_BROWSER=/path/to/chrome-headless-shell npm run render
```

The website footage is stored as VP9 WebM, so any Chromium build can decode it, including ones without proprietary codecs.
Renders use a single browser tab (`remotion.config.ts`): parallel tabs decoding the footage stalled in a
software-rendered environment. A full render takes about 2–3 minutes.

### Re-capturing the website (after a site update)

From a checkout of the website repo:

```bash
npm ci && npm run build && npx next start -p 3200        # production build, locally
cd remotion && OUT=/tmp/clips node scripts/capture-site.mjs d-hero
cd remotion && OUT=/tmp/clips node scripts/capture-site.mjs d-svc
# then, for each shot (frames are 2160×1350 JPEGs):
ffmpeg -framerate 30 -i /tmp/clips/d-hero/%05d.jpg -c:v libvpx-vp9 -pix_fmt yuv420p -crf 18 -b:v 0 \
  -row-mt 1 public/site/website-hero.webm
cp /tmp/clips/d-hero.json public/site/website-hero.capture.json      # same for d-svc → website-services
```

The services scene reads the settled chapter holds from `website-services.capture.json`, so new captures need no code changes.

## Quality checks (final render)

| Check | Result |
| --- | --- |
| Container / video | MP4, H.264 High, 1080×1920, yuv420p, 30 fps, 540 frames (18.0 s) |
| Audio | AAC-LC, 48 kHz stereo. −16.6 LUFS integrated, peak −6.9 dBFS |
| Playback | Full decode with ffmpeg: no errors |
| Audio ends | Fades in from −31 dB. The full arrangement enters at 3.05 s on the website reveal. Fades out to −60 dB by 17.8 s, with no hard cut |
| Text | Turkish characters (ı, ş, ğ, İ, Ş) render correctly in Archivo in every line. No clipped text |
| Safe areas | All copy within x 80–930 and y 300–1310 (clear of the Reels top bar, right-hand buttons and caption area) |
| Logo | Supplied crops at uniform scale. No halo or box (checked at 2.5× brightness) |
| Last frame | Lockup, line, address and action. The address is on screen from 15.0 s to the end |

## Editing

- Timing and the beat grid: `src/timing.ts`. Scene-local cues are at the top of each scene file.
- Copy: the scene files (`src/scenes/*.tsx`). The domain is `DOMAIN` in `src/brand.ts`.
- Music level: `MUSIC_GAIN` in `src/Music.tsx`.

## Licences

- **Remotion** is free for individuals and companies of up to 3 people. Larger companies need a company licence:
  https://www.remotion.pro/license
- Archivo: SIL Open Font License 1.1.
- Music: Pixabay Content License according to the promo-video skill. Pixabay was not reachable from the build
  environment, so check the track page (pixabay.com, ID 142313) before using the reel in paid ads.

## Suggested Instagram caption

```
Yeni dijital adresimiz yayında. 🎉

Beta Studio'nun web sitesi artık yayında: web tasarım ve geliştirme, sosyal medya danışmanlığı ve profesyonel
video reklam, tek bir stüdyoda.

Keşfedin → betastudiocy.com

#BetaStudio #Gazimağusa #KuzeyKıbrıs #KKTC #WebTasarım #SosyalMedya #VideoReklam
```
