# Mount-only effects

Biome bans importing `useEffect`/`useLayoutEffect`. The only allowed effect is `useMountEffect` (`hooks/use-mount-effect.ts`): setup on mount, cleanup on unmount. Anything else is derived state, an event handler, a `key` reset, or `useSyncExternalStore`. The hover-capability query in Projects and the mounted guard in DitherHeader both use `useSyncExternalStore`. Each has a server snapshot of `false`, so SSR and hydration render without them.

`VisitorCount` keeps its request in a module-level promise shared across mounts. Otherwise StrictMode's dev double-mount would POST twice and count one visitor as two.
