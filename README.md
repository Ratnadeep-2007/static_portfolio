# Ratnadeep Patil — portfolio v3

A static editorial portfolio with four source-backed case studies, scroll choreography, and an original interactive evidence-flow study. Plain pre-rendered HTML and modular CSS/JavaScript, with an optional locally bundled Three.js desktop scene. The build uses esbuild. No backend, database, UI framework, or external asset CDN.

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

The production upload is the **contents of `dist/`**. It includes the homepage, four case-study directories, local fonts, original SVG diagrams, social images and the owner's unchanged PDF résumé. The new brief requests modular case studies and a separate PDF, superseding the earlier single-file format. The redesign is on main; Hatchable hosts the static output separately.

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
| `src/client.js` | Source/stage selection, scroll motion, mobile menu, active navigation and copy-email feedback |
| `src/artworks.mjs` | Distinct original project artwork and the actual TermWise interface capture |
| `src/scroll-story.js` / `.css` | Natural-scroll copper typography sequence, pointer tilt and reduced-motion fallback |
| `src/system-scene.js` | Original optional Three.js graph, signal movement, source/stage synchronization and GPU cleanup |
| `src/diagrams.mjs` | Original README-based architecture and social-image vector designs |
| `public/assets/` | Local fonts/notices, PDF, real TermWise screenshot and social images |
| `scripts/build.mjs` | Static output and SEO file generation |
| `scripts/serve.mjs` | Local static server with proper content types and 404 status |

The root `index.html` is a generated convenience copy. Edit `src/` and rebuild rather than hand-editing it. The reviewed GitHub branch also contains compiled assets/case pages at the repository root for inspection; `dist/` remains the canonical local deployment output.

## Interactions

Choose a meeting note, project brief or architecture note, then trace Evidence → Context → Decision. On desktop, the local Three.js scene adds layered nodes, moving signal packets and restrained pointer response. The selected graphic, explanation and source citation stay synchronized. Native buttons support pointer/touch/Enter/Space, with arrow/Home/End shortcuts. Records are explicitly illustrative; the portfolio does not call a model or pretend to run Synora.

The name reveals line by line. Scroll entry reveals the editorial sections, wipes in project artwork, and draws the architecture connectors. A sticky work index tracks the current project, and a reading-progress rule follows the page. The 3D scene renders at a capped rate only while visible and the page is active. Mobile, reduced-motion, unavailable WebGL and context loss use the SVG fallback. All prose and navigation remain readable without JavaScript. Escape closes the mobile menu. Clipboard failure exposes a usable mailto alternative.

## Check

```sh
npm run build
npm test
# While npm run preview is running:
npm run test:browser
python scripts/check-motion.py
```

The browser checks use Python Playwright. Install it separately if needed with `python -m pip install -r requirements-dev.txt`. The default browser is installed Microsoft Edge on Windows. Set `BROWSER_EXECUTABLE` to your installed Chromium-compatible browser and `PORTFOLIO_TEST_URL` if you use a different preview origin. No browser is downloaded by the app build.

`python scripts/generate-social-images.py` refreshes five PNG previews from the project's own generated SVG artwork; rebuild afterward. `python scripts/measure-performance.py` compares the preserved local baseline when that private research snapshot is available. Its recorded results and method are in `docs/performance-results.json`. `python scripts/record-motion.py` records an actual browser walkthrough to the local `motion-preview.webm`; that review video is not a website dependency.

Research, design, motion, content preservation, testing limits and screenshots are documented in `docs/`. Font and screenshot licensing is in `THIRD_PARTY_NOTICES.md`.

## Delivery status

Work is isolated to `portfolio-v3-research-redesign`; review the pull request before merging. No main commit or live production deployment is part of this task. External reference browsing was blocked by executor network policy, so the research report distinguishes accessible source-derived findings from unverified interactions. No portrait was fabricated or silently changed.

## Spatial revision

The hero now assembles physical evidence sheets around a layered copper processor. A full-width Build / Connect / Automate scroll sequence leads into four distinct project visuals. See `docs/spatial-iteration.md` for the review loop and repairs. Run `python scripts/check-spatial.py` for 60 additional integration assertions, including real motion/pause frame comparison.
