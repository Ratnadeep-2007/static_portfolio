# Motion specification — expressive revision

Updated 1 November 2026 after the owner requested clearly visible scroll animation and Three.js effects. This supersedes the deliberately restrained first-pass motion specification. The charcoal/ivory/copper identity and semantic content remain unchanged.

| Event / trigger | Treatment | Timing / implementation | Reduced-motion fallback |
|---|---|---|---|
| Initial name entry | Each line uncovers from below its text mask, with a small rotational settle | 1050 ms; second line delayed 130 ms; cubic-bezier(.16,1,.3,1) | Static readable name |
| Hero supporting copy | Staggered 22 px arrival of discipline, bio, social links and work cue | 700–800 ms; delays 60–420 ms | No animation |
| Page scroll | Reading-progress rule follows position; hero text and study move at different restrained rates | One requestAnimationFrame scheduled per passive input frame, no idle page-wide loop | No positional drift; progress remains informative |
| Editorial section entry | Headings, project text, biography and timeline rows arrive 42 px upward with a shallow mask | 760 ms; cubic-bezier(.22,1,.36,1), once per element | Static prose |
| Project artwork entry | Diagram reveals horizontally, then its connections draw in | 1100 ms wipe; paths draw for 1100 ms with a small stagger | Complete static diagram |
| Project visual scroll/hover | Artwork shifts at most 12 px with scroll, and scales 1.025 on hover/focus | Scroll updates coalesced; scale 400 ms | No movement |
| Work-index progress | Sticky project index marks the article currently passing the reading area | Native sticky layout; 300 ms underline transition | Selection remains clear |
| Desktop system study | Original Three.js layered blocks, edges and moving signal packets; limited damped pointer pitch/yaw | Local three@0.187.0; 30 fps cap, DPR cap 1.5; rendered only while visible and page active | Native SVG, no renderer import |
| Source/stage choice | Selected material/route, explanation and source citation change together | Immediate state update; pointer-only short text emphasis | Immediate state update |
| Mobile / no WebGL | Original SVG remains readable; selected connections carry a moving dashed signal | 1800–3000 ms CSS cycle while visible | Complete static connections |
| Menu / focus | Native expansion, Escape closure and focus return; anchor focus moves into content | Immediate | Same |
| Hover/press | Copper/ink contrast, small arrow shift, 0.97 press scale | 160–220 ms | Instant state |

Animations do not require a fake preloader, audio, a video background, remote models, stock assets, or a scroll-smoothing library. Text starts with a readable static layout; Web Animations are attached only after successful initialization. There is no permanent hidden-content class. Keyboard activation skips the text-emphasis animation.

Three.js resources are disposed on teardown and when reduced motion/mobile fallback is selected. Rendering stops when the scene leaves the viewport or the tab is hidden. Context loss restores the SVG. CSS signal animation is disabled when the 3D renderer is visible, preventing two renderers from running for the same graphic.

The local motion-preview.webm is an actual browser recording for review, not a generated background video or a required deployment asset. Motion is tested in scripts/check-motion.py and documented in docs/motion-results.json.
