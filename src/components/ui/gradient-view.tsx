import { LinearGradient } from "expo-linear-gradient";
import type { PropsWithChildren } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { useTheme, type GradientPreset } from "@/theme";

export type GradientViewProps = PropsWithChildren<{
  preset?: GradientPreset;
  style?: StyleProp<ViewStyle>;
}>;

/** Keeps gradient stops in the theme instead of scattered across screens. */
export function GradientView({
  preset = "primary",
  style,
  children,
}: GradientViewProps) {
  const { gradients } = useTheme();
  const gradient = gradients[preset];

  return (
    <LinearGradient
      colors={gradient.colors}
      start={gradient.start}
      end={gradient.end}
      style={style}
    >
      {children}
    </LinearGradient>
  );
}
