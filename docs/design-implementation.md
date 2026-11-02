# Applying Design.md

Implemented 2 November 2026. `Design.md` is the source brief. This record distinguishes its assumptions, completed work and remaining external checks.

## Resolved assumptions

- The actual stack is pre-rendered HTML, modular CSS and browser JavaScript, bundled with esbuild. The brief explicitly allows adaptation to the real stack. Kept this static architecture; no React, TypeScript, Tailwind, Motion, GSAP, Lenis or component-kit migration was necessary to implement the interactions. No application dependencies were added.
- The owner's more recent palette direction takes precedence over the cream assumption: near-black, faint purple light, orange code details. No light-theme toggle or cream interlude was introduced.
- The existing Hatchable destination provides HTTPS. An S3/CloudFront custom-domain setup was not provisioned; no domain was supplied or purchased.
- Retained the existing self-hosted DM Sans and JetBrains Mono fonts. DM Sans files are static, so the optional Fraunces variable-font sweep is not applied.
- Downloaded the exact portrait URL previously supplied by the owner and self-hosted a 26KB WebP. No generated portrait or expiring image hotlink is used in the site. The original PDF remains byte-for-byte unchanged.
- Internship months now match the supplied CV: Exprivia November 2025–January 2026; Spider Smart Solutions April 2025–July 2026. The source CV's dates were not silently corrected or reinterpreted.

## Phase coverage

| Phase / IDs | Result |
|---|---|
| Foundation | Shared `motion.config.js`, matching CSS duration/easing tokens, reduced-motion handling, local assets, static routes and HTTPS-compatible output |
| Remove template tells | No project numbering in navigation/cards, sentence-case section labels, plain headings, internal arrows distinguished from external-source arrows, no repeating word marquee |
| M1 / M2 | Masked character reveal after fonts load, once per page; rotating hero phrase with a readable static reduced-motion version |
| D1 | Synora source buttons connect to shared context, retain their provenance, highlight a hovered chain and reset |
| D2 | ContextGuard compares two fictional conflicting passages, records a user clarification, retains both sources and fills a kickoff brief |
| D3 | TermWise's advance slider recalculates a four-event cash timeline and reserve requirement; ledger values count to the new result; keyboard input and reduced motion work |
| D4 | SHA-256 over the actual displayed synthetic RGBA pixel array, one-pixel mutation, failed integrity state and restoration to the original digest; no real face matching or blockchain claim |
| S1 | 1,000 points, two precomputed position buffers and a vertex-shader morph from trefoil to four project nodes. Edges and accessible HTML labels become available as the graph resolves |
| L2 | Desktop-only native-scroll project reel, previous/next controls, index links and focus-driven panel navigation. Mobile, coarse pointers, small viewports and reduced motion use a normal vertical stack |
| L3 / L4 | Scroll-linked experience timeline and tool-to-project map with matching connection paths, keyboard/touch selection and a status announcement |
| L5 | Consistent masked entrance reveal with ordinary case-study navigation. Native cross-document View Transitions were trialed and removed after Chromium emitted an abort during resize/navigation stress testing |
| Micro-interactions | Magnetic primary/contact CTA, fine-pointer contextual hint, copy-email check/label feedback, shared underline behavior, reading progress, visible focus |
| Optional command menu | Ctrl/Cmd+K, native modal focus handling and Escape, section navigation and copy email; works on case-study pages too |

## Visual review and repairs

Inspected the first hero, project reel and mobile captures, then the knot/graph, clarification demo, cash demo, skills map, about portrait and final mobile captures. Repaired text-encoding errors, tightened mobile anchor offsets, matched graph labels to their projected nodes, and changed the brand mark to decorative SVG after the accessible-name audit. A final stress pass also exposed a native View Transition abort and a paused-frame stability issue. Kept the masked reveal, froze scroll progress while paused, and preserved the WebGL drawing buffer. No-JS demos are explicitly disabled and retain their disclosure and case-study links.

## Performance and access

The scene is lazy-loaded, capped at 1.5 DPR and approximately 30fps, pauses offscreen/when hidden, and disposes GPU resources. Mobile/coarse pointers and reduced motion skip the renderer. WebGL failure keeps a static SVG with normal project links. There is one live 3D renderer; the hero preview is static vector artwork. Native scrolling remains in control; there is no wheel interception or smooth-scroll dependency.

The calculator uses fictional, disclosed integer amounts and a fixed event order. It is a demonstrator of cash timing, not the actual TermWise engine or financial advice. No demo sends inputs to a backend or third-party service.

## Remaining limits and choices

- Physical mid-range Android testing is still required; browser touch/viewport emulation does not establish that result.
- Lighthouse results are controlled local headless audits with animation enabled. They do not benchmark every device, connection, or the entire scrolled WebGL experience. See `lighthouse-summary.json` and `qa-results.md`.
- No custom domain, calendar service or analytics destination was supplied. No fake calendar link, availability claim, testimonials or performance metrics were added. Third-party analytics is not enabled.
- The optional paid-query portfolio agent is not implemented; the site remains fully static.
- The companion `Design-Review.md` was not present in the workspace. Implementation uses `Design.md` itself and actual browser evidence.
- Existing earlier-revision motion/browser scripts and their reports are historical evidence. The current browser gate is `npm run test:browser`, which runs `scripts/check-design.py`.

All new UI, shaders and demos are original code. Three.js remains pinned with its MIT notice; existing font licenses remain. Lighthouse/axe were used as development audit tools, not added to the site's runtime dependencies.
