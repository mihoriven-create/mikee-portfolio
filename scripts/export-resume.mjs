// Prints the /resume page to the downloadable PDF in /public.
// Usage: start the site (`npm run build && npm run start`), then `npm run resume:pdf [url]`.
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const url = process.argv[2] ?? "http://localhost:3000/resume";
const output = fileURLToPath(new URL("../public/Michael-John-Buencamino-Resume.pdf", import.meta.url));

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
  await page.goto(url, { waitUntil: "networkidle0" });
  await page.evaluateHandle("document.fonts.ready");
  await page.pdf({ path: output, printBackground: true, preferCSSPageSize: true });
  console.log(`Saved ${output}`);
} finally {
  await browser.close();
}
