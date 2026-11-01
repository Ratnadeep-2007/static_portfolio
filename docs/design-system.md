# Design system — a field notebook for working systems

The identity is an editorial engineer's notebook: large plain-language titles, fine rules, annotated original diagrams, and enough negative space to read. The slash in the typographic `r/p` wordmark separates two connected parts. It is original lettering, not a borrowed logo.

## Tokens

| Purpose | Value |
|---|---|
| Primary background | Charcoal `#171614` |
| Deep material | Near-black `#11100F` |
| Paper | Ivory `#EEE9E1` |
| Text on dark | Warm white `#F5F1EA` |
| Interactive emphasis | Copper `#DBA77A` |
| Dark rules | `#393530` |
| Muted text on dark | `#AAA399` |
| Muted text on paper | `#625B52` |
| Paper rules | `#CFC7BC` |

Solid colors only. No gradients, noise, glass, ornamental blobs, or shadow stacks. Copper identifies selection, links and provenance rather than filling every surface. Pale green/tan diagram annotations distinguish project studies without changing the page identity.

## Type

DM Sans, local WOFF2 at 400/600/700, is the sole display/body sans. Its compact forms keep the long first name legible and support a direct engineering voice. The existing system-font appearance was compared with the first local-font render; bundled fonts remove machine-dependent substitution. JetBrains Mono Regular provides restrained technical labels. Both fonts are SIL OFL 1.1 with local notices. Georgia italic is a system accent in three editorial headings, not a downloaded or proprietary typeface.

Hero name: fluid ~58–139 px, 1.01 line-height, carefully tuned negative tracking. Body: 14–16 px, line-height 1.75–1.95 where prose is dense. Case summaries: 19–23 px. Technical labels are supplementary; primary buttons remain 11–16 px and have at least 44 px touch height. Labels inside detailed diagrams have matching semantic text below the illustration.

## Composition and narrative

- Max reading/layout width 1392 px; desktop margins 56 px, intermediate 40 px, mobile 21 px.
- Main split hero pairs identity with a useful system study; mobile stacks identity before the explorer.
- Work moves onto paper because long-form technical comparison benefits from a lighter reading material.
- Synora and ContextGuard have the larger editorial treatment; the final two projects are more compact.
- About returns to charcoal; deep contact material closes the page without a decorative scene.
- Four case-study routes share a readable article grid and native in-page contents navigation.

## States and access

Links have focus rings and underline/contrast changes. Social actions use full visible text rather than small logos. Explorer source and stage buttons carry `aria-pressed`, minimum target heights, keyboard arrow/Home/End support, and synchronized polite announcements. The mobile menu is push-down navigation, not a modal; Escape closes it and restores focus. No-JS mode exposes ordinary navigation, hides inactive explorer controls and retains its static explanation.

## Image integrity

Every system diagram is independently authored from public README architecture and captioned as conceptual. The TermWise case study includes the owner's real overview screenshot, labeled as an actual interface capture. Reference creators' imagery is never used as project artwork. No portrait is fabricated: the supplied remote photo cannot currently be downloaded, so the redesign uses authentic written biography without claiming to show a photo.

## First visual revision

The 320 px first pass exposed a grid min-content overflow from the long name. The grid now uses `minmax(0,...)` and the phone name scale follows available width. Explorer label sizes were increased and its desktop drawing height constrained, bringing the study into the opening view without a continuous renderer. Full-page captures now explicitly load lazy figures before accepting screenshots.
