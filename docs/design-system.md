# Signal Atlas V6 — design decisions

Original design. Palette: Graphite `#101713`, ink `#0B110E`, mineral `#EFF1E9`, chalk `#F8FAF2`, signal lime `#C9F27A`, dark signal `#31552A`, supporting body text `#AAB7AB`. No gradients. Signal lime vs graphite contrast: 14.27:1; dark signal vs mineral: 7.48:1; muted paper text `#57665C` vs mineral: 5.33:1.

Typography remains self-hosted DM Sans and JetBrains Mono. Hero typography is enlarged and tighter. Page dividers, project art borders and hover states match the new palette. The hero evidence explorer retains its semantic SVG and keyboard-operable controls; a decorative, interactive 3D-perspective Canvas 2D topology is layered underneath it. This is not Three.js: native canvas is sufficient, reduces bundle overhead and can be paused. Project cards use bounded transforms. Scroll reveals use IntersectionObserver and progressively enhance existing content; they never hide content without JS. Reduced-motion users get a static topology. Canvas frames are capped at approximately 30fps, pixel ratio at 2, and rendering pauses out of view/when hidden.

Research references: https://rauno.me/craft, https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion, https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas. No third-party design/code/art assets copied.
