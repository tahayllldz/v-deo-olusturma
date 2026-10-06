// QC helper: renders selected frames of both promo formats to PNG contact sheets.
//   node scripts/qc-frames.mjs <outDir> 30,120,260 [Promo-Landscape,Promo-Portrait]
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const promo = path.resolve(here, "..", "promo-video");
const require = createRequire(path.join(promo, "package.json"));
const { bundle } = require("@remotion/bundler");
const { selectComposition, renderStill } = require("@remotion/renderer");

const outDir = process.argv[2];
const frames = process.argv[3].split(",").map(Number);
const ids = (process.argv[4] ?? "Promo-Landscape,Promo-Portrait").split(",");
const browserExecutable = process.env.REMOTION_CHROME ?? null;
mkdirSync(outDir, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.join(promo, "src", "index.ts") });
for (const id of ids) {
  const composition = await selectComposition({ serveUrl, id, browserExecutable });
  for (const frame of frames) {
    const output = path.join(outDir, `${id}-${String(frame).padStart(4, "0")}.png`);
    await renderStill({ serveUrl, composition, frame, output, browserExecutable, overwrite: true, scale: 0.5 });
    console.log("  ", path.basename(output));
  }
}
