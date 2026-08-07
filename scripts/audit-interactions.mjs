import { chromium } from "playwright";

const baseUrl = process.env.AUDIT_URL ?? "http://127.0.0.1:4173";
const browser = await chromium.launch({ headless: true });

const runInteractionAudit = async () => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    hasTouch: true,
    isMobile: true,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const consoleErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => consoleErrors.push(error.message));

  await page.addInitScript(() => {
    window.__auditExternalClicks = [];
    window.__auditWindowOpen = null;
    window.open = (...args) => {
      window.__auditWindowOpen = args;
      return null;
    };
    document.addEventListener(
      "click",
      (event) => {
        const target = event.target;
        const anchor = target instanceof Element ? target.closest("a") : null;
        if (!anchor) return;
        const isExternalHttp =
          (anchor.protocol === "http:" || anchor.protocol === "https:") &&
          anchor.origin !== window.location.origin;
        if (isExternalHttp || anchor.protocol === "mailto:") {
          window.__auditExternalClicks.push(anchor.href);
          event.preventDefault();
        }
      },
      true,
    );
  });

  await page.goto(baseUrl, { waitUntil: "networkidle" });
  const checks = {};

  const menuButton = page.locator(".mobile-menu-button");
  await menuButton.click();
  checks.mobileMenuOpens =
    (await menuButton.getAttribute("aria-expanded")) === "true" &&
    (await page.locator(".mobile-nav").isVisible());

  const navTargets = await page.locator(".mobile-nav a[href^='#']").evaluateAll((anchors) =>
    anchors.map((anchor) => ({
      href: anchor.getAttribute("href"),
      targetExists: Boolean(document.querySelector(anchor.getAttribute("href"))),
    })),
  );
  checks.navTargets = navTargets;
  checks.allNavTargetsExist = navTargets.every((item) => item.targetExists);

  await page.locator(".mobile-nav a[href='#work']").click();
  await page.waitForTimeout(100);
  checks.mobileNavWork =
    new URL(page.url()).hash === "#work" && !(await page.locator(".mobile-nav").count());

  await page.locator("#home .primary-cta").click();
  await page.waitForTimeout(100);
  checks.viewSelectedWork = new URL(page.url()).hash === "#work";

  await page.locator("#home .secondary-cta").click();
  checks.startYourProject = (await page.evaluate(() => window.__auditExternalClicks.at(-1)))?.startsWith("https://wa.me/") ?? false;

  await page.locator(".hero-linkedin").click();
  checks.linkedIn = (await page.evaluate(() => window.__auditExternalClicks.at(-1)))?.includes("linkedin.com") ?? false;

  const directLinks = page.locator(".contact-direct a");
  await directLinks.nth(0).click();
  checks.whatsApp = (await page.evaluate(() => window.__auditExternalClicks.at(-1)))?.startsWith("https://wa.me/") ?? false;
  await directLinks.nth(1).click();
  checks.calendly = (await page.evaluate(() => window.__auditExternalClicks.at(-1)))?.includes("calendly.com") ?? false;
  await directLinks.nth(2).click();
  checks.email = (await page.evaluate(() => window.__auditExternalClicks.at(-1)))?.startsWith("mailto:") ?? false;

  const firstFaq = page.locator(".faq-item").first();
  await firstFaq.locator("summary").click();
  checks.faqOpens = await firstFaq.evaluate((details) => details.open);
  await firstFaq.locator("summary").click();
  checks.faqCloses = !(await firstFaq.evaluate((details) => details.open));

  await page.locator("input[name='name']").fill("Automated Audit");
  await page.locator("input[name='business']").fill("Portfolio QA");
  await page.locator("input[name='email']").fill("audit@example.com");
  await page.locator("input[name='phone']").fill("+91 9000000000");
  await page.locator("select[name='websiteType']").selectOption({ label: "Business Website" });
  await page.locator("select[name='budget']").selectOption({ label: "Need guidance" });
  await page.locator("select[name='timeline']").selectOption({ label: "Flexible" });
  await page.locator("textarea[name='message']").fill("Testing the generated WhatsApp enquiry without sending it.");
  await page.locator(".contact-submit").click();
  await page.waitForTimeout(100);
  const generatedWindowOpen = await page.evaluate(() => window.__auditWindowOpen);
  checks.contactFormWhatsApp = Boolean(
    generatedWindowOpen?.[0]?.startsWith("https://wa.me/") &&
    decodeURIComponent(generatedWindowOpen[0]).includes("Automated Audit") &&
    decodeURIComponent(generatedWindowOpen[0]).includes("Business Website"),
  );
  checks.contactSuccessMessage = await page.locator(".contact-success").isVisible();

  await page.locator(".footer-bottom a[href='#home']").click();
  await page.waitForTimeout(1000);
  checks.backToTopScrollY = await page.evaluate(() => window.scrollY);
  checks.backToTop = new URL(page.url()).hash === "#home" && checks.backToTopScrollY < 200;
  checks.consoleErrors = [...new Set(consoleErrors)];

  await context.close();
  return checks;
};

const runAnimationAudit = async (width, height) => {
  const isPhone = width <= 430;
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
    hasTouch: isPhone,
    isMobile: isPhone,
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();
  const consoleErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => consoleErrors.push(error.message));

  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.waitForTimeout(300);
  const sceneAtHero = await page.locator(".particle-scene").getAttribute("data-render-mode");
  const quality = await page.locator(".particle-scene").getAttribute("data-quality");
  const mobilePinSpacers = await page.locator(".pin-spacer").count();

  await page.locator("#contact").scrollIntoViewIfNeeded();
  await page.waitForTimeout(350);
  const sceneOffscreen = await page.locator(".particle-scene").getAttribute("data-render-mode");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);

  await context.close();
  return {
    viewport: `${width}x${height}`,
    quality,
    sceneAtHero,
    sceneOffscreen,
    pinSpacers: mobilePinSpacers,
    horizontalOverflow: overflow,
    consoleErrors: [...new Set(consoleErrors)],
  };
};

const interactions = await runInteractionAudit();
const animations = [
  await runAnimationAudit(390, 844),
  await runAnimationAudit(1440, 900),
];

await browser.close();
console.log(JSON.stringify({ interactions, animations }, null, 2));
