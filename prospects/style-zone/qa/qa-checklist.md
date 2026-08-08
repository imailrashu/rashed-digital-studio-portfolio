# Demo QA — Style Zone

Local production-build and browser results were completed on 2026-08-08. Exact Vercel Preview verification is recorded separately in `deployment/preview.md`.

## Automated Checks

- [x] Locked dependencies are present and scripts run without resolution errors
- [x] Lint passes (`npm run lint`)
- [x] Production build passes (`npm run build`)
- [x] Static tests pass (`npm run test`)
- [x] No secrets or `.env` files are staged

## Responsive Visual Checks

| Viewport | Result | Issues/fixes |
|---|---|---|
| 390×844 mobile | Pass | Full-page and open-chat screenshots reviewed; root scroll width equals viewport width |
| 768×1024 tablet | Pass | Full-page and open-chat screenshots reviewed; menu and chat fit correctly |
| 1440×900 desktop | Pass | Full-page and open-chat screenshots reviewed; editorial layout and chat panel fit correctly |

## Accessibility, Browser, and Content

- [x] Semantic landmarks and one clear H1
- [x] Keyboard navigation, mobile menu, and visible focus
- [x] Reduced-motion mode
- [x] No root horizontal overflow or content clipping
- [x] No console/page errors
- [x] No failed critical resources or 4xx/5xx responses
- [x] Every business fact supported by source log
- [x] No fabricated reviews, results, awards, statistics, services, or hours
- [x] Proposal status and stock imagery labels are clear

## Chatbot QA

- [x] Launcher remains reachable without covering navigation or primary CTAs
- [x] Panel fits 390×844, 768×1024, and 1440×900
- [x] Open moves focus to input; Escape closes; focus returns to launcher
- [x] Location and phone questions return the verified configured values
- [x] Services, hours, prices, WhatsApp, booking, and unknown questions do not fabricate answers
- [x] Quick actions show Call Now and Location only
- [x] Local mode works without an API key or network request
- [x] Optional AI provider mode remains disabled
- [x] Reduced-motion behavior remains readable

## Final QA Summary

- **Ready for Preview Deployment:** Yes
- **Browser evidence:** HTTP 200 at all three viewports; menu and chatbot interactions passed; zero console errors, page errors, failed requests, or bad responses.
- **Transport note:** The in-app browser WebSocket connection timed out twice at 30 seconds. QA completed through the bounded Playwright/HTTP fallback and generated screenshots instead of waiting indefinitely.
- **Known limitations:** Detailed business information requires direct confirmation. The decorative map grid intentionally extends inside its clipped map frame; the document itself has no horizontal overflow.
