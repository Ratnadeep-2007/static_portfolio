# Reference research and interaction audit

Access date: **1 November 2026**. The distinction between observation and inference is part of this report.

## Method and evidence boundary

The live GitHub baseline was fetched and independently captured with Edge/Playwright at desktop 1440×900, tablet 768×1024 and mobile 390×844. The saved desktop image was opened and inspected. Local redesign behavior is directly tested separately in `qa-results.md`.

All eight required external portfolios, plus the Hatchable comparison, were attempted in the real browser. Every navigation failed with **`net::ERR_NETWORK_ACCESS_DENIED`** before rendering. Full errors, timestamps and URLs are in the local `docs/research/browser-observations.json`. No external blocked-page screenshot is accepted as a portfolio screenshot. Tablet/mobile rendering, pointer effects, timing, computed fonts/colors, and transitions could therefore **not** be measured. No claim below presents a reference interaction as directly browser-observed.

The web retrieval tool could access several pages and primary source code. These are labeled **source-derived**, not live visual observations. The local research folder is intentionally excluded from publication; no designer's screenshots, source, or proprietary assets are included in the production site.

## 1. Yoichi Kobayashi — primary reference

Sources: [live site](https://www.tplh.net/), [author interview, Communication Arts](https://www.commarts.com/webpicks/yoichi-kobayashi).

| Area | Evidence and limitation | Decision |
|---|---|---|
| Identity/centerpiece | Live text retrieval returns a JavaScript-required shell. In the older author interview, Kobayashi explains the folklore-rooted onibi effect and Three.js/Vue implementation. It is a historical description, not proof of the current rendering. | Give the centerpiece a reason tied to Ratnadeep's own work; do not reproduce the onibi/fire identity. |
| Navigation/motion | The interview describes coordinated DOM and WebGL movement during navigation. Exact real-time effects, scroll triggers, fonts, colors and current timing are unverified. | Keep useful content in semantic HTML, independent of any visual enhancement. |
| Responsive/a11y | No external viewport or keyboard state was rendered. | No borrowed responsive rules; independently test all local states. |

## 2. Kiran Naragund — primary reference

Sources: [live site](https://kirannaragund.com/), [author profile](https://dev.to/dev_kiran/), [older author portfolio post](https://dev.to/dev_kiran/portfolio-explore-my-world-1jge).

| Area | Evidence and limitation | Decision |
|---|---|---|
| Entry/story | Current retrieval has a title but no readable page structure. The author's profile links the site and public work. The older post describes a React portfolio; it must not be treated as the current UI. | Express personality through project questions and direct writing. |
| Browser/Google metaphor | The brief asks whether this still exists. It **could not be verified**; no search-page behavior is claimed. | Do not implement a parody search interface or a discovery gate. |
| Motion/responsive | Loading, menu, type, hover, keyboard and phone adaptations are unverified. | Offer immediate links and simple native navigation in our implementation. |

## 3. Dennis Snellenberg — primary reference

Source: [live homepage content](https://dennissnellenberg.com/).

| Area | Evidence and limitation | Decision |
|---|---|---|
| Architecture | Retrieved headings contain the designer's name, discipline, recent work, about, contact and an archive. Project entries describe role/discipline. | Let visitors move from identity to specific work, with context about the contribution. |
| Composition/motion | Oversized typography, cursor-follow previews, magnetic buttons, menu overlays and transitions were requested for inspection but are **not verified here**. No measured size, easing or timing is assigned. | Use independently composed large type, ordinary link targets and restrained hover feedback; no cursor replacement. |
| Responsive/a11y | No rendered viewport or focus capture. | Validate our own page rhythm, menu, focus and minimum widths. |

## 4. Rauno Freiberg — secondary reference

Source: [live page content](https://rauno.me/).

| Area | Evidence and limitation | Decision |
|---|---|---|
| Content/craft | Text retrieval exposes a concise professional introduction, named projects, writing and direct social/email actions. Email and copied-state labels are present, but clicking was not observed. | Keep small interactions purposeful; make source and contact actions easy to find. |
| Visual/motion | Exact spacing, contrast, focus ring, hover and responsive changes remain unmeasured. | Use tested local contrast and keyboard states rather than imitating an assumed appearance. |

## 5. Emil Kowalski — secondary reference

Sources: [homepage](https://emilkowal.ski/), [author's motion essay](https://emilkowal.ski/ui/you-dont-need-animations).

| Area | Evidence and limitation | Decision |
|---|---|---|
| Credibility | Retrieved content organizes a short biography, named projects and writing. | Specific engineering decisions should carry the portfolio's credibility. |
| Interaction principles | The author's essay argues for purposeful, fast state feedback and avoiding repeated keyboard delays. Its demo controls are retrievable but not interactively rendered here. | State updates occur immediately; only a short optional visual transition accompanies a selection. |
| Responsive | Fonts, breakpoints and exact component motion were not measured. | Local motion values are design decisions, not copied measurements. |

## 6. Bruno Simon — secondary reference

Sources: [live site content](https://bruno-simon.com/), linked public source and behind-the-scenes section on that page.

| Area | Evidence and limitation | Decision |
|---|---|---|
| Experience/controls | Retrieved content describes driving, keyboard/touch/gamepad controls, audio/quality settings, recovery and a map. It also exposes a behind-the-scenes explanation. | Clear interaction instructions and recovery matter as much as spectacle. |
| Technical craft | The author identifies Three.js and links source under MIT. Actual physics, loading, performance and renderer behavior were not run. | A smaller model can prove engineering skill without a game or GPU loop. |
| Cost | Desktop/mobile performance and loading are unknown here. | Do not reproduce the driving game, 3D world, controls or assets. |

## 7. Paco Coursey — secondary reference

Source: [live page content](https://paco.me/).

| Area | Evidence and limitation | Decision |
|---|---|---|
| Content hierarchy | Retrieved sections separate building, projects, writing, now and connect. Short project descriptions explain purpose. | Reduce filler; pair project names with a concrete problem and direct source link. |
| Visual/motion | Sparse visual appearance is a direction to evaluate, not a measured screenshot finding. Exact fonts, whitespace, focus and mobile behavior remain unverified. | Use quiet rules and deliberate spacing; keep content more detailed where the engineering needs it. |

## 8. Robby Leonardi — secondary reference

Sources: [requested interactive résumé](https://www.rleonardi.com/interactive-resume/), [author's main site](https://rleonardi.com/).

| Area | Evidence and limitation | Decision |
|---|---|---|
| Narrative | The interactive URL failed in browser and web retrieval (502). The author describes the project as a résumé combined with a video game. | Give exploration a narrative, while letting readers go directly to any project. |
| Controls/responsive | Scrolling, keyboard movement, art, level transitions and viewport changes are not directly verified. Older public demonstrations establish the concept, not its current availability. | Do not reproduce the side-scrolling format, characters or artwork; do not hide contact at the end of an experience. |

## Hatchable comparison

[The previous experiment](https://ratnadeep-systems.hatchable.site) failed in browser and web retrieval. No sign-in bypass was attempted. Its appearance or interaction is not treated as observed evidence; the charcoal/copper baseline is independently specified in the owner's brief.

## Open-source interaction candidates: six investigated

Live demo pages were requested through web retrieval; WebGL pages expose only their shell there. Public source was inspected for the three Three.js examples and OGL raycasting; Motion's docs and license and Lenis's documentation/license were checked. Runtime animation performance remains unverified on these external demos.

| Live example / source | Technique and license evidence | Decision |
|---|---|---|
| [Three.js interactive cubes](https://threejs.org/examples/webgl_interactive_cubes.html) / [source](https://github.com/mrdoob/three.js/blob/dev/examples/webgl_interactive_cubes.html) | Pointer normalization, raycasting, hit-state feedback; Three.js MIT | Learn the selection→feedback principle. Native HTML buttons and SVG state eliminate hit-testing and accessibility duplication here. No code copied. |
| [Three.js fat lines](https://threejs.org/examples/webgl_lines_fat.html) / [source](https://github.com/mrdoob/three.js/blob/dev/examples/webgl_lines_fat.html) | Screen-space line material and geometry; MIT | A legible connector diagram matters; ordinary original SVG strokes suffice. No library imported. |
| [Three.js CSS2D labels](https://threejs.org/examples/css2d_label.html) / [source](https://github.com/mrdoob/three.js/blob/dev/examples/css2d_label.html) | DOM labels synchronized with graphics; MIT | Adopt separation of semantic text and visual state. The explorer's native explanation remains independent of the diagram. |
| [OGL projection/raycasting](https://oframe.github.io/ogl/examples/raycasting.html) / [source](https://github.com/oframe/ogl/blob/master/examples/raycasting.html) | Bounds raycasts and uniform-based selection color. Package metadata specifies Unlicense. | Evaluated but not reused; a WebGL renderer adds no demonstrated user benefit for this schematic. |
| [Motion SVG/path documentation](https://motion.dev/docs/animate) / [license](https://github.com/motiondivision/motion/blob/main/LICENSE.md) | Short HTML/SVG state transitions; MIT | Use an independently written 220 ms CSS state transition. No Motion dependency needed. |
| [Lenis live site](https://lenis.dev/) / [source/license](https://github.com/darkroomengineering/lenis) | Coordinated scrolling; MIT | Rejected for this project. Native scrolling already supports anchors, browser history and input preferences. |

Three.js MIT was checked at [the license file](https://github.com/mrdoob/three.js/blob/dev/LICENSE). OGL's metadata is [here](https://github.com/oframe/ogl/blob/master/package.json). No GSAP, Codrops snippet, animation source, creator asset or proprietary font is imported. Only two general interaction principles are adapted: synchronized semantic/visual selection, and short purposeful state feedback. Their implementation is original.
