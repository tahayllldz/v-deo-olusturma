#!/usr/bin/env node
// Render a template with a content file → renders/templates/<template>--<content>.mp4
//
//   npm run template -- a content/example.json
//   npm run template -- b content/ornek-restoran-menu.json --variant B
//   npm run template -- d my-numbers.json --quality draft --check
//   npm run template -- c content/example.json --out renders/onceki-sonraki.mp4
//
// <template>: a | b | c | d | e, or a folder name under templates/.
// <content>:  absolute, relative to the current folder, or relative to the template folder.
// --variant A|B   force the hook variant (overrides the content file)
// --quality       draft | looks | delivery (default: delivery)
// --check         run `hyperframes check` with these variables' defaults first
//
// CLI: `npx --yes hyperframes@0.8.137` (override with HF_CLI="...").
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync, rmSync } from "node:fs";
import { basename, dirname, isAbsolute, join, relative, resolve } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const opt = (n, d) => {
  const i = args.indexOf(n);
  return i >= 0 ? args[i + 1] : d;
};
const positional = args.filter((a, i) => !a.startsWith("--") && !["--variant", "--quality", "--out"].includes(args[i - 1]));
const [which, contentArg = "content/example.json"] = positional;
const HF = (process.env.HF_CLI || "npx --yes hyperframes@0.8.137").split(" ");
const run = (cmd, argv, cwd, inherit) =>
  spawnSync(cmd, argv, { cwd, encoding: "utf8", stdio: inherit ? "inherit" : "pipe", shell: process.platform === "win32" });
const hf = (argv, cwd, inherit) => run(HF[0], [...HF.slice(1), ...argv], cwd, inherit);
const die = (m) => {
  console.error(m);
  process.exit(1);
};

const templates = readdirSync(join(ROOT, "templates")).filter((d) => existsSync(join(ROOT, "templates", d, "hyperframes.json")));
if (!which) die(`usage: npm run template -- <${templates.map((t) => t.split("-")[1]).join("|")}> [content.json] [--variant A|B] [--quality draft]`);
const tpl = templates.find((t) => t === which || t === `template-${which}` || t.startsWith(`template-${which}-`));
if (!tpl) die(`unknown template "${which}" — available: ${templates.join(", ")}`);
const dir = join(ROOT, "templates", tpl);

const content = [resolve(contentArg), join(dir, contentArg)].find((p) => isAbsolute(p) && existsSync(p));
if (!content) die(`content file not found: ${contentArg} (looked in ./ and templates/${tpl}/)`);
let vars;
try {
  vars = JSON.parse(readFileSync(content, "utf8"));
} catch (e) {
  die(`${content} is not valid JSON: ${e.message}`);
}
if (opt("--variant")) vars.hookVariant = String(opt("--variant")).toUpperCase();

console.log(`template ${tpl} · content ${relative(ROOT, content)}${vars.hookVariant ? ` · hook ${vars.hookVariant}` : ""}`);
if (run("node", [join(ROOT, "tools", "sync-system.mjs"), tpl], ROOT).status !== 0) die("sync failed");

const tmp = join(tmpdir(), `bs-vars-${process.pid}.json`);
writeFileSync(tmp, JSON.stringify(vars));
try {
  if (args.includes("--check")) {
    const c = hf(["check", "--caption-zone", "x0=0;y0=0.79;x1=1;y1=1;severity=warning"], dir);
    const out = (c.stdout || "") + (c.stderr || "");
    console.log(/Check passed/.test(out) ? "check passed (template defaults)" : out.split("\n").slice(-25).join("\n"));
  }
  const name = `${tpl}--${basename(content, ".json")}${opt("--variant") ? "-" + vars.hookVariant : ""}`;
  const out = resolve(opt("--out", join(ROOT, "renders", "templates", `${name}.mp4`)));
  mkdirSync(dirname(out), { recursive: true });
  const r = hf(["render", "--quality", opt("--quality", "delivery"), "--variables-file", tmp, "--strict-variables", "--output", out], dir, true);
  if (r.status !== 0 || !existsSync(out) || statSync(out).size === 0) die("render failed");
  console.log(`✓ ${relative(process.cwd(), out)}`);
} finally {
  rmSync(tmp, { force: true });
}
