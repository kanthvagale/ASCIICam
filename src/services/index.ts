/**
 * Service layer.
 *
 *   controllers/ — ViewModels. One per route, consumed by the view in `src/app`.
 *   captures/    — capture files on disk and exporting them to Photos.
 *
 * Prefer the subpath (`@/services/controllers`) over this barrel so a view only
 * pulls in the layer it actually uses.
 */
export * from "./captures";
export * from "./controllers";
