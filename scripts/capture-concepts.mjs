import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const baseUrl = process.env.CONCEPT_BASE_URL ?? "http://127.0.0.1:4173";
const projectRoot = process.cwd();

const concepts = [
  {
    name: "Style Check Family Salon",
    route: "/concepts/style-check/index.html",
    output: "style-check",
  },
  {
    name: "Premium Fitness Experience",
    route: "/concepts/fitness/index.html",
    output: "fitness",
  },
  {
    name: "Local Service Growth",
    route: "/concepts/local-service/index.html",
    output: "local-service",
  },
  {
    name: "Premium Conversion Landing Page",
    route: "/concepts/conversion-landing/index.html",
    output: "landing-page",
  },
];

const sizes = [
  { file: "desktop.png", width: 1440, height: 900, mobile: false },
  { file: "mobile.png", width: 390, height: 844, mobile: true },
];

const browser = await chromium.launch({ headless: true });
const results = [];

for (const concept of concepts) {
  const outputDirectory = path.join(
    projectRoot,
    "public",
    "projects",
    concept.output,
  );
  await mkdir(outputDirectory, { recursive: true });

  for (const size of sizes) {
    const context = await browser.newContext({
      viewport: { width: size.width, height: size.height },
      deviceScaleFactor: 1,
      hasTouch: size.mobile,
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    const errors = [];

    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("requestfailed", (request) => {
      errors.push(`${request.url()} — ${request.failure()?.errorText ?? "failed"}`);
    });

    const filePath = path.join(outputDirectory, size.file);

    try {
      await page.goto(`${baseUrl}${concept.route}`, {
        waitUntil: "networkidle",
        timeout: 45_000,
      });
      await page.waitForFunction(
        () => [...document.images].every((image) => image.complete),
        null,
        { timeout: 20_000 },
      );
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(350);
      await page.screenshot({
        path: filePath,
        fullPage: false,
        animations: "disabled",
      });

      const dimensions = await page.evaluate(() => ({
        width: window.innerWidth,
        height: window.innerHeight,
        scrollWidth: document.documentElement.scrollWidth,
        brokenImages: [...document.images]
          .filter((image) => image.naturalWidth === 0)
          .map((image) => image.src),
      }));

      const succeeded =
        errors.length === 0 &&
        dimensions.brokenImages.length === 0 &&
        dimensions.width === size.width &&
        dimensions.height === size.height &&
        dimensions.scrollWidth <= dimensions.width;

      results.push({
        concept: concept.name,
        screenshot: size.file,
        status: succeeded ? "SUCCESS" : "FAILED",
        filePath,
        errors,
        dimensions,
      });
      console.log(
        `${succeeded ? "SUCCESS" : "FAILED"}: ${concept.name} ${size.file}`,
      );
    } catch (error) {
      results.push({
        concept: concept.name,
        screenshot: size.file,
        status: "FAILED",
        filePath,
        errors: [...errors, error instanceof Error ? error.message : String(error)],
      });
      console.log(`FAILED: ${concept.name} ${size.file}`);
    } finally {
      await context.close();
    }
  }
}

await browser.close();
console.log(JSON.stringify(results, null, 2));
