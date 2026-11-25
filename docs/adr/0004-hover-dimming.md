# Hover dimming targets children

Hovering an item in a `[data-dim-group]` fades its siblings to 0.4 and nudges the hovered item 0.25rem. The CSS targets the item's children (`[data-dim-item] > *`), not the item itself, because the entrance animation's `forwards` fill pins opacity and transform on the item. The rules only apply under `(hover: hover) and (pointer: fine)`, so a tap can't leave a row stuck dimmed.
