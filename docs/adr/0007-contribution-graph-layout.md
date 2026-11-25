# Contribution graph layout

Columns are weeks starting on Sunday. The first week is padded with empty cells, so rows line up with weekdays (dates are read in UTC). A month label sits on the week holding that month's 1st, skipping the first column and the last two, where it would clip.

The tooltip keeps its last text in state separately from its visibility, so the text stays while it fades out. It is positioned with CSS `clamp()` inside `translate`, where `%` is the tooltip's own size. That centers it over the dot and keeps it inside the graph without measuring it. On narrow screens the graph scrolls, and it opens scrolled to the most recent weeks.
