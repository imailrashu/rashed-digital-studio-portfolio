import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const baseUrl = process.env.AUDIT_URL ?? "http://127.0.0.1:4173";
const outputDir = process.env.AUDIT_OUTPUT_DIR;

const viewports = [
  { name: "320x700", width: 320, height: 700 },
  { name: "360x800", width: 360, height: 800 },
  { name: "375x812", width: 375, height: 812 },
  { name: "390x844", width: 390, height: 844, screenshot: true },
  { name: "430x932", width: 430, height: 932 },
  { name: "768x1024", width: 768, height: 1024, screenshot: true },
  { name: "1024x1366", width: 1024, height: 1366 },
  { name: "1280x800", width: 1280, height: 800 },
  { name: "1440x900", width: 1440, height: 900, screenshot: true },
  { name: "1920x1080", width: 1920, height: 1080 },
];

const browser = await chromium.launch({ headless: true });
const results = [];

if (outputDir) {
  await mkdir(outputDir, { recursive: true });
}

for (const viewport of viewports) {
  const isPhone = viewport.width <= 430;
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 1,
    hasTouch: isPhone,
    isMobile: isPhone,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const consoleErrors = [];
  const failedResources = [];

  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });
  page.on("pageerror", (error) => consoleErrors.push(error.message));
  page.on("requestfailed", (request) => {
    failedResources.push(`${request.method()} ${request.url()} — ${request.failure()?.errorText ?? "failed"}`);
  });
  page.on("response", (response) => {
    if (response.status() >= 400) {
      failedResources.push(`${response.status()} ${response.url()}`);
    }
  });

  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.waitForSelector("main");

  const scrollTargets = page.locator(
    ".announcement-bar, .site-header, main > section, .site-footer",
  );
  for (let index = 0; index < (await scrollTargets.count()); index += 1) {
    await scrollTargets.nth(index).scrollIntoViewIfNeeded();
    await page.waitForTimeout(50);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(150);

  const metrics = await page.evaluate(() => {
    const viewportWidth = window.innerWidth;
    const isVisible = (element) => {
      if (element.closest("details:not([open])")) return false;
      const style = window.getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        Number(style.opacity) !== 0 &&
        rect.width > 0 &&
        rect.height > 0
      );
    };
    const isOutside = (rect) => rect.left < -1 || rect.right > viewportWidth + 1;
    const describe = (element) =>
      element.getAttribute("aria-label") ||
      element.textContent?.trim().replace(/\s+/g, " ").slice(0, 90) ||
      element.tagName.toLowerCase();

    const clippedHeadings = [...document.querySelectorAll("h1, h2, h3")]
      .filter(isVisible)
      .filter((element) => {
        const rect = element.getBoundingClientRect();
        return isOutside(rect) || element.scrollWidth > element.clientWidth + 1;
      })
      .map(describe);

    const clippedControls = [
      ...document.querySelectorAll("a, button, input, select, textarea, summary"),
    ]
      .filter(isVisible)
      .filter((element) => isOutside(element.getBoundingClientRect()))
      .map(describe);

    const smallTouchTargets = [
      ...document.querySelectorAll("a, button, summary, input, select, textarea"),
    ]
      .filter(isVisible)
      .filter((element) => {
        const rect = element.getBoundingClientRect();
        return rect.width < 40 || rect.height < 40;
      })
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return `${describe(element)} (${Math.round(rect.width)}x${Math.round(rect.height)})`;
      });

    const projectCardProblems = [...document.querySelectorAll(".portfolio-project")]
      .filter(isVisible)
      .filter((element) => isOutside(element.getBoundingClientRect()))
      .map(describe);

    const formFieldProblems = [...document.querySelectorAll(".contact-form-shell input, .contact-form-shell select, .contact-form-shell textarea")]
      .filter(isVisible)
      .filter((element) => isOutside(element.getBoundingClientRect()))
      .map(describe);

    const brokenImages = [...document.images]
      .filter((image) => image.complete && image.naturalWidth === 0)
      .map((image) => image.currentSrc || image.src);

    const projectImages = [...document.querySelectorAll(".mockup-project-image")].map((image) => ({
      src: image.getAttribute("src"),
      loading: image.getAttribute("loading"),
      width: image.getAttribute("width"),
      height: image.getAttribute("height"),
    }));

    return {
      width: viewportWidth,
      scrollWidth: document.documentElement.scrollWidth,
      horizontalOverflow: document.documentElement.scrollWidth > viewportWidth,
      clippedHeadings,
      clippedControls,
      smallTouchTargets,
      projectCardProblems,
      formFieldProblems,
      brokenImages,
      projectCount: document.querySelectorAll(".portfolio-project").length,
      faqCount: document.querySelectorAll(".faq-item").length,
      mainSectionCount: document.querySelectorAll("main > section").length,
      mobileMenuButton: Boolean(document.querySelector(".mobile-menu-button")),
      pinSpacerCount: document.querySelectorAll(".pin-spacer").length,
      projectImages,
      particleQuality: document.querySelector(".particle-scene")?.getAttribute("data-quality") ?? null,
      particleRenderMode: document.querySelector(".particle-scene")?.getAttribute("data-render-mode") ?? "fallback",
    };
  });

  const majorLayoutProblems = [
    ...metrics.clippedHeadings.map((item) => `clipped heading: ${item}`),
    ...metrics.clippedControls.map((item) => `clipped control: ${item}`),
    ...metrics.projectCardProblems.map((item) => `project card outside viewport: ${item}`),
    ...metrics.formFieldProblems.map((item) => `form field outside viewport: ${item}`),
    ...metrics.brokenImages.map((item) => `broken image: ${item}`),
  ];

  if (viewport.screenshot && outputDir) {
    await page.screenshot({
      path: path.join(outputDir, `portfolio-audit-${viewport.name}.png`),
      fullPage: true,
      animations: "disabled",
    });
  }

  results.push({
    viewport: viewport.name,
    horizontalOverflow: metrics.horizontalOverflow,
    consoleErrors: [...new Set(consoleErrors)],
    failedResources: [...new Set(failedResources)],
    majorLayoutProblems,
    smallTouchTargets: metrics.smallTouchTargets,
    details: {
      documentWidth: `${metrics.scrollWidth}/${metrics.width}`,
      projects: metrics.projectCount,
      faqs: metrics.faqCount,
      mainSections: metrics.mainSectionCount,
      mobileMenuButton: metrics.mobileMenuButton,
      pinSpacers: metrics.pinSpacerCount,
      particleQuality: metrics.particleQuality,
      particleRenderModeWithReducedMotion: metrics.particleRenderMode,
      projectImages: metrics.projectImages,
    },
  });

  await context.close();
}

await browser.close();
console.log(JSON.stringify(results, null, 2));
