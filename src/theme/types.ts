import type { Colors } from "./colors";
import type { Gradients } from "./gradients";
import type { Radii } from "./radii";
import type { Shadows } from "./shadows";
import type { Sizes } from "./sizes";
import type { Spacing } from "./spacing";
import type { Typography } from "./typography";

export type ThemeMode = "light" | "dark" | "system";
export type ColorScheme = "light" | "dark";

export type Theme = {
  scheme: ColorScheme;
  isDark: boolean;
  colors: Colors;
  gradients: Gradients;
  spacing: Spacing;
  typography: Typography;
  radii: Radii;
  shadows: Shadows;
  sizes: Sizes;
};
