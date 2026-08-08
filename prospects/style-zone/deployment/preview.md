# Preview Deployment — Style Zone

This record is for a non-production Preview Deployment only.

- **Git branch:** `demo/style-zone`
- **Commit hash:** `40df6dd71654cd3bd515466e095e404cb606f7ef`
- **Repository:** `imailrashu/rashed-digital-studio-portfolio`
- **Vercel project:** `md-rashed/rashed-digital-studio-portfolio`
- **Preview URL:** https://rashed-digital-studio-portfolio-git-demo-style-zone-md-rashed.vercel.app
- **Immutable deployment:** https://rashed-digital-studio-portfolio-5p5jqm2dq-md-rashed.vercel.app
- **Deployment status:** Ready — Preview (Vercel Deployment Protection enabled)
- **Checked at:** 2026-08-08 21:04:12 +05:30

## Production-like Verification

- [x] Exact protected preview returns authenticated HTTP 200
- [x] Homepage HTML is the Style Zone private proposal
- [x] Navigation and mobile menu work
- [x] Call and directions actions use verified public details
- [x] Mobile, tablet, and desktop layouts verified
- [x] No critical console errors in the tested production bundle
- [x] No page errors in the tested production bundle
- [x] No failed critical resources
- [x] Images load and retain aspect ratio
- [x] `noindex` is present in the document and Vercel response headers
- [x] Virtual assistant opens, accepts keyboard input, and closes with Escape
- [x] Local verified answers and unknown-information fallback work
- [x] Chat quick actions expose only Call and Location
- [x] Chat panel fits mobile, tablet, and desktop

## Verification Evidence

- Vercel reported deployment `dpl_HgBRaYN1bs7dwviSHud2kPHPqefW` as `Ready` with target `preview`.
- Anonymous requests redirect to Vercel login because Deployment Protection is enabled. Authenticated `vercel curl` returned HTTP 200, the Style Zone title/description, and `X-Robots-Tag: noindex`.
- The deployed main CSS/JS, lazy chatbot CSS/JS, and both salon images were downloaded through the authenticated HTTPS fallback with 15-second limits. All six SHA-256 hashes matched the locally linted, built, and browser-tested bundle.
- Browser QA of that byte-identical bundle passed at 390×844, 768×1024, and 1440×900 with no console errors, page errors, failed requests, or 4xx/5xx responses.
- The in-app browser WebSocket transport timed out twice at 30 seconds; verification continued through bounded Playwright and authenticated HTTPS fallback instead of waiting indefinitely.

**Production merged/deployed:** No. Explicit user approval is required.
