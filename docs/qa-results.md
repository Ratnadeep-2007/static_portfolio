# Current QA: Design.md implementation

2 November 2026. This report supersedes the earlier layout's browser/motion counts. Detailed brief adaptations are in [design-implementation.md](design-implementation.md).

## Executed checks

- `npm run build`: five static content routes, assets and 404 generated.
- `npm test`: six static test groups pass, including local paths, unique IDs/metadata, project order, excluded web content, font notices and original PDF integrity.
- `npm run test:browser`: **90 assertions pass**; 0 failures, 0 runtime errors and 0 HTTP failures.
- `python scripts/check-contrast.py`: **14 text/background pairs pass 4.5:1**, including demo labels and clarification states.
- Lighthouse mobile: **93 Performance / 100 Accessibility**.
- Lighthouse desktop: **99 Performance / 100 Accessibility**.
- Visible-label/accessible-name audit passes after replacing the decorative letter logo with SVG. The earlier native View Transition experiment was removed after an abort surfaced in stress testing.

## Meaningful behavior verified

Source selection/provenance/reset; conflicting-date comparison, clarification, retained evidence and brief; actual cash chart reshaping, known reserve results and keyboard slider; 64-character SHA-256 matching the displayed RGBA bytes, one-pixel tamper and restoration. The four illustrations are disclosed as fictional, backend-free demonstrations.

Lazy WebGL creation, rendered frame movement, paused frame stability, scroll-linked graph resolution and four accessible nodes; desktop reel navigation and focus-driven panel movement; tool/project connection highlighting; command menu focus and Escape; copy-email feedback; self-hosted portrait loading; CV-backed internship months; unchanged PDF.

All five routes at 320, 390, 768, 1024, 1440 and 1920px: no horizontal overflow. Mobile/touch and wide coarse-pointer devices use lighter static/vertical layouts. Reduced motion, JavaScript disabled, WebGL disabled and case-study browser Back were tested. No-JS controls are disabled and retain a clear explanatory note.

## Visual evidence

Inspected first and repaired captures: [hero](screenshots/design-final/hero.png), [graph](screenshots/design-final/graph.png), [clarification demo](screenshots/design-final/contextguard.png), and [mobile](screenshots/design-final/mobile.png). Further local captures include the cash chart, hash demo, skills map and portrait/about section. Fixed encoding errors, mobile anchor overlap, graph label alignment, invisible node pointer targets, logo accessible naming, and pause/transition stability.

## Size and method limits

Homepage 29,182 bytes; client 20,508; combined minified CSS 59,998; optional desktop Three.js module 541,432, all uncompressed. The portrait WebP is 26,406 bytes and lazy-loaded. No application runtime dependency was added.

Lighthouse is a controlled local, headless initial-load measurement with animation enabled. It does not scroll the full WebGL sequence or establish physical-phone performance. Raw Lighthouse reports remain in the local workspace; the public compact evidence is [lighthouse-summary.json](lighthouse-summary.json). A perfect audit score does not establish full WCAG conformance or replace assistive-technology/user testing.

Physical mid-range Android testing, a user-provided custom domain, a calendar destination and an analytics service remain external follow-ups. No custom-domain purchase, backend agent, external analytics or real-project runtime validation is claimed. Hosting visibility/deployment receipts are reported separately.
