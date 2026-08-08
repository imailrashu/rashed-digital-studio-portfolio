# Client Demo System — Permanent Agent Rules

These instructions apply to this entire repository and to every prospect workspace created inside `prospects/`.

## Purpose

This repository is a reusable, evidence-first system for researching a prospective business, deciding whether it is worth targeting, building a truthful personalized demo when qualified, validating it, publishing a Preview Deployment, and preparing draft outreach for human review.

The system does not authorize automatic outreach, paid purchases, production releases, or fabricated claims.

## Required Prospect Workflow

Follow these stages in order. Do not skip the qualification gate.

1. Create a dedicated workspace under `prospects/<business-slug>/` using `scripts/new-prospect.ps1` when practical.
2. Research the business using current public sources.
3. Verify whether an official website exists and record the evidence and confidence level.
4. Record factual business information and every supporting source in the research files.
5. Audit the website or online presence and identify specific, evidence-backed problems.
6. Complete the qualification scorecard.
7. Build a demo only when the prospect is qualified, or when the user explicitly approves a manual-review prospect.
8. Create the prospect's structured business knowledge file before writing site copy or chatbot responses.
9. Design an original, premium, business-specific UI/UX system rather than mechanically reusing another prospect's design.
10. Build the demo in that prospect's `demo/site/` directory. Keep it isolated from other prospects.
11. Add the required on-site virtual assistant using local verified knowledge by default.
12. Validate content, responsiveness, accessibility, functionality, chatbot safety, performance, and browser behavior.
13. Run the demo project's lint, build, and test commands. Fix actual errors.
14. Commit only the intended prospect workspace and shared-system changes.
15. Push a non-production branch when appropriate and allow Vercel to create a Preview Deployment.
16. Verify the preview returns HTTP 200 and has no critical console errors or failed resources.
17. Complete `outreach/pricing-guide.md`, select and justify a prospect-specific commercial recommendation, and prepare the outreach/proposal package as drafts only.
18. Stop after the verified demo and outreach package are ready. Wait for the user's review.

## Research and Evidence Rules

- Use only truthful, publicly available business information.
- Research is time-sensitive: browse current public sources rather than relying on memory.
- Prefer first-party sources: the official website, verified business profile, official social profile, public directory entry controlled by the business, or public filings where relevant.
- Use independent sources only to corroborate identity, location, category, or other facts.
- Record the URL, source type, access date, and the exact fact supported in `research/source-log.md`.
- Distinguish clearly between:
  - **Verified fact** — directly supported by a cited public source.
  - **Reasonable observation** — visible in the current website or public profile.
  - **Inference** — a conclusion drawn from evidence; label it explicitly.
  - **Unknown** — not publicly verified; do not fill the gap with assumptions.
- Do not copy reviews or imply endorsements unless the user specifically requests lawful use and the attribution can be verified.
- Never invent testimonials, reviews, client names, statistics, awards, credentials, team members, years in business, pricing, results, certifications, or business outcomes.
- Do not present a concept or demo as the business's official website.

## Official Website Verification

Record one of these outcomes in `research/business-profile.md`:

- **Verified official website** — linked from a first-party profile or corroborated by at least two reliable identity signals.
- **Likely official website** — strong match, but ownership cannot be fully corroborated. State the uncertainty.
- **No official website found** — document the searches and sources checked; do not claim that no website exists anywhere.
- **Conflicting/unclear** — stop and request user review before building.

Check the domain, business name, location, public phone/email, social links, and brand identity for consistency. A search-result title alone is not proof of ownership.

## Qualification Gate

Use `audit/qualification-scorecard.md`. Score the prospect out of 100:

- Public identity and legitimacy: 15
- Website or online-presence gap: 25
- Clear customer-action opportunity: 20
- Sufficient truthful public content/assets: 15
- Fit for the studio's services: 15
- Responsible outreach readiness: 10

Decision bands:

- **65–100: Qualified** — a demo may be built.
- **50–64: Manual review** — stop and request approval before building.
- **0–49: Not qualified** — do not build a demo; report why.

An unavailable website alone does not make a prospect qualified. The audit must identify a specific, defensible opportunity without inventing business needs.

## Demo Website Rules

- Default to Vite, React, and TypeScript for a new demo unless the user requests another suitable stack.
- Keep each demo self-contained inside its prospect workspace.
- Personalize the information hierarchy, copy, calls to action, colors, and visual direction from verified public facts. Do not merely replace a logo in a generic template.
- Clearly identify the site as a private proposal/demo where appropriate. Do not imply it is already approved or owned by the prospect.
- Use only assets that are publicly usable, user-provided, properly licensed, or original. Record provenance in `demo/assets.md`.
- Do not use scraped personal photos, copyrighted material, or third-party logos beyond what is reasonably needed for a private, truthful demonstration.
- Never fabricate reviews, statistics, awards, results, team biographies, prices, availability, or integrations.
- Preserve factual uncertainty in the copy. Use neutral placeholders such as “Details to be confirmed” only in internal notes, not as deceptive public content.
- Make the demo responsive for mobile, tablet, and desktop.
- Use semantic HTML, keyboard-accessible controls, visible focus, meaningful alt text, sufficient contrast, and reduced-motion support.
- Avoid unnecessary dependencies, excessive WebGL, autoplay media, and performance-heavy animation.
- No paid services, domain purchases, DNS changes, external account creation, or production deployment without explicit user approval.

## Premium Business-Specific UI/UX

Every qualified demo must feel like a high-end custom website for that specific business category. The reusable starter provides architecture, accessibility, and chatbot behavior—not a visual design to copy unchanged.

- Analyze the category, local audience, decision journey, brand signals, and most useful customer action before choosing a visual language.
- Create an original interface with intentional spacing, typography, hierarchy, imagery, responsive composition, service presentation, and contact/booking actions.
- Build a polished hero and clear conversion path without overstating what the business offers.
- Use premium hover and focus states, restrained animation, mobile-first layout, accessible navigation, and touch-friendly controls.
- Add dark/light modes only when they genuinely support the business and can both be designed deliberately.
- Do not mechanically reuse the same layout, palette, imagery, typography, or motion system across unrelated prospects.

Category direction should be considered, then customized:

- **Salon / beauty:** elegant editorial hierarchy, tasteful neutral/cream/black/gold or verified brand colors, large licensed or approved beauty imagery, confirmed service menu, gallery when real assets exist, and clear booking/call/WhatsApp actions when verified.
- **Interior design:** architectural editorial composition, real project imagery, material-inspired palette, and generous whitespace.
- **Clinic / aesthetics:** clean clinical-luxury treatment, trustworthy typography, consultation hierarchy, and no unsupported medical claims.
- **Restaurant:** food-led hierarchy, verified menu information, reservations/order actions, and strong licensed or first-party imagery.
- **Local service:** trust-focused presentation, direct conversion path, and verified call/WhatsApp/contact actions.

Avoid generic purple AI gradients, excessive glassmorphism, fake luxury, clutter, unnecessary 3D, and animation that harms mobile usability or performance.

## Shared Business Knowledge

Every demo must use one structured business data module such as `src/data/business.ts` as the source of truth for both visible site content and chatbot answers.

The schema must support:

- `businessName`, `category`, `location`, and `address`;
- `phone`, `whatsapp`, `email`, `hours`, and `bookingUrl` when verified;
- verified `services`, `socialLinks`, and FAQs;
- `verifiedFacts` with source references;
- `unknownFacts` that must not be guessed;
- the virtual assistant name, persona, and safe fallback message;
- demo/proposal disclosure.

Optional or unknown fields must stay empty or `null`. Do not insert plausible-looking placeholder facts into a live demo. Add or change a business fact in the shared module first, then consume it in the page and chatbot to prevent inconsistencies.

## Required On-Site Virtual Assistant

Every qualified demo must include a polished, lightweight chatbot that clearly presents itself as a digital or virtual assistant for the prospect—not a human employee.

The assistant should help visitors understand verified services, find the location, ask common questions, navigate the site, and reach applicable contact, WhatsApp, booking, or quote actions. It may support conversion but must not pressure, mislead, or claim a successful booking without a real integration response.

Required UI behavior:

- floating launcher that remains reachable without covering primary navigation or CTAs;
- business-specific visual styling using the site's design tokens;
- business name and “Virtual assistant” or equivalent label in the header;
- conversation bubbles, labelled input, send control, and minimize/close control;
- only applicable quick actions, such as View Services, Book Appointment, WhatsApp, Call, Location, or Request Quote;
- responsive panel with mobile safe-area support and no horizontal overflow;
- keyboard operation, visible focus, `role="dialog"`, accessible labelling, Escape to close, focus moved into the chat when opened, and focus returned to the launcher when closed;
- restrained motion and reduced-motion support.

### Mode A — Local Knowledge (Required Default)

- Answer from the structured business data and deterministic intent matching.
- Work without OpenAI, Anthropic, another AI provider, paid service, external secret, or network request.
- Recognize natural variants for services, hours, contact, address, booking, pricing, WhatsApp, and general business questions.
- Use verified values only.
- If information is unavailable, say naturally that it is not confirmed and offer an applicable verified contact action.

Recommended fallback:

> I don't have that information confirmed yet. You can contact the team directly for the latest details.

### Mode B — Optional AI Adapter (Disabled by Default)

- Keep AI-provider logic behind a small adapter or server endpoint so it can be connected later without rewriting the UI.
- Never hard-code or commit an API key.
- Do not expose provider secrets through client-side `VITE_*` variables. A client variable may identify a non-secret server endpoint only.
- Do not enable, purchase, or call a paid AI service without explicit user approval.
- Any future AI endpoint must receive the verified knowledge scope, enforce the same unknown-information fallback, and preserve industry-specific safety rules.

### Persona and Safety

- Salon: friendly, concise, polished beauty receptionist.
- Interior studio: knowledgeable design coordinator.
- Clinic/aesthetics: professional front-desk assistant with no diagnosis, medical advice, treatment guarantee, or unsupported contraindication claim; route clinical questions to qualified staff.
- Restaurant: helpful menu/reservations assistant using verified menu and booking data.
- Local service: clear service coordinator focused on verified availability and contact routes.

Never fabricate prices, discounts, availability, hours, staff names, certifications, medical claims, awards, reviews, service details, booking confirmation, or branch information.

## Quality Gates

Before a preview is considered ready:

- Run the scripts actually provided by the demo project, including lint and build. Run tests when present.
- Fix real errors; do not suppress them merely to pass checks.
- Verify at minimum 390×844, 768×1024, and 1440×900. Add 320px and wide-desktop checks when the composition warrants it.
- Check navigation, calls to action, forms, menus, accordions, media, and reduced motion.
- Test chatbot opening, closing, Escape behavior, focus entry/return, input submission, local intent variants, applicable quick actions, and unknown-information fallback.
- Confirm chatbot answers match the shared business knowledge file and do not invent facts.
- At 390×844, 768×1024, and 1440×900, confirm the launcher is reachable, the panel fits the viewport, the input remains usable, and important navigation/CTAs are not covered.
- Confirm no horizontal overflow, clipped content, accidental blank gaps, or layout shift from missing image dimensions.
- Inspect browser console errors, page errors, failed requests, and 4xx/5xx resources.
- Verify all external URLs before including them.
- Use lazy loading for below-the-fold images and stable dimensions/aspect ratios.
- Complete `qa/qa-checklist.md` and `deployment/preview.md` with actual results. Never invent Lighthouse scores or test outcomes.

## Git and Vercel Rules

- Never commit secrets, tokens, credentials, `.env` files, `.vercel`, or private customer data.
- Use a descriptive non-production branch such as `demo/<business-slug>`.
- Do not force-push a production branch.
- Do not merge into `main` or another production branch without the user's explicit approval.
- Do not run `vercel --prod` for a prospect demo.
- Push a demo branch only when its research, qualification, build, and QA records are complete.
- Let the repository's GitHub/Vercel integration create a Preview Deployment when configured.
- If no Vercel integration exists, report that setup is needed; do not create or alter production infrastructure without approval.
- Verify the exact Preview Deployment, not only the local development server.
- Never delete a production branch, Vercel project, domain, or deployment.

## Outreach Safety

- Outreach files are drafts for the user's review. Add **DRAFT — NOT SENT** at the top.
- Do not send email, WhatsApp, SMS, social messages, forms, calendar invitations, or any other outreach automatically.
- Do not call the prospect or book a meeting.
- Do not claim the prospect requested the demo.
- Keep messages concise, respectful, personalized, and evidence-based.
- Avoid manipulative urgency, negative language, spam tactics, or exaggerated promises.
- Mention only observations that can be demonstrated publicly.
- Provide a clear reason for contact and a low-pressure next step.
- Stop and wait for the user's explicit review after the demo and outreach drafts are ready.

## Commercial Offer and Pricing Rules

Keep the commercial offer separate from the prospect's demo website:

- **Client demo website:** must look entirely like the prospect's possible future business website. Do not place Rashed Digital Studio pricing, payment milestones, package comparisons, founding-client copy, or agency sales terms inside the demo unless the user explicitly requests it.
- **Outreach / proposal:** contains the personalized audit, service packages, recommendation, pricing, payment milestones, optional retainers, commercial notes, disclaimers, and next-step CTA.
- **Rashed Digital Studio portfolio:** may use separate public starting prices later, but prospect pricing is not automatically copied into portfolio pages.

For a qualified prospect, use `outreach/pricing-guide.md` before finalizing `outreach/package.md`. The current introductory baseline is:

- **Website Essentials:** ₹11,999 one-time;
- **Business Growth:** ₹14,999 one-time;
- **Growth + Visibility:** ₹19,999 one-time;
- **SEO + GEO Support:** starting from ₹4,999/month; and
- **Social Media Support:** starting from ₹5,999/month.

These are founding-client / introductory project rates, not universal fixed prices. Customize the final scope and price when justified by the prospect's business size, current online presence, required features, page count, booking needs, automation/integration needs, content readiness, and competitive value. Record the rationale. Do not automatically recommend Business Growth or any other option for every business.

Use professional positioning such as **Founding Client Offer** or **Introductory Project Rate** and, where appropriate, “Special introductory project rate for selected local businesses.” Never describe the studio as inexperienced, cheap, or discounted because it lacks clients. Do not use fake scarcity or time pressure.

Default introductory payment milestones are:

- ₹11,999: ₹5,000 kickoff, ₹5,000 after design/demo approval, ₹1,999 before production launch;
- ₹14,999: ₹5,000 kickoff, ₹5,000 after design/demo approval, ₹4,999 before production launch; and
- ₹19,999: ₹7,000 kickoff, ₹6,000 after design/demo approval, ₹6,999 before production launch.

If a price or scope is customized, recalculate the milestones so they equal the exact project total and record them before outreach. Do not collect payment or build a payment gateway unless the user separately authorizes it.

Every commercial offer must state:

- final scope is confirmed before work begins;
- domain registration is separate unless explicitly included;
- paid hosting, premium plugins, paid APIs, and third-party subscriptions are separate unless included in writing;
- out-of-scope features are quoted separately;
- monthly marketing, SEO, GEO, and social services are billed separately;
- final production handover occurs after the agreed project balance is paid;
- monthly deliverables and content volume are agreed before a retainer begins; and
- SEO/GEO, analytics, conversion, chatbot, automation, and social work does not guarantee rankings, leads, bookings, clients, or revenue.

Use this SEO disclaimer or an equally precise version:

> SEO work is designed to improve technical health, search visibility and local discovery. Specific ranking positions cannot be guaranteed.

Never add bank details, UPI IDs, Wise details, Airtm details, API keys, or other sensitive payment credentials to demo, proposal, outreach, or public files.

## Scope and Safety

- Work only inside the current prospect workspace unless a shared template genuinely needs improvement.
- Do not modify another prospect's research, demo, deployment, or outreach package.
- Do not expose one prospect's information in another prospect's demo.
- Do not perform intrusive scanning, bypass access controls, scrape private data, or collect sensitive personal information.
- Do not modify a live business website or external account.
- If identity, ownership, factual accuracy, licensing, or authorization is unclear, document the blocker and ask the user.

## Definition of Done

A qualified prospect package is complete only when it contains:

- sourced business profile and official-website determination;
- source log;
- evidence-backed audit;
- completed qualification score and decision;
- responsive demo site, if qualified;
- passing lint/build/tests that actually exist;
- completed visual and browser QA record;
- committed non-production branch;
- verified Vercel Preview URL with HTTP 200, when deployment is appropriate;
- business-specific premium UI/UX rather than an unchanged generic starter;
- structured business knowledge shared by the page and chatbot;
- working local-knowledge virtual assistant with safe fallback and applicable CTAs;
- completed chatbot responsive, keyboard, and factual-safety QA;
- draft email, WhatsApp message, phone-call script, and follow-up message;
- completed pricing decision record with three options, a justified prospect-specific recommendation, milestone payments, optional monthly services, and commercial disclaimers;
- explicit statement that no outreach was sent;
- a final handoff that stops for user review.
