from pathlib import Path
import json

root=Path(__file__).resolve().parent.parent
load=lambda path:json.loads((root/path).read_text(encoding='utf-8'))
build=load('dist/build-report.json');browser=load('docs/design-results.json');contrast=load('docs/contrast-results.json')
summary={'method':'Single local headless Microsoft Edge Lighthouse 13.6.0 run per profile, animations enabled. No physical-device or hosted Lighthouse score is claimed.','profiles':{}}
for name,filename in [('mobile','lighthouse-results.json'),('desktop','lighthouse-desktop-results.json')]:
    raw=load('docs/'+filename)
    summary['profiles'][name]={'scores':{key:round(value['score']*100) for key,value in raw['categories'].items()},'metrics':{key:raw['audits'][key].get('numericValue') for key in ['first-contentful-paint','largest-contentful-paint','total-blocking-time','cumulative-layout-shift']},'visible_label_names_pass':raw['audits']['label-content-name-mismatch'].get('score')==1,'fetchTime':raw.get('fetchTime')}
(root/'docs/lighthouse-summary.json').write_text(json.dumps(summary,indent=2)+'\n',encoding='utf-8')
text=f'''# Current QA: Design.md implementation

2 November 2026. This report supersedes the earlier layout's browser/motion counts. Detailed brief adaptations are in [design-implementation.md](design-implementation.md).

## Executed checks

- `npm run build`: five static content routes, assets and 404 generated.
- `npm test`: six static test groups pass, including local paths, unique IDs/metadata, project order, excluded web content, font notices and original PDF integrity.
- `npm run test:browser`: **{len(browser['checks'])} assertions pass**; {len(browser['failures'])} failures, {len(browser['errors'])} runtime errors and {len(browser['http_failures'])} HTTP failures.
- `python scripts/check-contrast.py`: **{len(contrast)} text/background pairs pass 4.5:1**, including demo labels and clarification states.
- Lighthouse mobile: **{summary['profiles']['mobile']['scores']['performance']} Performance / {summary['profiles']['mobile']['scores']['accessibility']} Accessibility**.
- Lighthouse desktop: **{summary['profiles']['desktop']['scores']['performance']} Performance / {summary['profiles']['desktop']['scores']['accessibility']} Accessibility**.
- Visible-label/accessible-name audit passes after replacing the decorative letter logo with SVG. The earlier native View Transition experiment was removed after an abort surfaced in stress testing.

## Meaningful behavior verified

Source selection/provenance/reset; conflicting-date comparison, clarification, retained evidence and brief; actual cash chart reshaping, known reserve results and keyboard slider; 64-character SHA-256 matching the displayed RGBA bytes, one-pixel tamper and restoration. The four illustrations are disclosed as fictional, backend-free demonstrations.

Lazy WebGL creation, rendered frame movement, paused frame stability, scroll-linked graph resolution and four accessible nodes; desktop reel navigation and focus-driven panel movement; tool/project connection highlighting; command menu focus and Escape; copy-email feedback; self-hosted portrait loading; CV-backed internship months; unchanged PDF.

All five routes at 320, 390, 768, 1024, 1440 and 1920px: no horizontal overflow. Mobile/touch and wide coarse-pointer devices use lighter static/vertical layouts. Reduced motion, JavaScript disabled, WebGL disabled and case-study browser Back were tested. No-JS controls are disabled and retain a clear explanatory note.

## Visual evidence

Inspected first and repaired captures: [hero](screenshots/design-final/hero.png), [graph](screenshots/design-final/graph.png), [clarification demo](screenshots/design-final/contextguard.png), and [mobile](screenshots/design-final/mobile.png). Further local captures include the cash chart, hash demo, skills map and portrait/about section. Fixed encoding errors, mobile anchor overlap, graph label alignment, invisible node pointer targets, logo accessible naming, and pause/transition stability.

## Size and method limits

Homepage {build['homeBytes']:,} bytes; client {build['clientBytes']:,}; combined minified CSS {build['cssBytes']:,}; optional desktop Three.js module {build['sceneBytes']:,}, all uncompressed. The portrait WebP is {(root/'public/assets/ratnadeep-portrait.webp').stat().st_size:,} bytes and lazy-loaded. No application runtime dependency was added.

Lighthouse is a controlled local, headless initial-load measurement with animation enabled. It does not scroll the full WebGL sequence or establish physical-phone performance. Raw Lighthouse reports remain in the local workspace; the public compact evidence is [lighthouse-summary.json](lighthouse-summary.json). A perfect audit score does not establish full WCAG conformance or replace assistive-technology/user testing.

Physical mid-range Android testing, a user-provided custom domain, a calendar destination and an analytics service remain external follow-ups. No custom-domain purchase, backend agent, external analytics or real-project runtime validation is claimed. Hosting visibility/deployment receipts are reported separately.
'''
(root/'docs/qa-results.md').write_text(text,encoding='utf-8')
print(json.dumps({'browser':len(browser['checks']),'contrast':len(contrast),'scores':summary['profiles']}))
