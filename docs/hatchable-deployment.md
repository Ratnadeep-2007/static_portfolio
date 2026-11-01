# Hatchable deployment — portfolio V4

## Source of truth

- GitHub repository: https://github.com/Ratnadeep-2007/static_portfolio
- Production-sync branch: `portfolio-v4-hatchable-sync` (branched from `portfolio-v3-research-redesign`)
- Base redesign commit: `659535823b8ce8cf61127a531de6444b8755f035`
- Hatchable project: **Ratnadeep — Systems Portfolio**
- Hatchable URL: https://ratnadeep-systems.hatchable.site
- Previous verified Hatchable release: V4, deployed 1 November 2026
- GitHub `main`: **do not modify** until the design is reviewed

## Build and test

Requires Node.js 20+; no runtime dependencies.

```sh
npm install
npm run verify:hatchable
```

`verify:hatchable` runs `build:hatchable`, `npm test`, and `test:hatchable`.
The build sets the correct production origin for canonical URLs, Open Graph metadata, robots and sitemap.
`dist/` contains the deployable files; do **not** publish `src/`, `scripts/` or `tests/` as the website root.
The existing build generator also updates the checked-in root HTML, case studies and assets for easy review.

## Deploy to the existing Hatchable project

1. Open the Hatchable console for `ratnadeep-systems`.
2. Update the project's `public/` files using the **contents** of `dist/`; preserve the relative paths (`public/index.html`, `public/assets/…`, `public/work/<slug>/index.html`).
3. Remove superseded paths only after verifying they are no longer linked.
4. Run the Hatchable deployment validator, then deploy.
5. Verify the homepage, all four `/work/<slug>/` routes, interactive evidence explorer, mobile menu, fonts, diagrams and the original PDF résumé.
6. Verify canonical and `og:image` URLs point to https://ratnadeep-systems.hatchable.site and sitemap covers all five routes.

Hatchable deployments are **not automatically triggered by GitHub branch pushes** in this setup. They require a separate Hatchable publish step. This document records a manual workflow, not an invented CI integration.

## Visibility

The Hatchable project was last observed as `personal` (private). Anonymous visitors may see a platform sign-in page. The owner can make it publicly accessible in Hatchable console → Settings → Visibility → Public. A temporary preview token is not a permanent public URL.

## Visual system and content

The source branch contains the original evidence-flow interaction, four repository-backed case studies, local licensed fonts, real TermWise screenshot and original SVG diagrams. These are not replaced by an older Hatchable experiment. See `docs/design-system.md`, `docs/motion-spec.md`, `docs/reference-audit.md` and `THIRD_PARTY_NOTICES.md`.

## Verification status

Browser tests already passed after the V4 Hatchable deployment: all five content routes loaded, source/stage controls responded, the mobile menu opened and closed with Escape, and assets were served. No horizontal overflow was observed at tested widths from 320 to 1365 pixels. These observations are deployment smoke tests, not an exhaustive accessibility audit.
