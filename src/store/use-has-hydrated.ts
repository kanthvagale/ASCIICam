import { useEffect, useState } from "react";

/** The subset of a persisted zustand store's API that hydration depends on. */
type HydratableStore = {
  persist: {
    hasHydrated: () => boolean;
    onFinishHydration: (fn: () => void) => () => void;
  };
};

/**
 * Whether a persisted store has finished reading from AsyncStorage.
 *
 * Subscribing beats reading `hasHydrated()` once: hydration can land after the
 * first render, and that wouldn't re-render on its own.
 */
export function useHasHydrated(store: HydratableStore): boolean {
  const [hydrated, setHydrated] = useState(() => store.persist.hasHydrated());

  useEffect(() => {
    if (hydrated) return;
    return store.persist.onFinishHydration(() => setHydrated(true));
  }, [store, hydrated]);

  return hydrated;
}
