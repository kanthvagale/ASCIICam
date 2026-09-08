import { scale } from "react-native-size-matters";

export const radii = {
  none: 0,
  sm: scale(6),
  md: scale(10),
  lg: scale(16),
  xl: scale(24),
  pill: 999,
} as const;

export type Radii = typeof radii;
