#!/usr/bin/env node
// Contact sheets from finished renders → previews/<name>.jpg (8 evenly spaced frames).
//
//   npm run previews              # renders/*.mp4 and renders/templates/*.mp4
//   npm run previews -- reel-02   # only matching files
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const filter = process.argv.slice(2).find((a) => !a.startsWith("--"));
const FRAMES = 8;
const out = join(ROOT, "previews");
mkdirSync(out, { recursive: true });

const files = ["renders", "renders/templates"]
  .filter((d) => existsSync(join(ROOT, d)))
  .flatMap((d) => readdirSync(join(ROOT, d)).filter((f) => f.endsWith(".mp4")).map((f) => join(ROOT, d, f)))
  .filter((f) => !filter || f.includes(filter));

for (const file of files) {
  const probe = spawnSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=nb_frames,r_frame_rate:format=duration", "-of", "json", file], { encoding: "utf8" });
  const info = JSON.parse(probe.stdout || "{}");
  const [num, den] = (info.streams?.[0]?.r_frame_rate || "30/1").split("/").map(Number);
  const fps = num / (den || 1);
  const dur = parseFloat(info.format?.duration || "0");
  if (!dur) continue;
  const picks = Array.from({ length: FRAMES }, (_, i) => Math.round(((dur * (i + 0.5)) / FRAMES) * fps));
  const select = picks.map((n) => `eq(n\\,${n})`).join("+");
  const name = basename(file, ".mp4");
  const target = join(out, `${name}.jpg`);
  const r = spawnSync(
    "ffmpeg",
    ["-loglevel", "error", "-y", "-i", file, "-vf", `select='${select}',scale=240:-1,tile=${FRAMES}x1:padding=6:color=0x1a1c26`, "-vsync", "0", "-frames:v", "1", "-q:v", "3", target],
    { encoding: "utf8" },
  );
  console.log(r.status === 0 ? `✓ previews/${name}.jpg` : `✗ ${name}: ${r.stderr}`);
}
