# Theme toggle reveal

The dither banner is the theme toggle. Switching runs inside `document.startViewTransition`. The new theme wipes in top-down when going dark and bottom-up when going light: the toggle sets `data-theme-reveal` on `<html>`, and static CSS in `globals.css` picks the keyframes.

The shader color flips on click through `pendingDark`, before the view transition snapshots the old page. `pendingDark` clears once the new theme commits. The theme is unknown on the server, so the shader only renders after hydration.
