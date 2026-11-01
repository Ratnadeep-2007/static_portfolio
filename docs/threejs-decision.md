# Centerpiece decision — layered evidence graph

## Revision context

The initial research redesign selected a static SVG/HTML implementation of Evidence → Context → Decision. On 1 November 2026, the owner explicitly requested stronger scroll animation and Three.js effects. This revision keeps the same meaningful system model and adds an optional spatial renderer, rather than restoring an arbitrary spinning knot.

## Candidate directions

| Direction | Decision |
|---|---|
| A. Evidence → context → decision | Selected. Three source adapters connect through retained context to an inspectable decision. Spatial separation makes the three stages feel like layers of a system. |
| B. Spatial project atlas | Rejected for this page: more camera/navigation complexity and duplicated project navigation. |
| C. Kinetic decorative object | Rejected: motion alone would not explain Ratnadeep's engineering work. |

## Architecture and identity

src/system-scene.js is an original Three.js scene: five rectangular nodes, matte charcoal faces, copper edges, bounded signal packets, and a restrained pointer tilt. Canvas labels use the site's local DM Sans. It is the same source/context/decision model as the native SVG; button states, explanation and provenance stay in HTML. There is no stock model, chrome ball, glow, particle background, or third-party portfolio animation snippet.

Three.js 0.187.0 is pinned from the npm registry and licensed MIT. esbuild 0.28.2 is a pinned MIT build-time dependency. It bundles the required renderer into the local optional assets/system-scene.js module with legal comments retained. Full notices are distributed. No external CDN is required.

## Loading and fallback

The normal HTML/SVG interface renders first. On viewports above 700 px, with normal motion preference and the study visible, the optional module is requested after a 700 ms delay. It does not block native controls or require a preloader. Mobile and reduced-motion views use SVG without requesting the module. A missing WebGL2 context, failed module load, or context loss leaves/restores the SVG. The SVG carries a CSS signal while visible when normal motion is allowed; reduced motion is static.

## Lifecycle and budget

- Orthographic camera and original low-poly box/edge geometry; no shadows, postprocessing, external image textures or lighting passes.
- Device pixel ratio capped at 1.5 and approximately 30 fps while active.
- Renderer pauses offscreen and while the document is hidden; only selection and diagram signals animate.
- Materials, geometries, textures, event listeners and observers are disposed on page teardown and fallback switches.
- Scroll motion outside the scene coalesces passive input events into one update frame; it does not self-schedule while idle.
- Main client stays below 15 KB, CSS below 40 KB and homepage HTML below 35 KB. The optional minified Three.js module is about 542 KB uncompressed. That extra desktop transfer is an explicit tradeoff for the requested spatial motion, not an unchanged zero-dependency performance claim.

Measurements and limitations belong in qa-results.md and the current JSON reports. A recorded browser preview demonstrates actual transitions; it is not shipped as an autoplay website asset.
