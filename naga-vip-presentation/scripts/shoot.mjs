// Screenshot an HTML file: node scripts/shoot.mjs <in.html> <out.png> <width> <height> [scale=2] [transparent=0] [selector]
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import path from "node:path";

const [inFile, outFile, w = "1920", h = "1080", scale = "2", transparent = "0", selector] = process.argv.slice(2);
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await browser.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: +scale });
await page.goto(pathToFileURL(path.resolve(inFile)).href, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
const opts = { path: outFile, omitBackground: transparent === "1" };
if (selector) await page.locator(selector).screenshot(opts);
else await page.screenshot({ ...opts, fullPage: false });
await browser.close();
console.log("wrote", outFile);
