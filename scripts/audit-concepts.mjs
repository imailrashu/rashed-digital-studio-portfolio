import { chromium } from "playwright";

const baseUrl = process.env.AUDIT_URL ?? "http://127.0.0.1:4173";
const pages = [
  { name: "Portfolio", route: "/" },
  { name: "Style Check", route: "/concepts/style-check/index.html" },
  { name: "Fitness", route: "/concepts/fitness/index.html" },
  { name: "Local Service", route: "/concepts/local-service/index.html" },
  { name: "Conversion Landing", route: "/concepts/conversion-landing/index.html" },
];
const viewports = [
  { name: "320x700", width: 320, height: 700 },
  { name: "390x844", width: 390, height: 844 },
  { name: "768x1024", width: 768, height: 1024 },
  { name: "1440x900", width: 1440, height: 900 },
];

const browser = await chromium.launch({ headless: true });
const results = [];

for (const target of pages) {
  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 1,
      hasTouch: viewport.width <= 390,
      reducedMotion: "reduce",
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
    page.on("response", (response) => {
      if (response.status() >= 400) {
        failedResources.push(`${response.status()} ${response.url()}`);
      }
    });

    await page.goto(`${baseUrl}${target.route}`, {
      waitUntil: "networkidle",
      timeout: 45_000,
    });
    const scrollTargets = page.locator("main > section, .portfolio-project, footer");
    for (let index = 0; index < (await scrollTargets.count()); index += 1) {
      await scrollTargets.nth(index).scrollIntoViewIfNeeded();
      await page.waitForTimeout(40);
    }
    await page.evaluate(() => window.scrollTo(0, 0));

    const metrics = await page.evaluate(() => {
      const viewportWidth = window.innerWidth;
      const visible = (element) => {
        if (element.closest("details:not([open])")) return false;
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return (
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          Number(style.opacity) !== 0 &&
          rect.width > 0 &&
          rect.height > 0
        );
      };
      const clipped = (element) => {
        const rect = element.getBoundingClientRect();
        return rect.left < -1 || rect.right > viewportWidth + 1;
      };
      const describe = (element) =>
        element.getAttribute("aria-label") ||
        element.textContent?.trim().replace(/\s+/g, " ").slice(0, 90) ||
        element.tagName.toLowerCase();

      return {
        innerWidth: viewportWidth,
        innerHeight: window.innerHeight,
        scrollWidth: document.documentElement.scrollWidth,
        horizontalOverflow: document.documentElement.scrollWidth > viewportWidth,
        brokenImages: [...document.images]
          .filter((image) => image.complete && image.naturalWidth === 0)
          .map((image) => image.currentSrc || image.src),
        clippedHeadings: [...document.querySelectorAll("h1, h2, h3")]
          .filter(visible)
          .filter(clipped)
          .map(describe),
        clippedControls: [
          ...document.querySelectorAll("a, button, input, select, textarea, summary"),
        ]
          .filter(visible)
          .filter(clipped)
          .map(describe),
        blankBody: document.body.innerText.trim().length === 0,
        errorOverlay: Boolean(document.querySelector(".vite-error-overlay")),
        sectionCount: document.querySelectorAll("main > section").length,
      };
    });

    let mobileMenu = "not-applicable";
    if (viewport.width <= 390) {
      const menuButton = page.locator(".menu-button, .mobile-menu-button").first();
      if (await menuButton.isVisible()) {
        await menuButton.click();
        await page.waitForTimeout(120);
        const expanded = (await menuButton.getAttribute("aria-expanded")) === "true";
        const menu = page.locator(".mobile-nav").first();
        const menuVisible = await menu.isVisible();
        const firstInternal = menu.locator("a[href^='#']").first();
        if (await firstInternal.count()) {
          await firstInternal.click();
          await page.waitForTimeout(50);
        }
        const closed = (await menuButton.getAttribute("aria-expanded")) === "false";
        mobileMenu = expanded && menuVisible && closed ? "pass" : "fail";
      }
    }

    const majorProblems = [
      ...metrics.brokenImages.map((item) => `broken image: ${item}`),
      ...metrics.clippedHeadings.map((item) => `clipped heading: ${item}`),
      ...metrics.clippedControls.map((item) => `clipped control: ${item}`),
    ];
    if (metrics.blankBody) majorProblems.push("blank body");
    if (metrics.errorOverlay) majorProblems.push("Vite error overlay");
    if (mobileMenu === "fail") majorProblems.push("mobile menu failed");

    results.push({
      page: target.name,
      viewport: viewport.name,
      horizontalOverflow: metrics.horizontalOverflow,
      consoleErrors: [...new Set(consoleErrors)],
      failedResources: [...new Set(failedResources)],
      mobileMenu,
      majorProblems,
      dimensions: `${metrics.scrollWidth}/${metrics.innerWidth} × ${metrics.innerHeight}`,
      sections: metrics.sectionCount,
    });

    await context.close();
  }
}

const portfolioContext = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: "reduce",
});
const portfolioPage = await portfolioContext.newPage();
await portfolioPage.goto(baseUrl, { waitUntil: "networkidle" });
await portfolioPage.locator("#work").scrollIntoViewIfNeeded();
const projectCards = portfolioPage.locator(".portfolio-project");
for (let index = 0; index < (await projectCards.count()); index += 1) {
  await projectCards.nth(index).scrollIntoViewIfNeeded();
  await portfolioPage.waitForTimeout(100);
}
await portfolioPage.waitForFunction(
  () =>
    [...document.querySelectorAll(".mockup-project-image")].every(
      (image) => image.complete && image.naturalWidth > 0,
    ),
  undefined,
  { timeout: 10_000 },
);

const portfolioIntegration = await portfolioPage.evaluate(() => ({
  titles: [...document.querySelectorAll(".portfolio-project h3")].map((heading) =>
    heading.textContent.trim(),
  ),
  slugs: [...document.querySelectorAll(".portfolio-project")].map((card) =>
    card.getAttribute("data-project-slug"),
  ),
  mockupModes: [...document.querySelectorAll(".project-mockup")].map((mockup) =>
    mockup.getAttribute("data-mockup-mode"),
  ),
  screenshotImages: [...document.querySelectorAll(".mockup-project-image")].map((image) => ({
    src: image.getAttribute("src"),
    naturalWidth: image.naturalWidth,
    naturalHeight: image.naturalHeight,
  })),
  demoLinks: [...document.querySelectorAll(".project-demo-link")].map((link) => ({
    href: link.getAttribute("href"),
    target: link.getAttribute("target"),
  })),
  proofHeading: document.querySelector("#proof-heading")?.textContent.trim().replace(/\s+/g, " "),
  testimonialCards: document.querySelectorAll(".testimonial-card").length,
  proofCards: document.querySelectorAll(".proof-card").length,
}));

const caseStudyCounts = [];
for (const details of await portfolioPage.locator(".project-details").all()) {
  await details.locator("summary").click();
  caseStudyCounts.push(await details.locator(".project-case-study-grid > div").count());
}
portfolioIntegration.caseStudyCounts = caseStudyCounts;

await portfolioContext.close();

const interactionContext = await browser.newContext({
  viewport: { width: 390, height: 844 },
  reducedMotion: "reduce",
  hasTouch: true,
});
const interactions = {};

const fitnessPage = await interactionContext.newPage();
await fitnessPage.goto(`${baseUrl}/concepts/fitness/index.html`, { waitUntil: "networkidle" });
const initialFitnessClass = await fitnessPage.locator("[data-schedule] h3").first().textContent();
await fitnessPage.locator("[data-day='tue']").click();
interactions.fitnessSchedule =
  (await fitnessPage.locator("[data-schedule] h3").first().textContent()) !== initialFitnessClass;
await fitnessPage.locator("input[name='name']").fill("Concept audit");
await fitnessPage.locator("input[name='email']").fill("audit@example.com");
await fitnessPage.locator("[data-demo-form] button[type='submit']").click();
interactions.fitnessForm = await fitnessPage.locator(".form-status").evaluate((status) =>
  status.textContent.includes("no information was sent"),
);
await fitnessPage.close();

const localPage = await interactionContext.newPage();
await localPage.goto(`${baseUrl}/concepts/local-service/index.html`, { waitUntil: "networkidle" });
const firstFaq = localPage.locator(".faq-list details").first();
await firstFaq.locator("summary").click();
interactions.localFaq = await firstFaq.evaluate((details) => details.open);
await localPage.locator("input[name='name']").fill("Concept audit");
await localPage.locator("input[name='email']").fill("audit@example.com");
await localPage.locator("textarea[name='message']").fill("Testing the local concept form.");
await localPage.locator("[data-demo-form] button[type='submit']").click();
interactions.localForm = await localPage.locator(".form-status").evaluate((status) =>
  status.textContent.includes("no details were transmitted"),
);
await localPage.close();

const productPage = await interactionContext.newPage();
await productPage.goto(`${baseUrl}/concepts/conversion-landing/index.html`, { waitUntil: "networkidle" });
await productPage.locator("[data-flow-next]").click();
interactions.productWorkflow = (await productPage.locator("[data-flow-current]").textContent()) === "02";
await productPage.locator("[data-billing='annual']").click();
interactions.productPricing = (await productPage.locator("[data-price]").first().textContent()) === "Annual demo";
await productPage.close();

await interactionContext.close();
await browser.close();

console.log(JSON.stringify({ results, portfolioIntegration, interactions }, null, 2));
