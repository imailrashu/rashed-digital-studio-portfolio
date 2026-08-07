import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const baseUrl = process.env.HERO_AUDIT_URL ?? "http://127.0.0.1:5173";
const outputDirectory = path.resolve("artifacts", "hero-audit");
const viewports = [
  { name: "320x700", width: 320, height: 700 },
  { name: "360x800", width: 360, height: 800 },
  { name: "390x844", width: 390, height: 844, screenshot: true },
  { name: "768x1024", width: 768, height: 1024 },
  { name: "960x1024", width: 960, height: 1024, screenshot: true },
  { name: "1024x768", width: 1024, height: 768 },
  { name: "1280x800", width: 1280, height: 800 },
  { name: "1440x900", width: 1440, height: 900, screenshot: true },
  { name: "1920x1080", width: 1920, height: 1080 },
];

const rectangle = (element) => {
  const bounds = element.getBoundingClientRect();
  return {
    left: bounds.left,
    top: bounds.top,
    right: bounds.right,
    bottom: bounds.bottom,
    width: bounds.width,
    height: bounds.height,
  };
};

const intersects = (first, second) =>
  first.left < second.right &&
  first.right > second.left &&
  first.top < second.bottom &&
  first.bottom > second.top;

await mkdir(outputDirectory, { recursive: true });

const browser = await chromium.launch({ headless: true });
const results = [];

for (const viewport of viewports) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 1,
    hasTouch: viewport.width < 1100,
  });
  const page = await context.newPage();
  const consoleErrors = [];
  const failedResources = [];

  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => consoleErrors.push(error.message));
  page.on("requestfailed", (request) => {
    failedResources.push(`${request.url()} — ${request.failure()?.errorText ?? "failed"}`);
  });

  await page.goto(baseUrl, { waitUntil: "networkidle", timeout: 45_000 });
  await page.waitForTimeout(1100);

  const metrics = await page.evaluate(
    ({ rectangleSource, intersectsSource }) => {
      const getRectangle = Function(`return (${rectangleSource})`)();
      const doIntersect = Function(`return (${intersectsSource})`)();
      const visible = (element) => {
        const styles = getComputedStyle(element);
        const bounds = element.getBoundingClientRect();
        return (
          styles.display !== "none" &&
          styles.visibility !== "hidden" &&
          Number(styles.opacity) > 0.05 &&
          bounds.width > 0 &&
          bounds.height > 0
        );
      };
      const hero = document.querySelector(".hero-section");
      const heading = document.querySelector(".hero-copy h1");
      const details = document.querySelector(".hero-details");
      const actions = document.querySelector(".hero-actions");
      const visual = document.querySelector(".hero-visual");
      const labels = [...document.querySelectorAll(".hero-float-label")].filter(visible);
      const protectedAreas = [heading, details, actions].filter(Boolean).map(getRectangle);
      const labelMetrics = labels.map((label) => {
        const bounds = getRectangle(label);
        return {
          label: label.querySelector("span")?.textContent?.trim() ?? "label",
          withinViewport:
            bounds.left >= 12 &&
            bounds.right <= window.innerWidth - 12 &&
            bounds.top >= 12 &&
            bounds.bottom <= window.innerHeight - 12,
          overlapsProtectedArea: protectedAreas.some((area) => doIntersect(bounds, area)),
        };
      });
      const actionBounds = actions ? getRectangle(actions) : null;
      const visualBounds = visual ? getRectangle(visual) : null;

      return {
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        heroHeight: hero?.getBoundingClientRect().height ?? 0,
        headlineWithinViewport: heading
          ? getRectangle(heading).right <= window.innerWidth + 1
          : false,
        labelMetrics,
        actionClear: actionBounds
          ? !labelMetrics.some((label) => label.overlapsProtectedArea)
          : false,
        visualVisibleHeight: visualBounds
          ? Math.max(0, Math.min(visualBounds.bottom, window.innerHeight) - Math.max(visualBounds.top, 0))
          : 0,
        visualHeight: visualBounds?.height ?? 0,
        hasCanvasOrFallback: Boolean(
          document.querySelector(".particle-scene canvas, .webgl-fallback"),
        ),
        errorOverlay: Boolean(document.querySelector(".vite-error-overlay")),
      };
    },
    { rectangleSource: rectangle.toString(), intersectsSource: intersects.toString() },
  );

  let mobileMenu = "not-applicable";
  if (viewport.width < 1100) {
    const menuButton = page.locator(".mobile-menu-button").first();
    if (await menuButton.isVisible()) {
      await menuButton.click();
      await page.waitForTimeout(100);
      const expanded = (await menuButton.getAttribute("aria-expanded")) === "true";
      const menu = page.locator(".mobile-nav").first();
      const visible = await menu.isVisible();
      await menuButton.click();
      mobileMenu = expanded && visible ? "pass" : "fail";
    }
  }

  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 0.8));
  await page.waitForTimeout(260);
  const scrolledLabelMetrics = await page.evaluate(() => {
    const intersects = (first, second) =>
      first.left < second.right &&
      first.right > second.left &&
      first.top < second.bottom &&
      first.bottom > second.top;
    const getRectangle = (element) => {
      const bounds = element.getBoundingClientRect();
      return {
        left: bounds.left,
        top: bounds.top,
        right: bounds.right,
        bottom: bounds.bottom,
      };
    };
    const visible = (element) => {
      const styles = getComputedStyle(element);
      const bounds = element.getBoundingClientRect();
      return (
        Number(styles.opacity) > 0.05 &&
        styles.display !== "none" &&
        bounds.width > 0 &&
        bounds.height > 0
      );
    };
    const actions = document.querySelector(".hero-actions");
    const actionBounds = actions ? getRectangle(actions) : null;

    return [...document.querySelectorAll(".hero-float-label")]
      .filter(visible)
      .map((label) => {
        const bounds = getRectangle(label);
        return {
          label: label.querySelector("span")?.textContent?.trim() ?? "label",
          withinViewport:
            bounds.left >= 12 &&
            bounds.right <= window.innerWidth - 12 &&
            bounds.top >= 12 &&
            bounds.bottom <= window.innerHeight - 12,
          overlapsCtas: actionBounds ? intersects(bounds, actionBounds) : false,
        };
      });
  });
  const scrollAnimationFunctional = await page.evaluate(
    () => !document.querySelector(".vite-error-overlay") && document.documentElement.scrollTop > 0,
  );
  await page.evaluate(() => window.scrollTo(0, 0));

  if (viewport.screenshot) {
    await page.screenshot({
      path: path.join(outputDirectory, `hero-${viewport.name}.png`),
      fullPage: false,
    });
  }

  results.push({
    viewport: viewport.name,
    horizontalOverflow: metrics.scrollWidth > metrics.innerWidth,
    consoleErrors: [...new Set(consoleErrors)],
    failedResources: [...new Set(failedResources)],
    mobileMenu,
    scrollAnimationFunctional,
    scrolledLabelMetrics,
    ...metrics,
  });
  await context.close();
}

await browser.close();
console.log(JSON.stringify({ outputDirectory, results }, null, 2));
