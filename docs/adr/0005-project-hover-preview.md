# Project hover preview

On devices that can hover, a paper-framed screenshot follows the cursor over the project list. It is portaled to `body` and only mounts when `(hover: hover) and (pointer: fine)` matches, so touch devices and the server never render it.

- The card lerps toward the cursor and its rAF loop stops once settled; the next `mousemove` restarts it. The card keeps tracking while hidden, so it never jumps when it reappears.
- `previewIndex` keeps the last hovered project after the pointer leaves, so the image holds while the card fades out. Visibility is a separate boolean.
- The torn edge is a `clip-path` polygon. A clip-path also clips `box-shadow`, so the shadow is a `drop-shadow` filter on the parent.

Project data: `url` is where the name links (the live site, or the repo if there's no live site). `source` is the repo, listed separately only when `url` is a live site.
