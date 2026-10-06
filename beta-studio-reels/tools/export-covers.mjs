#!/usr/bin/env node
// Snapshot the covers project and write thumbnails/<reel>.png (1080×1920 PNG).
//   node tools/export-covers.mjs
// Uses `npx --yes hyperframes@0.8.137` unless HF_CLI is set.
import { spawnSync } from "node:child_process";
import { copyFileSync, mkdtempSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const HF = (process.env.HF_CLI || "npx --yes hyperframes@0.8.137").split(" ");
const NAMES = ["reel-01-website", "reel-02-social", "reel-03-ai", "reel-04-redesign", "reel-05-hot-take"];
spawnSync("node", [join(ROOT, "tools", "sync-system.mjs"), "covers"], { stdio: "inherit" });
const out = mkdtempSync(join(tmpdir(), "bs-covers-"));
const at = NAMES.map((_, i) => (i + 0.5).toFixed(1)).join(",");
const r = spawnSync(HF[0], [...HF.slice(1), "snapshot", "--at", at, "--no-end", "--output", out], {
  cwd: join(ROOT, "thumbnails", "covers"),
  stdio: "inherit",
  shell: process.platform === "win32",
});
if (r.status !== 0) process.exit(r.status || 1);
const frames = readdirSync(out).filter((f) => /^frame-\d+.*\.png$/.test(f)).sort();
frames.forEach((f, i) => {
  if (!NAMES[i]) return;
  copyFileSync(join(out, f), join(ROOT, "thumbnails", `${NAMES[i]}.png`));
  console.log(`thumbnails/${NAMES[i]}.png`);
});
