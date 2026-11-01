# Third-party notices and provenance

No reference portfolio code, proprietary typeface, branded composition or creator artwork was copied. All site templates, the evidence explorer, interaction code, wordmark, favicon and architecture diagrams are original implementations for this portfolio. The optional desktop renderer uses the locally bundled Three.js library; no third-party portfolio/demo snippet was copied.

## Motion revision: distributed renderer and build tool

- **Three.js 0.187.0**, MIT, copyright 2010–2026 three.js authors. Pinned in `package.json` and the lockfile; retrieved from the npm registry and checked against its included license. `src/system-scene.js` is an original geometry/interaction implementation. esbuild tree-shakes/minifies the required renderer into `assets/system-scene.js`, retaining legal comments. Full notice: `public/assets/licenses/Three-MIT.txt`. Upstream: https://github.com/mrdoob/three.js .
- **esbuild 0.28.2**, MIT, copyright Evan Wallace. Build-time bundler only, pinned in the dev dependencies. The native build executable is not distributed in the static website. Notice retained at `public/assets/licenses/esbuild-MIT.txt`. Upstream: https://github.com/evanw/esbuild .

The request for stronger visible motion supersedes the initial SVG-only decision documented in the first review. The SVG remains the no-WebGL/mobile/reduced-motion fallback. There is no video, remote texture, stock model or external script CDN in the page.

## Distributed fonts

| Asset | Copyright / license | Source and notice |
|---|---|---|
| DM Sans 400, 600, 700 WOFF2 | DM Sans Project Authors, SIL Open Font License 1.1 | [Upstream project](https://github.com/googlefonts/dm-fonts), [Google Fonts license](https://github.com/google/fonts/blob/main/ofl/dmsans/OFL.txt); full notice at `public/assets/licenses/DM-Sans-OFL.txt` |
| JetBrains Mono Regular WOFF2 | JetBrains Mono Project Authors, SIL Open Font License 1.1 | [Upstream](https://github.com/JetBrains/JetBrainsMono); full notice at `public/assets/licenses/JetBrains-Mono-OFL.txt` |

Font binaries were copied from existing local project assets, retaining their font identities; no font names were reassigned. JetBrains Mono is locally subset to the Latin/technical-label characters used here using FontTools, reducing the download without changing the family name; the upstream notice lists no Reserved Font Name. It remains distributed under OFL 1.1. License text was checked against upstream. Georgia and Arial are system fallbacks and are not redistributed. FontTools is a local authoring utility and is not shipped or required to run/build this site.

## Owner's portfolio materials

The unchanged résumé belongs to the owner and was already present in the public portfolio. Project names and technical descriptions are based on the owner's public repositories and résumé. The TermWise overview screenshot is an existing capture from `Ratnadeep-2007/TermWise-AI/docs/screenshots/overview.png`; the repository is MIT, copyright 2026 Ratnadeep Patil. Its notice is retained at `public/assets/licenses/TermWise-MIT.txt`. It is presented as an interface overview, without invented results or private customer data.

The ContextGuard repository is MIT; no application code or concept artwork was copied. Synora's README states MIT but the current tree has no standalone LICENSE; no Synora code or image was imported. Face → Web → Blockchain's README states MIT; only its technical structure is summarized and an independent diagram drawn.

## Investigated, not distributed

- The inspected Three.js interactive-cubes, fat-lines and CSS2D-label example snippets were not copied. The library itself is now distributed under the notice above. [License](https://github.com/mrdoob/three.js/blob/dev/LICENSE).
- Motion: MIT, Motion B.V. [License](https://github.com/motiondivision/motion/blob/main/LICENSE.md).
- Lenis: MIT, darkroom.engineering. [License](https://github.com/darkroomengineering/lenis/blob/main/LICENSE).
- OGL: package metadata specifies Unlicense. [Metadata](https://github.com/oframe/ogl/blob/master/package.json). No OGL source is included.

Only general demo ideas were adapted: semantic labels synchronized with selected graphic state, and purposeful feedback. Scene geometry and behaviors are independently authored; no external demo snippet is pasted. GSAP, React Three Fiber, Codrops assets, icon packages and stock images are not used.

## Research evidence

External pages were read through permitted web/GitHub tools. Their browser rendering was blocked. No reference designer screenshot is distributed as portfolio art. Local baseline and QA screenshots show the owner's own website. Source URLs, limitations and dates are recorded in `docs/reference-audit.md`.
