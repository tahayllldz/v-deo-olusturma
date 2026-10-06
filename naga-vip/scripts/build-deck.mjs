// Builds the owner presentation from the rendered slide PNGs.
//
//   node scripts/render-stills.mjs slides   # 1) render slides (3840×2160)
//   node scripts/build-deck.mjs             # 2) → exports/NAGA-VIP-Sunum.pdf + .pptx
//
// PPTX: one full-bleed, high-resolution image per slide (pixel-identical to the
// PDF on any machine, no font substitution), with Turkish speaker notes and
// alt text. Edit wording in promo-video/src/slides/Slides.tsx and re-run.
import { createRequire } from "node:module";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const require = createRequire(path.join(root, "promo-video", "package.json"));
const sharp = require("sharp");
const { PDFDocument } = require("pdf-lib");
const pptxgen = require("pptxgenjs");

const notes = JSON.parse(readFileSync(path.join(root, "presentation", "speaker-notes.json"), "utf8"));
const outDir = path.join(root, "exports");
mkdirSync(outDir, { recursive: true });

const jpegs = [];
for (const s of notes) {
  const png = path.join(root, "presentation", "slides", `slide-${String(s.n).padStart(2, "0")}.png`);
  jpegs.push(await sharp(png).jpeg({ quality: 90, chromaSubsampling: "4:4:4", mozjpeg: true }).toBuffer());
}

// PDF — 16:9 pages (13.333 × 7.5 in), images at 3840×2160.
const pdf = await PDFDocument.create();
pdf.setTitle("NAGA VIP — Ürün Konsepti");
pdf.setAuthor("Beta Studio");
pdf.setSubject("Naga Exchange İskele için müşteri deneyimi + rezervasyon sistemi konsepti");
for (const buf of jpegs) {
  const img = await pdf.embedJpg(buf);
  const page = pdf.addPage([960, 540]);
  page.drawImage(img, { x: 0, y: 0, width: 960, height: 540 });
}
writeFileSync(path.join(outDir, "NAGA-VIP-Sunum.pdf"), await pdf.save());
console.log("✓ exports/NAGA-VIP-Sunum.pdf");

// PPTX
const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.author = "Beta Studio";
pres.company = "Beta Studio";
pres.title = "NAGA VIP — Ürün Konsepti";
notes.forEach((s, i) => {
  const slide = pres.addSlide();
  slide.background = { color: "08080A" };
  slide.addImage({
    data: "image/jpeg;base64," + jpegs[i].toString("base64"),
    x: 0,
    y: 0,
    w: 13.333,
    h: 7.5,
    altText: s.title,
  });
  slide.addNotes(s.notes);
});
await pres.writeFile({ fileName: path.join(outDir, "NAGA-VIP-Sunum.pptx") });
console.log("✓ exports/NAGA-VIP-Sunum.pptx");
