import { scale } from "react-native-size-matters";

/**
 * 4pt scale, pre-scaled for device width.
 * `react-native-size-matters` is imported ONLY inside src/theme — screens read
 * `theme.spacing.md` so the scaling strategy stays swappable in one place.
 */
export const spacing = {
  xs: scale(4),
  sm: scale(8),
  md: scale(12),
  lg: scale(16),
  xl: scale(24),
  xxl: scale(32),
  xxxl: scale(48),
} as const;

export type Spacing = typeof spacing;
