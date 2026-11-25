# No code comments

Comments drift from the code and let hacks stand without a fix, so source files carry none. A decision worth keeping goes in an ADR here, and a hack gets a GitHub issue. `pnpm lint` runs `scripts/check-comments.mjs`, a ratchet that fails when any file has more comments than `comment-baseline.json` allows. It also fails when a file has fewer, until `pnpm lint:comments --update` locks the drop in. The update never raises a count, so the baseline only goes down.

`biome-ignore` suppressions are exempt, because biome requires them. TS/TSX comments are found with the TypeScript parser, not a regex, and JSX text is skipped so a `//` inside a URL isn't counted. CSS comments are found with a regex.
