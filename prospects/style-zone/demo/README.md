# Demo Brief — Style Zone

## Status

- **Build authorized:** Yes — qualification gate passed
- **Qualification score:** 78/100
- **Demo branch:** `demo/style-zone`
- **Demo disclaimer:** Persistent top-of-page notice and footer disclosure: private website proposal, not the official Style Zone website

## Demonstration Goal

Show how Style Zone could move from scattered third-party directory discovery to a focused, editorial, mobile-friendly page that makes its Dhakuria location and public phone contact immediately clear.

## Verified Content Allowed

| Content/fact | Source ID | Planned use |
|---|---|---|
| Style Zone business name | S01, S02 | Brand and page title |
| Salon / personal-care category | S01, S02 | Neutral category description |
| 28/1C Gariahat Road, Kankulia, Dhakuria, Kolkata address | S01, S02 | Location section and directions link |
| +91 98046 77597 public phone | S01 | Call links with a pre-launch confirmation note |

## Content That Must Not Be Assumed

- Testimonials, ratings, and reviews
- Results, awards, credentials, or establishment history
- Detailed services, prices, packages, or products
- Opening hours, walk-in policy, or booking availability
- WhatsApp availability
- Team names, photographs, or expertise
- Actual interior/staff/customer photography
- Correct postcode until confirmed

## Information Architecture

- Private proposal notice
- Editorial hero with verified identity and location
- Clear call and directions actions
- Proposed customer-journey section framed as a demonstration
- Concept-image section explicitly labelled as licensed stock imagery
- Location/contact section using only corroborated facts
- Confirmation checklist for production readiness
- Proposal disclosure footer

## Visual Direction

- Reuse the established salon-demo language: warm ivory, graphite, restrained dusty rose, subtle gold, oversized editorial serif typography, fine technical rules, asymmetric image composition, and quiet reveal motion.
- Keep the result original to Style Zone rather than copying the earlier Style Check concept.
- Use Pexels salon images as licensed concept visuals, never as depictions of Style Zone.
- Avoid generic purple gradients, fake team portraits, review cards, statistics, and before/after claims.

## Implementation

Self-contained Vite + React + TypeScript application in `demo/site/`, with semantic HTML, accessible mobile navigation, reduced-motion support, stable image dimensions, and no backend or paid integration.

The visible site and virtual assistant share `src/data/business.ts`. The Style Zone chatbot uses local intent matching for verified location, phone, business category, and safe answers about unconfirmed services/hours. Quick actions are limited to Call and Location because WhatsApp, booking, email, detailed services, and hours are not verified.

Optional AI mode is architected behind `src/chat/provider.ts`, but remains disabled. It requires a separately approved server endpoint; no provider key is stored or exposed in the client.
