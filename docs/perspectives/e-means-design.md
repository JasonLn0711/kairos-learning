# e-means perspective: content and figure contract

Reader: a learner familiar with vectors who wants to judge a clustering speed claim.
Main question: how do mini-batch EMA updates change the cost of reaching a specified
k-means objective, and what evidence is needed before adopting them?

Source: docs/sources/e-means/2026-11-15/ preserves the user manuscript, eight original
figures, eight prior redraws, mathematical notes and custody manifests. The full
fourteen-chapter article and each substantive subsection enter both language bodies.
Source/implementation/runtime/learner acceptance remain distinct.

The existing ordered perspective body supports named systems figures, but cannot
express these eight figures. Add one bounded `eMeansFigure` variant with eight
allowlisted names, following the existing systems-figure seam. It carries no URLs,
HTML, CSS or arbitrary SVG. Bilingual labels, notes and numeric data share one model.
Responsive HTML keeps labels searchable and readable; spatial SVG artwork retains
centroid placement and curves. A reviewed generator exports sixteen sub-100KB SVGs.
Equations use selectable Unicode/ASCII in existing locally scrollable code blocks;
no math parser, external font, plotting framework or dependency is added.

Publishing: original date/revision date 2026-11-15, contentVersion 1.0.0, revision 1.
Category analysis, topics cs/ai. The existing shared status/date gate owns routes,
listing and search. Related learning and links inside the body use existing APIs.

Acceptance: subsection content/adoption map; bilingual shape and semantic review;
all input equations/examples/tables; 8 figures in each locale; exact SVG generation,
16 SVG geometry and byte checks; 320/390/768/1280, 200% text, keyboard, no-JS, search,
list/language/related navigation; normal build restored after publication fixtures;
GitHub Pages target commit and production HTML/assets verified independently.

Editorial roles: Jason supplied source and authorized publication; the agent
structured, translated, redrew and checked it. Public author uses the existing
CS Kairos Learn brand. No personal learner completion or local GPU result claimed.
