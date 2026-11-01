# Motion specification

These are independently chosen local timings. External reference timing could not be measured because browser network access was blocked.

| Event / trigger | Initial → final | Duration / easing | Reduced-motion treatment | Owner |
|---|---|---|---|---|
| Hero enters | 8 px below, partial opacity → final layout | 550 ms, cubic-bezier(.22,.61,.36,1); study delay 80 ms | No animation; final content visible | CSS `intro` |
| Header hover/focus | Neutral → copper, rule scales across link | 160–180 ms, same easing | Instant | SiteHeader styles |
| Social/link hover | Outline → copper/ink; arrow shifts 2 px | 180 ms | Instant, no transform transition | Shared link styles |
| Selected-work cue hover | Arrow moves down 3 px | 180 ms | Instant | HeroEditorial |
| Source or stage selection | Previous route/node/text → selected route/node/text | State immediate; optional 220 ms text opacity/3 px transition for pointer activation, no text-entry animation for keyboard activation; 200–220 ms stroke/color | Text and state update immediately, no animation | SystemExplorer / client.js |
| Project visual hover/focus | Diagram → 4 px upward shift | 280 ms, same easing | No transition | ProjectShowcase |
| Mobile menu click/Escape | Closed ↔ expanded navigation | Immediate layout change; no delayed focus | Same | SiteHeader / client.js |
| Anchor navigation | Current scroll → heading | Native CSS smooth scroll; browser chooses duration | Native instant scroll | HTML/CSS |
| Clipboard action | Empty status → success or actionable failure | Immediate polite announcement | Same | ContactSection |
| Year, active navigation | Current text/location → updated text/location | Immediate, no animation | Same | Footer / navigation observer |

No section-entry observer hides page content. No marquee, cursor takeover, magnetic force, perpetual animation, parallax, preloader, autoplay audio, scroll-jacking or physics loop is used. The small intro keyframes are progressive enhancement behind `prefers-reduced-motion: no-preference`; an unsupported script or observer cannot keep prose invisible.
