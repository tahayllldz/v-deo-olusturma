// Renders the promo in both formats and masters the audio.
//
//   node scripts/render-video.mjs              # landscape + portrait
//   node scripts/render-video.mjs landscape    # one format
//
// 1. Remotion renderMedia → promo-video/renders/*-raw.mp4  (H.264, CRF 16)
// 2. Audio mastering with Remotion's bundled ffmpeg (loudnorm −14 LUFS,
//    the usual target for Instagram/Reels/WhatsApp), +faststart
//    → exports/NAGA-VIP-Promo-1920x1080.mp4 / NAGA-VIP-Promo-1080x1920.mp4
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";
import { copyFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const promo = path.join(root, "promo-video");
const require = createRequire(path.join(promo, "package.json"));
const { bundle } = require("@remotion/bundler");
const { renderMedia, selectComposition } = require("@remotion/renderer");

const FORMATS = {
  landscape: { id: "Promo-Landscape", name: "NAGA-VIP-Promo-1920x1080" },
  portrait: { id: "Promo-Portrait", name: "NAGA-VIP-Promo-1080x1920" },
};
const which = process.argv[2] ? [process.argv[2]] : Object.keys(FORMATS);
const browserExecutable = process.env.REMOTION_CHROME ?? null;
const npx = process.platform === "win32" ? "npx.cmd" : "npx";

mkdirSync(path.join(promo, "renders"), { recursive: true });
mkdirSync(path.join(root, "exports"), { recursive: true });

console.log("Bundling…");
const serveUrl = await bundle({ entryPoint: path.join(promo, "src", "index.ts") });

for (const key of which) {
  const { id, name } = FORMATS[key];
  const composition = await selectComposition({ serveUrl, id, browserExecutable });
  const raw = path.join(promo, "renders", `${name}-raw.mp4`);
  const t0 = Date.now();
  let last = -1;
  await renderMedia({
    serveUrl,
    composition,
    codec: "h264",
    crf: 16,
    jpegQuality: 95,
    audioBitrate: "320k",
    pixelFormat: "yuv420p",
    outputLocation: raw,
    browserExecutable,
    onProgress: ({ progress }) => {
      const p = Math.floor(progress * 10);
      if (p !== last) {
        last = p;
        process.stdout.write(`  ${id}: ${p * 10}%\n`);
      }
    },
  });
  console.log(`  rendered ${path.relative(root, raw)} in ${((Date.now() - t0) / 1000).toFixed(0)}s`);

  const mastered = path.join(promo, "renders", `${name}.mp4`);
  execFileSync(
    npx,
    ["remotion", "ffmpeg", "-y", "-v", "error", "-i", raw, "-c:v", "copy", "-af", "loudnorm=I=-14:TP=-1.0:LRA=11", "-ar", "48000", "-c:a", "aac", "-b:a", "256k", "-movflags", "+faststart", mastered],
    { cwd: promo, stdio: "inherit", shell: process.platform === "win32" },
  );
  copyFileSync(mastered, path.join(root, "exports", `${name}.mp4`));
  console.log(`  ✓ exports/${name}.mp4`);
}
