// Exports the deck to PDF (one 1920x1080 page per slide) and to per-slide PNGs.
// Usage: node scripts/export-pdf.mjs
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import { mkdirSync } from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const deck = pathToFileURL(path.join(root, "presentation/index.html")).href;
const outDir = path.join(root, "exports");
mkdirSync(path.join(outDir, "slides"), { recursive: true });

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
await page.goto(deck, { waitUntil: "networkidle" });
await page.emulateMedia({ media: "print" });
await page.evaluate(async () => {
  await document.fonts.ready;
  await Promise.all(
    [...document.images].map((img) => (img.complete ? null : new Promise((r) => img.addEventListener("load", r, { once: true })))),
  );
});

await page.pdf({
  path: path.join(outDir, "NAGA-VIP-Sunum.pdf"),
  width: "1920px",
  height: "1080px",
  printBackground: true,
  preferCSSPageSize: true,
});
console.log("✓ exports/NAGA-VIP-Sunum.pdf");

const slides = page.locator(".slide");
const n = await slides.count();
for (let i = 0; i < n; i++) {
  const file = `slide-${String(i + 1).padStart(2, "0")}.png`;
  await slides.nth(i).screenshot({ path: path.join(outDir, "slides", file) });
  console.log("✓ exports/slides/" + file);
}
await browser.close();
