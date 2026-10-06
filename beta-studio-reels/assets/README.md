# assets/

Shared brand assets, synced into every project as `system/assets/`.

## Official logo (required for final brand end cards)

Put the official Beta Studio logo here as **one** of:

- `logo.svg` (best), or
- `logo.png` (transparent background, ≥ 1600 px wide), or
- `logo.webp`

then run:

```bash
npm run sync          # writes system/brand.js → every end card switches to the logo
npm run render:all    # re-render the reels with the logo
```

If only the dark 9:16 render of the logo exists (navy stage + iridescent "B"),
crop it tightly around the mark + wordmark and save as `logo.png`; the end card
sits on the same navy stage (`--bs-ink: #0a0c16`) and feathers the image edges.

Without a logo file the end card shows a typographic "BETA / STUDIO" stand-in.
The mark itself is never redrawn.
