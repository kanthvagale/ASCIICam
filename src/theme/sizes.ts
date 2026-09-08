import { scale, verticalScale } from "react-native-size-matters";

export const sizes = {
  icon: {
    xs: scale(14),
    sm: scale(18),
    md: scale(22),
    lg: scale(28),
    xl: scale(40),
  },
  avatar: {
    sm: scale(32),
    md: scale(48),
    lg: scale(88),
  },
  control: {
    sm: verticalScale(36),
    md: verticalScale(44),
    lg: verticalScale(52),
  },
  hitSlop: { top: 8, bottom: 8, left: 8, right: 8 },
  border: 1,
  tabBar: verticalScale(56),
  /**
   * Bottom padding a tab screen's scroll content needs so the last item clears
   * the floating tab bar. Screens add their own safe-area inset on top.
   */
  tabBarInset: verticalScale(56) + scale(32),
} as const;

export type Sizes = typeof sizes;
