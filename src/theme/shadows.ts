import { Platform, type ViewStyle } from "react-native";

const make = (
  elevation: number,
  opacity: number,
  radius: number,
  offsetY: number
): ViewStyle =>
  Platform.select<ViewStyle>({
    ios: {
      shadowColor: "#0B1420",
      shadowOpacity: opacity,
      shadowRadius: radius,
      shadowOffset: { width: 0, height: offsetY },
    },
    android: { elevation },
    default: {
      boxShadow: `0px ${offsetY}px ${radius}px rgba(11,20,32,${opacity})`,
    } as ViewStyle,
  })!;

export const shadows = {
  none: {} as ViewStyle,
  sm: make(2, 0.06, 4, 1),
  md: make(4, 0.1, 10, 4),
  lg: make(10, 0.16, 20, 8),
} as const;

export type Shadows = typeof shadows;
