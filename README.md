# Ratnadeep Patil portfolio

A static portfolio applying Design.md: a knot-to-project shader, four working browser illustrations, a desktop project reel, a skills-to-project map, case studies, and an unchanged PDF resume. Near-black dominates, with subtle purple light and orange code details.

## Run and build

Requires Node 20 or newer.

```sh
npm install
npm run dev
```

Open http://localhost:4173. For a built preview:

```sh
npm run build
npm run preview
```

Upload the contents of dist/ to static hosting. The repository root also contains generated ready-to-host copies. Set SITE_URL to your HTTPS origin before building to generate matching canonical, Open Graph and sitemap URLs. Without it, metadata uses the explicit localhost preview default.

Hatchable hosts the prebuilt static files under public/. It does not run npm or build the source. GitHub and Hatchable releases are separate actions. S3 delivery needs index.html as the index document and normal work/<slug>/index.html objects; no client-side routing service is required.

## Source

| File | Purpose |
|---|---|
| src/content.mjs | Profile and source-backed project/case-study copy |
| src/components.mjs / sections.mjs | Static page, navigation, signature and skills markup |
| src/demos.mjs / demos.js | Four disclosed fictional, backend-free illustrations |
| src/design.js | Reel, signature loading, name/verb, skills, command menu and micro-interactions |
| src/knot-scene.js | Original lazy Three.js vertex-shader morph and resource lifecycle |
| src/motion.config.js | Shared motion timing/easing |
| src/styles.css / design.css | Theme, responsive layout and reduced motion |
| src/client.js | Navigation, clipboard, reveal behavior and lifecycle |
| public/assets | Local portrait, fonts, notices, actual TermWise capture, social images and PDF |

The earlier system-scene, artwork and scroll-story modules are retained as source history and are not included in the current runtime. Edit source and rebuild; do not edit generated assets by hand.

## Verify

```sh
npm test
pip install -r requirements-dev.txt
npm run test:browser
python scripts/check-contrast.py
```

The current browser gate is scripts/check-design.py. It checks the four demos, actual displayed-pixel hashing, reel focus, graph motion/pause, six viewport widths across five routes, reduced motion, touch, no JS, no WebGL, clipboard feedback and the original PDF. Screenshots and results go to docs/. Earlier browser/motion scripts are historical gates for earlier layouts.

Lighthouse 13.6.0 was run as a separate audit tool with Microsoft Edge. Scores and limits are in docs/lighthouse-summary.json and docs/qa-results.md. This does not establish physical-phone performance or full accessibility conformance.

See docs/design-implementation.md for the brief adaptations, feature coverage, visual repairs and remaining external checks. The fictional demos do not claim that the featured applications are hosted or independently audited.

## Vercel

`vercel.json` configures the existing static build with `npm ci`, `npm run build`, output `dist/`, and trailing-slash directory routes. Use the Other framework preset. Set `SITE_URL` to the assigned HTTPS production domain in project environment variables before the production build so canonical and social metadata use that domain. No backend or SPA rewrite is required.
