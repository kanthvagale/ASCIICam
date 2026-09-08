/**
 * Zustand stores — shared and persisted state.
 *
 * A store owns state; a controller in `@/services/controllers` reads from it
 * and shapes it for one view. Select narrowly in components
 * (`useFooStore((s) => s.count)`) so a change to one slice doesn't re-render
 * every consumer of the store.
 */
export * from "./persist-storage";
export * from "./use-has-hydrated";
