# Reusable Client Demo System

This folder provides a repeatable, evidence-first workflow for qualifying a business prospect, creating a premium business-specific demo with a factual on-site virtual assistant, validating it, publishing a Vercel Preview, and preparing outreach drafts for human review.

It intentionally contains no client demo and no prospect data yet.

## Start a Prospect Workspace

From this repository in PowerShell:

```powershell
.\scripts\new-prospect.ps1 -BusinessName "Business Name"
```

Optionally provide a stable slug:

```powershell
.\scripts\new-prospect.ps1 -BusinessName "Business Name" -Slug "business-name"
```

The script creates `prospects/<slug>/` from the reusable template and refuses to overwrite an existing prospect.

## Workflow

1. Complete `research/business-profile.md` and `research/source-log.md`.
2. Complete `audit/website-audit.md` and `audit/qualification-scorecard.md`.
3. Apply the qualification gate in `AGENTS.md`.
4. For a qualified prospect, complete `demo/site/src/data/business.ts` with verified facts and explicit unknowns.
5. Replace the neutral starter page with an original premium UI/UX system appropriate to the business category.
6. Configure and style the included local-knowledge virtual assistant; keep optional AI mode disabled unless explicitly approved.
7. Record asset provenance in `demo/assets.md` and complete `qa/qa-checklist.md` using actual local, chatbot, and browser results.
8. Commit and push a non-production `demo/<slug>` branch when appropriate.
9. Record and verify the Vercel Preview in `deployment/preview.md`.
10. Complete `outreach/pricing-guide.md`, choose and justify a prospect-specific package recommendation, and customize prices or scope when the evidence requires it.
11. Complete `outreach/package.md` with the audit, demo link, commercial options, milestone payments, optional monthly services, disclaimers, and concise first-contact drafts as **DRAFT — NOT SENT**.
12. Stop and wait for review. Never merge or publish production without explicit approval.

## Repository Structure

```text
AGENTS.md                      Permanent operating and safety rules
README.md                      System overview
scripts/new-prospect.ps1       Creates a prospect workspace safely
templates/prospect/            Reusable prospect workspace template
prospects/                     Generated prospect workspaces
```

Each generated prospect contains:

```text
research/      Verified business facts and source evidence
audit/         Online-presence findings and qualification decision
demo/          Demo brief, asset provenance, isolated Vite starter, shared business data, and chatbot
qa/            Responsive, accessibility, and browser verification
deployment/    Preview branch, URL, HTTP, console, and resource status
outreach/      Internal pricing decision guide and human-reviewed draft outreach/proposal package
```

## Non-Negotiable Boundaries

- No fabricated business information, testimonials, reviews, results, awards, or statistics.
- No automated outreach.
- No agency pricing or commercial terms inside a prospect's demo website unless explicitly requested; keep them in outreach/proposal records.
- No paid purchases or domain changes.
- No production merge or deployment without explicit approval.
- No secrets or local Vercel credentials in Git.

## Reusable Demo Starter

Every newly generated prospect inherits a compilable Vite + React + TypeScript starter in `demo/site/` with:

- a typed `src/data/business.ts` knowledge schema;
- a lightweight, keyboard-accessible `BusinessChatbot` component;
- deterministic local intent matching that uses verified data only;
- a disabled optional AI endpoint adapter with no client-side secret;
- responsive chatbot styling and safe-area support;
- lint, build, and static-test scripts.

The starter's neutral page is scaffolding, not a finished design. A qualified prospect build must replace it with an original interface based on that business's category and facts while retaining the shared data and chatbot safety architecture.
