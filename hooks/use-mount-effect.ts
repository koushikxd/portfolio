import { type EffectCallback, useEffect } from "react";

// The one sanctioned effect: setup on mount, cleanup on unmount.
// Everything else should be derived state, an event handler, or a key reset.
export function useMountEffect(effect: EffectCallback) {
  useEffect(effect, []);
}
