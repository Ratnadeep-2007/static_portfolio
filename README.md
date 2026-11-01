# Ratnadeep Patil — portfolio v3

A static editorial portfolio with four source-backed case studies and an original interactive evidence-flow study. Plain pre-rendered HTML, modular CSS/JavaScript, and a dependency-free Node build. No backend, database, framework, runtime package, or external asset CDN.

## Run

Use Node.js 20 or newer.

```sh
npm install
npm run dev
```

Open `http://localhost:4173`. The dev command builds and watches `src/` and `public/`; refresh the browser after an edit. A local preview must use the server so asset paths and case-study routes resolve.

```sh
npm run build
npm run preview
```

The production upload is the **contents of `dist/`**. It includes the homepage, four case-study directories, local fonts, original SVG diagrams, social images and the owner's unchanged PDF résumé. The new brief requests modular case studies and a separate PDF, superseding the earlier single-file format. Main retains the previous single-file version until this branch is reviewed and merged.

## Hatchable production deployment

The site is deployed at **https://ratnadeep-systems.hatchable.site** from the reviewed portfolio V3 design. Build the exact metadata for this host with:

```sh
npm run verify:hatchable
```

The command generates `dist/`, runs the original static tests, and checks canonical links, Open Graph images, sitemap entries and required assets. Copy the **contents** of `dist/` into the existing Hatchable project's `public/` directory, then publish the project through Hatchable. See [Hatchable deployment guide](docs/hatchable-deployment.md) for verification and visibility controls. Keep the GitHub `main` branch unchanged until the redesign is reviewed.

## Public origin and S3

Build with the real deployment URL before production so canonical, Open Graph and sitemap URLs match your host:

```powershell
$env:SITE_URL='https://your-domain.example'
npm run build
```

Without `SITE_URL`, metadata uses `http://localhost:4173` for local preview. That is an explicit preview default, not a claimed public deployment.

For S3 static website hosting, upload `dist/` contents to the bucket root and use `index.html` as the index document. Case studies use real `work/<slug>/index.html` objects and ordinary directory links. There is no client-side router or SPA fallback requirement. Configure hosting access separately. This task does not create a bucket or deploy a production domain.

## Edit

| File | Purpose |
|---|---|
| `src/content.mjs` | Profile, skills, experience, ordered projects, source-backed case copy, illustrative study records |
| `src/components.mjs` | Semantic shared page components and metadata |
| `src/styles.css` | Tokens, layouts, states, mobile rules and reduced motion |
| `src/client.js` | Source/stage selection, mobile menu, active navigation and copy-email feedback |
| `src/diagrams.mjs` | Original README-based architecture and social-image vector designs |
| `public/assets/` | Local fonts/notices, PDF, real TermWise screenshot and social images |
| `scripts/build.mjs` | Static output and SEO file generation |
| `scripts/serve.mjs` | Local static server with proper content types and 404 status |

The root `index.html` is a generated convenience copy. Edit `src/` and rebuild rather than hand-editing it. The reviewed GitHub branch also contains compiled assets/case pages at the repository root for inspection; `dist/` remains the canonical local deployment output.

## Interactions

Choose a meeting note, project brief or architecture note, then trace Evidence → Context → Decision. The selected graphic, explanation and source citation stay synchronized. Native buttons support pointer/touch/Enter/Space, with arrow/Home/End shortcuts. Records are explicitly illustrative; the portfolio does not call a model or pretend to run Synora.

All prose and navigation remain readable without JavaScript. Reduced motion removes intro/selection transitions. The study does not require WebGL or schedule continuous animation. Escape closes the mobile menu. Clipboard failure exposes a usable mailto alternative.

## Check

```sh
npm run build
npm test
# While npm run preview is running:
npm run test:browser
```

The browser checks use Python Playwright. Install it separately if needed with `python -m pip install -r requirements-dev.txt`. The default browser is installed Microsoft Edge on Windows. Set `BROWSER_EXECUTABLE` to your installed Chromium-compatible browser and `PORTFOLIO_TEST_URL` if you use a different preview origin. No browser is downloaded by the app build.

`python scripts/generate-social-images.py` refreshes five PNG previews from the project's own generated SVG artwork; rebuild afterward. `python scripts/measure-performance.py` compares the preserved local baseline when that private research snapshot is available. Its recorded results and method are in `docs/performance-results.json`.

Research, design, motion, content preservation, testing limits and screenshots are documented in `docs/`. Font and screenshot licensing is in `THIRD_PARTY_NOTICES.md`.

## Delivery status

The original redesign is isolated to `portfolio-v3-research-redesign`. Branch `portfolio-v4-hatchable-sync` adds the verified Hatchable production build and ready-to-host metadata. Hatchable version 4 was deployed on 1 November 2026, using the V3 redesign from commit `659535823b8ce8cf61127a531de6444b8755f035`. The Hatchable project is currently **personal/private**; the owner must switch visibility to Public in Hatchable settings for anonymous access. Neither branch changes `main`. External reference browsing was blocked by executor network policy, so the research report distinguishes accessible source-derived findings from unverified interactions. No portrait was fabricated or silently changed.
