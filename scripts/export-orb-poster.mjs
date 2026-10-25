// Renders the hero orb (from the real 3D scene) to public/orb-poster.webp with a transparent background.
// That picture is shown instantly while the live 3D scene downloads. Re-run it if the orb's look changes.
// Usage: `npm run build && npm run start` (leave running), then `npm run orb:poster [url]`.
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const url = process.argv[2] ?? "http://localhost:3000/?orb-poster";
const output = fileURLToPath(new URL("../public/orb-poster.webp", import.meta.url));

// The page is laid out at a reference size, and the orb sits at a known spot (see .orb-poster in globals.css):
// centred horizontally, 8.5% of the hero's height below the middle, 6.4 orb-radii across (R = min(12.5% of height, 20% of width)).
const WIDTH = 1440;
const HEIGHT = 900;
const R = Math.min(0.125 * HEIGHT, 0.2 * WIDTH);
const SIZE = 6.4 * R;
const clip = { x: WIDTH / 2 - SIZE / 2, y: HEIGHT / 2 + 0.085 * HEIGHT - SIZE / 2, width: SIZE, height: SIZE };
const OUTPUT_PIXELS = 900;

const browsers = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
].filter(Boolean);
const executablePath = browsers.find((p) => existsSync(p));
if (!executablePath) {
  console.error("No Chrome or Edge found. Set CHROME_PATH to a Chromium-based browser.");
  process.exit(1);
}

const browser = await puppeteer.launch({ executablePath, headless: true });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: OUTPUT_PIXELS / SIZE });
  await page.goto(url, { waitUntil: "load" });
  await page.waitForSelector("#top canvas", { timeout: 20000 });
  // Keep only the canvas: transparent page, everything else hidden.
  await page.addStyleTag({
    content: "html,body,main,#top{background:transparent!important}body *{visibility:hidden!important}#top canvas{visibility:visible!important}",
  });
  await new Promise((r) => setTimeout(r, 3000));
  await page.screenshot({ path: output, type: "webp", quality: 78, omitBackground: true, clip });
  console.log(`Saved ${output}`);
} finally {
  await browser.close();
}
