# Page entrance order

The page fades in top to bottom, one element every 70ms (`--enter-stagger`). `app/page.tsx` owns the order: each section gets its first `step` and staggers its own elements from there. `Section` puts its heading at `step` and its children from `step + 1`. The CSS `enter` utility turns `--step` into an `animation-delay`. Contribution graph dots read the inherited `--step` and add their own column offset.

The reduced-motion override in `globals.css` is deliberately unlayered, so it beats the `enter` and `animate-dot-in` utilities that start elements at opacity 0.

Each section module exports how many steps it uses (`HERO_STEPS`, `GRAPH_STEPS`, `PROJECTS_STEPS`, `EXPERIENCE_STEPS`) next to the elements it counts, and the page adds them up. When the contribution fetch fails, the graph is skipped and its steps are not reserved. `PROJECTS_STEPS` lives in the server module `projects.tsx`, not in the client `project-list.tsx`, because a server component that imports a constant from a `"use client"` module gets a client reference, not the number.
