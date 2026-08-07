import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "playwright";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const projects = [
  {
    name: "A to Z Interior",
    url: "https://azharatozinterior.com",
    outputDirectory: "atoz-interior",
  },
  {
    name: "FlowPilot AI Agency",
    url: "https://flowpilotdemo.netlify.app",
    outputDirectory: "flowpilot",
  },
];

const formats = [
  {
    name: "desktop",
    context: {
      viewport: { width: 1440, height: 900 },
      screen: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
    },
  },
  {
    name: "mobile",
    context: {
      viewport: { width: 390, height: 844 },
      screen: { width: 390, height: 844 },
      deviceScaleFactor: 1,
      isMobile: true,
      hasTouch: true,
    },
  },
];

async function waitForPageAssets(page) {
  await page.waitForLoadState("domcontentloaded");

  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {
    console.warn("  WARN network did not become idle; continuing after asset checks");
  });

  const assetsSettled = await page
    .evaluate(async () =>
      Promise.race([
        (async () => {
          if (document.fonts) {
            await document.fonts.ready;
          }

          const images = [...document.images];
          await Promise.all(
            images.map((image) => {
              if (image.complete) {
                return image.decode?.().catch(() => undefined);
              }

              return new Promise((done) => {
                image.addEventListener("load", done, { once: true });
                image.addEventListener("error", done, { once: true });
              });
            }),
          );

          return true;
        })(),
        new Promise((resolveAssetWait) => {
          window.setTimeout(() => resolveAssetWait(false), 10_000);
        }),
      ]),
    )
    .catch(() => {
      console.warn("  WARN some page assets did not settle; continuing safely");
      return false;
    });

  if (!assetsSettled) {
    console.warn("  WARN asset wait timed out; capturing the settled viewport");
  }

  await page.evaluate(() => window.scrollTo({ top: 0, left: 0, behavior: "instant" }));
  await page.waitForTimeout(750);
}

async function captureScreenshot(browser, project, format) {
  const outputPath = resolve(
    projectRoot,
    "public",
    "projects",
    project.outputDirectory,
    `${format.name}.png`,
  );

  let context;

  try {
    await mkdir(dirname(outputPath), { recursive: true });

    context = await browser.newContext({
      ...format.context,
      colorScheme: "dark",
      reducedMotion: "no-preference",
    });

    const page = await context.newPage();
    page.setDefaultTimeout(30_000);

    await page.goto(project.url, {
      waitUntil: "domcontentloaded",
      timeout: 60_000,
    });
    await waitForPageAssets(page);
    await page.screenshot({ path: outputPath, fullPage: false });

    console.log(`SUCCESS ${project.name} ${format.name}: ${outputPath}`);
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`FAILED ${project.name} ${format.name}: ${message}`);
    return false;
  } finally {
    await context?.close().catch(() => undefined);
  }
}

let browser;
let allScreenshotsSucceeded = true;

try {
  browser = await chromium.launch({ headless: true });

  for (const project of projects) {
    for (const format of formats) {
      const succeeded = await captureScreenshot(browser, project, format);
      allScreenshotsSucceeded &&= succeeded;
    }
  }

  if (!allScreenshotsSucceeded) {
    process.exitCode = 1;
  }
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`FAILED Chromium launch: ${message}`);
  process.exitCode = 1;
} finally {
  await browser?.close().catch(() => undefined);
}
