// Renders the Remotion <Still> compositions (product mockups + presentation slides).
//
//   node scripts/render-stills.mjs            # everything
//   node scripts/render-stills.mjs mockups    # only mockups
//   node scripts/render-stills.mjs slides     # only presentation slides
//   node scripts/render-stills.mjs Slide-05   # ids starting with "Slide-05"
//
// Set REMOTION_CHROME to use an installed Chrome/Chromium instead of the
// headless shell Remotion downloads on first run.
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const promo = path.join(root, "promo-video");
const require = createRequire(path.join(promo, "package.json"));
const { bundle } = require("@remotion/bundler");
const { getCompositions, renderStill } = require("@remotion/renderer");

const NAMES = {
  home: "01-home",
  transaction: "02-transaction",
  "branch-time": "03-branch-time",
  confirmation: "04-confirmation",
  success: "05-success",
  status: "06-reservation-status",
  admin: "07-admin-dashboard",
  "admin-ready": "08-admin-dashboard-ready",
  "success-android": "05-success-android",
};

const jobFor = (id) => {
  const [kind, ...rest] = id.split("-");
  const key = rest.join("-");
  const name = NAMES[key] ?? key;
  switch (kind) {
    case "Screen":
      return { out: path.join(root, "mockups", "screens", `${name}.png`), scale: key === "admin" ? 2 : 3, group: "mockups" };
    case "Framed":
      return { out: path.join(root, "mockups", "framed", `${name}.png`), scale: 2, group: "mockups" };
    case "Showcase":
      return { out: path.join(root, "mockups", "showcase", `${name}.png`), scale: 1, group: "mockups" };
    case "Slide":
      return { out: path.join(root, "presentation", "slides", `slide-${rest[0]}.png`), scale: 2, group: "slides" };
    default:
      return null;
  }
};

const filter = process.argv[2] ?? "all";
const browserExecutable = process.env.REMOTION_CHROME ?? null;

console.log("Bundling Remotion project…");
const serveUrl = await bundle({ entryPoint: path.join(promo, "src", "index.ts") });
const comps = await getCompositions(serveUrl, { browserExecutable });

const selected = comps
  .map((c) => ({ c, job: jobFor(c.id) }))
  .filter(({ job }) => job)
  .filter(({ c, job }) => filter === "all" || job.group === filter || c.id.startsWith(filter));

for (const { c, job } of selected) {
  mkdirSync(path.dirname(job.out), { recursive: true });
  await renderStill({
    serveUrl,
    composition: c,
    output: job.out,
    imageFormat: "png",
    scale: job.scale,
    browserExecutable,
    overwrite: true,
  });
  console.log(`  ✓ ${c.id} → ${path.relative(root, job.out)} (${c.width * job.scale}×${c.height * job.scale})`);
}
console.log(`Done: ${selected.length} stills.`);
