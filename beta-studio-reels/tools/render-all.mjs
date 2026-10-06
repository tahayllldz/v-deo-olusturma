#!/usr/bin/env node
// Sync → check → render → verify every reel (or the ones matching a filter).
//
//   node tools/render-all.mjs                       # all reels, delivery quality → renders/
//   node tools/render-all.mjs reel-02               # only reel-02
//   node tools/render-all.mjs --quality draft       # fast preview renders → renders/draft/
//   node tools/render-all.mjs --ab                  # also render A/B hook variants → renders/ab/
//   node tools/render-all.mjs --skip-check
//
// CLI: uses `npx --yes hyperframes@0.8.137` (the version every project pins).
// Override with HF_CLI="..." (e.g. the Claude Code plugin launcher).
import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const flag = (n) => args.includes(n);
const opt = (n, d) => {
  const i = args.indexOf(n);
  return i >= 0 ? args[i + 1] : d;
};
const quality = opt("--quality", "delivery");
const filter = args.find((a, i) => !a.startsWith("--") && args[i - 1] !== "--quality");
const HF = (process.env.HF_CLI || "npx --yes hyperframes@0.8.137").split(" ");
const outDir = join(ROOT, "renders", quality === "delivery" ? "" : quality);
mkdirSync(outDir, { recursive: true });

const run = (cmd, argv, cwd) => {
  const r = spawnSync(cmd, argv, { cwd, encoding: "utf8", shell: process.platform === "win32" });
  return { code: r.status, out: (r.stdout || "") + (r.stderr || "") };
};
const hf = (argv, cwd) => run(HF[0], [...HF.slice(1), ...argv], cwd);

const reels = readdirSync(join(ROOT, "compositions"))
  .filter((d) => existsSync(join(ROOT, "compositions", d, "hyperframes.json")))
  .filter((d) => !filter || d.includes(filter))
  .sort();

console.log(`sync → ${run("node", [join(ROOT, "tools", "sync-system.mjs")], ROOT).code === 0 ? "ok" : "FAILED"}`);
const report = [];
for (const reel of reels) {
  const dir = join(ROOT, "compositions", reel);
  if (!flag("--skip-check")) {
    const c = hf(["check", "--caption-zone", "x0=0;y0=0.79;x1=1;y1=1;severity=warning"], dir);
    const passed = /Check passed/.test(c.out);
    console.log(`${reel}: check ${passed ? "passed" : "FAILED"}`);
    if (!passed) {
      console.log(c.out.split("\n").slice(-25).join("\n"));
      report.push({ reel, ok: false, stage: "check" });
      continue;
    }
  }
  // the composition's default hook variant renders identically to the main file → copy it
  const html = readFileSync(join(dir, "index.html"), "utf8").replace(/&quot;/g, '"');
  const defVariant = (html.match(/"id"\s*:\s*"hookVariant"[^}]*?"default"\s*:\s*"(\w+)"/) || [])[1];
  let mainOut = null;
  const jobs = [{ name: reel, vars: null }];
  if (flag("--ab")) {
    jobs.push({ name: `${reel}-A`, vars: { hookVariant: "A" }, sub: "ab" });
    jobs.push({ name: `${reel}-B`, vars: { hookVariant: "B" }, sub: "ab" });
  }
  for (const job of jobs) {
    const target = job.sub ? join(outDir, job.sub) : outDir;
    mkdirSync(target, { recursive: true });
    const out = join(target, `${job.name}.mp4`);
    const argv = ["render", "--quality", quality, "--output", out];
    if (job.vars) argv.push("--variables", JSON.stringify(job.vars));
    const t0 = Date.now();
    let r = { code: 0, out: "" };
    if (job.vars && mainOut && job.vars.hookVariant === defVariant) copyFileSync(mainOut, out);
    else r = hf(argv, dir);
    const ok = r.code === 0 && existsSync(out) && statSync(out).size > 0;
    const probe = ok ? run("ffprobe", ["-v", "error", "-show_entries", "format=duration:stream=codec_name,width,height", "-of", "json", out]).out : "{}";
    let meta = {};
    try {
      meta = JSON.parse(probe);
    } catch {}
    const loud = ok ? run("ffmpeg", ["-hide_banner", "-i", out, "-af", "ebur128=peak=true", "-f", "null", "-"]).out : "";
    const lufs = (loud.match(/I:\s+(-?[\d.]+) LUFS/g) || []).pop() || "";
    const peak = (loud.match(/Peak:\s+(-?[\d.]+) dBFS/g) || []).pop() || "";
    const row = {
      file: relative(ROOT, out),
      ok,
      seconds: ((Date.now() - t0) / 1000).toFixed(1),
      duration: meta.format ? Number(meta.format.duration).toFixed(3) : null,
      size_mb: ok ? (statSync(out).size / 1048576).toFixed(2) : null,
      video: meta.streams ? meta.streams.filter((s) => s.width).map((s) => `${s.codec_name} ${s.width}x${s.height}`)[0] : null,
      audio: meta.streams ? meta.streams.filter((s) => !s.width).map((s) => s.codec_name)[0] : null,
      loudness: lufs.replace(/\s+/g, " ").trim(),
      peak: peak.replace(/\s+/g, " ").trim(),
    };
    report.push(row);
    if (!job.vars && ok) mainOut = out;
    console.log(`${job.name}: ${ok ? "rendered" : "FAILED"} ${JSON.stringify(row)}`);
    if (!ok) console.log(r.out.split("\n").slice(-20).join("\n"));
  }
}
writeFileSync(join(outDir, "render-report.json"), JSON.stringify(report, null, 2));
const failed = report.filter((r) => !r.ok).length;
console.log(failed ? `${failed} failure(s)` : `all ${report.length} render(s) ok → ${relative(ROOT, outDir) || "renders"}/`);
process.exit(failed ? 1 : 0);
