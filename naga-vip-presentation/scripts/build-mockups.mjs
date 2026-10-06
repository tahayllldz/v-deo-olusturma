// Renders every mockup source page in mockups/src to PNG files in mockups/.
// Usage: node scripts/build-mockups.mjs [name-filter]
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const src = (f) => pathToFileURL(path.join(root, "mockups/src", f)).href;
const out = (f) => path.join(root, "mockups", f);

// transparent: phone shots keep their soft shadow on a transparent background so the
// slides can place them on any colour.
const SHOTS = [
  { page: "phones.html", sel: "#phone-home", file: "01-phone-home.png", scale: 3, transparent: true },
  { page: "phones.html", sel: "#phone-reservation", file: "02-phone-reservation.png", scale: 3, transparent: true },
  { page: "phones.html", sel: "#phone-confirmation", file: "03-phone-confirmation.png", scale: 3, transparent: true },
  { page: "phones.html", sel: "#phone-rate-alert", file: "04-phone-rate-alert-phase2.png", scale: 3, transparent: true },
  { page: "admin.html", sel: "#admin", file: "05-admin-dashboard.png", scale: 2, transparent: true },
  { page: "admin.html", sel: "#admin-detail", file: "06-admin-reservation-1042.png", scale: 2, transparent: true },
  { page: "before-after.html", sel: "#before-after", file: "07-before-after.png", scale: 2, transparent: false },
  { page: "journey.html", sel: "#journey", file: "08-customer-journey.png", scale: 2, transparent: false },
  { page: "system.html", sel: "#system", file: "09-system-architecture.png", scale: 2, transparent: false },
];

const filter = process.argv[2];
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const pages = new Map();
for (const s of SHOTS) {
  if (filter && !s.file.includes(filter) && !s.page.includes(filter)) continue;
  const key = `${s.page}@${s.scale}`;
  let page = pages.get(key);
  if (!page) {
    page = await browser.newPage({ viewport: { width: 2400, height: 1400 }, deviceScaleFactor: s.scale });
    await page.goto(src(s.page), { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    pages.set(key, page);
  }
  await page.locator(s.sel).screenshot({ path: out(s.file), omitBackground: s.transparent });
  console.log("✓", s.file);
}
await browser.close();
