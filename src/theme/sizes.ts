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
  /** Screen header row; holds one `control.md` icon button plus breathing room. */
  header: verticalScale(56),
  border: 1,
  switch: {
    width: scale(46),
    height: scale(28),
    /** Gap between the thumb and the track edge. */
    inset: scale(3),
  },
  /** Camera shutter and its outer ring. */
  shutter: scale(72),
} as const;

export type Sizes = typeof sizes;
