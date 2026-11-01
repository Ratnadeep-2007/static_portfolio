# Centerpiece decision

## Three candidate directions

| Direction | User benefit | Cost / risk | Verdict |
|---|---|---|---|
| A. Evidence → context → decision | Explains the shared concern in Synora and ContextGuard: maintain provenance while information changes meaning | Needs clear illustrative labeling and synchronized controls | Selected |
| B. Spatial architecture atlas | Could compare four real systems in one navigable space | Adds pan/zoom, touch, camera and keyboard complexity; duplicates work navigation | Rejected for the landing page |
| C. Kinetic technical object | Strong initial visual identity | Risks repeating the old ornamental knot; engineering meaning would be secondary | Rejected |

## Why SVG and HTML, not Three.js

The model has three source records and three stages. A camera, depth buffer, raycaster, renderer and GPU loop do not improve the inspection task. Original SVG connections plus ordinary buttons make source selection and provenance legible. The single complex interaction is the source/stage explorer; other page effects are short visual feedback only.

Three.js examples for raycasting, fat lines and CSS2D labels were source-inspected, with their MIT license checked. OGL raycasting and its Unlicense metadata were also checked. These teach useful general principles, but no code or renderer is imported. There is no WebGL dependency, canvas fallback duplication, model download, third-party CDN or continuously scheduled animation frame.

## Architecture

`src/content.mjs` defines three explicitly illustrative records, separate from project facts. `SystemExplorer` pre-renders an explanatory diagram, sources, stage buttons and initial text. `src/client.js` owns local `{source, stage}` state. Source selection resets to Evidence; stage selection changes the highlighted node, output text and source citation together. A decision shows the route back to the source. This is an educational state model, not a functioning AI service or a disguised product demo.

Pointer, touch, native Enter/Space and optional arrow/Home/End navigation all activate the same code path. `aria-pressed` communicates selection; a polite atomic live region carries explanation. Static labels and project case studies remain useful without scripting. A no-JS notice explains the model and hides nonfunctional controls. No pointer movement or drag is intercepted, so scrolling remains native.

## Motion and lifecycle

State changes are immediate. Optional 220 ms text emphasis and SVG stroke-color transitions run only after selection. Reduced motion removes them. No work is scheduled while idle, offscreen or hidden. Event listeners and observers have `pagehide` cleanup and BFCache remount support. There are no GPU resources to dispose of.

## Budget

Target homepage HTML under 35 KB, client JS under 15 KB, stylesheet under 40 KB, no runtime JavaScript packages, no initial bitmap hero, and fonts loaded from the same origin. The PDF is fetched only by a download action. Measurements are recorded in `qa-results.md`; targets are not presented as measured scores.
