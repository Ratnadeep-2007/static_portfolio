from pathlib import Path
import json

root=Path(__file__).resolve().parent.parent
browser=json.loads((root/'docs/browser-results.json').read_text())
perf=json.loads((root/'docs/performance-results.json').read_text())
build=json.loads((root/'dist/build-report.json').read_text())
before=perf['baseline_median'];after=perf['redesign_median']
text=f'''# QA and delivery evidence

Tested 1 November 2026 in headless Microsoft Edge through Python Playwright 1.62.0, against the running Node static server. This report distinguishes automated evidence, inspected screenshots, and unverified external conditions.

## Commands actually executed

| Command | Observed result |
|---|---|
| `npm.cmd install --ignore-scripts --no-audit --no-fund` | Success; no third-party runtime/build packages required |
| `npm.cmd run dev` (temporary port 4181) | Built successfully; preview returned HTTP 200; watcher initialized; temporary server stopped after check |
| `npm.cmd run build` | Five static content pages plus a 404, assets, canonical/OG metadata, robots and sitemap |
| `npm.cmd run preview` | Running local preview at http://localhost:4173 |
| `npm.cmd test` | **6 test groups passed**, 0 failed |
| `npm.cmd run test:browser` | **{len(browser['checks'])} assertions passed**, 0 script errors, 0 unexpected HTTP failures |
| `python scripts/generate-social-images.py` | Five original PNG social images generated from the project's own SVGs |
| `python scripts/check-contrast.py` | Six principal text/background pairs exceed 4.5:1 |
| `python scripts/measure-performance.py` | Three fresh-context samples per version; raw results and method saved |

## Coverage

- All five content routes at **320×740, 390×844, 768×1024, 1024×900, 1440×900, 1920×1080**: {len(browser['viewports'])} route/viewport combinations, no horizontal overflow.
- All four project links in the required order, case contents anchors, browser Back, source links and static assets resolve.
- Every page has one h1, unique IDs, named links/controls, descriptive image alternatives and unique metadata.
- Three source choices × three stages: explanation, selected route/node, button state and provenance remain synchronized.
- Native Enter/Space, arrow keys and End selection; mobile menu expansion, initial link focus, Escape closure/focus return, and anchor focus into content.
- Touch emulation, reduced-motion state changes, JavaScript-disabled readable navigation/explanation, and WebGL-disabled operation.
- Original PDF downloaded through the UI and compared byte-for-byte. Preserved SHA-256: `b2862911b8b87b38c4f3dceac79ed4d913f299d4cc4901e32107bab895daf524`.
- Native clipboard feedback: **{browser.get('native_clipboard_feedback','not recorded')}**. Explicit success and rejected-clipboard branches were also exercised with controlled responses; mailto remains usable.
- Simulated 150 ms latency and 200 KiB/s download: page remains readable and explorer controls work. This is a controlled local profile, not a public-network benchmark.
- Local DM Sans and JetBrains Mono faces load. Font file headers, notices and paths are checked. The mono font was subset to 24,204 bytes.

## Visual QA cycle and repairs

1. Captured the remote-matched baseline at desktop, tablet and mobile. [Baseline](screenshots/baseline/home-1440.png).
2. Built the first design and inspected [the initial hero](screenshots/first-pass/desktop-hero.png), mobile page and case-study captures. The first pass exposed overflow at 320 px from the long name's grid min-content width. The explorer was also too tall on desktop and its control labels too small.
3. Replaced auto minimum grid sizing with `minmax(0,...)`, tuned the phone name size, increased key study labels, constrained the desktop drawing, and added useful no-JS navigation. Full-page captures now load lazy images explicitly, so blank deferred images are not mistaken for missing assets.
4. Added keyboard-activation restraint and mobile anchor focus. Rebuilt and reran all static/browser tests. Inspected the revised [desktop hero](screenshots/final/hero-desktop.png), [mobile homepage](screenshots/final/home-mobile.png), and case-study screenshots including [ContextGuard mobile](screenshots/final/contextguard-mobile.png).

The screenshot annotations are these numbered observations/captions next to the saved evidence. No reference designer's artwork is published as a portfolio asset.

## Measured performance

No Lighthouse score is claimed. These are median observations from three fresh-context local runs per version, at 1440×900, uncompressed HTTP assets. Browser CPU/network conditions are not representative of every visitor. External HTTPS requests were blocked during the comparison.

| Metric | Original single-file site | Redesign |
|---|---:|---:|
| DOMContentLoaded | {before['domContentLoaded']} ms | {after['domContentLoaded']} ms |
| First contentful paint | {before['fcp']} ms | {after['fcp']} ms |
| Largest contentful paint | {before['lcp']} ms | {after['lcp']} ms |
| Observed cumulative layout shift | {before['cls']} | {after['cls']} |
| Initial observed transfer | {before['transferBytes']:,} bytes | {after['transferBytes']:,} bytes |
| Idle script time over a one-second window | {before['idleScriptMsPerSecond']} ms | {after['idleScriptMsPerSecond']} ms |
| Idle task time over a one-second window | {before['idleTaskMsPerSecond']} ms | {after['idleTaskMsPerSecond']} ms |

The built homepage is {build['homeBytes']:,} bytes, client JS {build['clientBytes']:,} bytes, and CSS {build['cssBytes']:,} bytes. The PDF is fetched only for download; there is no continuously running animation loop. Production improvements to evaluate on the actual host: Brotli/gzip, cache headers for versioned assets, the real device/network distribution, and a hosted Lighthouse run. Font display still uses swap, although no layout shift was observed in this controlled test.

## Contrast and access limits

Principal pair ratios: warm white/charcoal 16.06:1; muted dark text 7.24:1; copper/charcoal 8.46:1; paper body 5.54:1; paper labels 5.67:1; active copper button text 8.89:1. Decorative schematic rules are not text. These checks and keyboard tests do not establish full WCAG conformance or replace real screen-reader/user testing. Mobile/touch are emulated, not tested on a physical phone.

## Remaining limits

- All eight external reference sites were browser-blocked with `ERR_NETWORK_ACCESS_DENIED`. Source-derived findings and author descriptions are clearly identified in `reference-audit.md`; no current responsive or motion behavior is fabricated.
- The private/blocked Hatchable comparison was not accessed. No access control was bypassed.
- The owner's portrait could not be downloaded; no generated substitute was inserted. The website uses written identity/biography.
- `SITE_URL` defaults to localhost for preview. Before public deployment, set the actual origin and rebuild to update canonical, OG and sitemap URLs.
- No production AWS/Sites/Hatchable deployment was performed. The redesign is isolated on `portfolio-v3-research-redesign` for review, without a main update.
- README-backed project capabilities are not independent runtime validation of those applications. Diagrams are explicitly conceptual; the TermWise overview capture is labeled as actual UI.
'''
(root/'docs/qa-results.md').write_text(text,encoding='utf-8')
print('Wrote QA report from actual browser/build/performance results.')
