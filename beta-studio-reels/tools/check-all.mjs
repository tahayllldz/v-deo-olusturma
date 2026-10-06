#!/usr/bin/env node
// Sync, then lint + check every HyperFrames project (reels, templates, covers, gallery).
//
//   npm run check            # everything
//   npm run check -- reel-03 # only projects whose path contains "reel-03"
//
// The bottom 21 % of the frame (Instagram caption / audio row) is checked as a
// warning-level caption zone. CLI: `npx --yes hyperframes@0.8.137` (override with HF_CLI).
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const filter = process.argv.slice(2).find((a) => !a.startsWith("--"));
const HF = (process.env.HF_CLI || "npx --yes hyperframes@0.8.137").split(" ");
const run = (cmd, argv, cwd) => {
  const r = spawnSync(cmd, argv, { cwd, encoding: "utf8", shell: process.platform === "win32" });
  return { code: r.status, out: (r.stdout || "") + (r.stderr || "") };
};
const hf = (argv, cwd) => run(HF[0], [...HF.slice(1), ...argv], cwd);

const projects = [];
for (const base of ["compositions", "templates", "thumbnails", "components"]) {
  const abs = join(ROOT, base);
  if (!existsSync(abs)) continue;
  for (const d of readdirSync(abs)) {
    if (existsSync(join(abs, d, "hyperframes.json"))) projects.push(`${base}/${d}`);
  }
}
const list = projects.filter((p) => !filter || p.includes(filter)).sort();
if (run("node", [join(ROOT, "tools", "sync-system.mjs")], ROOT).code !== 0) process.exit(1);

let failed = 0;
for (const p of list) {
  const dir = join(ROOT, p);
  const lint = hf(["lint"], dir);
  const lintErr = (lint.out.match(/(\d+) errors?/) || [])[1];
  const check = hf(["check", "--caption-zone", "x0=0;y0=0.79;x1=1;y1=1;severity=warning"], dir);
  const ok = lint.code === 0 && /Check passed/.test(check.out);
  if (!ok) failed++;
  console.log(`${ok ? "✓" : "✗"} ${p}${lintErr && lintErr !== "0" ? ` (lint: ${lintErr} errors)` : ""}`);
  if (!ok) console.log(check.out.split("\n").slice(-20).join("\n"));
}
console.log(`\n${list.length - failed}/${list.length} projects passed`);
process.exit(failed ? 1 : 0);
