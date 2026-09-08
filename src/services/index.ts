/**
 * Service layer.
 *
 *   controllers/ — ViewModels. One per route, consumed by the view in `src/app`.
 *   api/         — everything that talks to the network.
 *
 * Prefer the subpath (`@/services/controllers`) over this barrel so a view only
 * pulls in the layer it actually uses.
 */
export * from "./api";
export * from "./controllers";
