import { darkColors, lightColors } from "./colors";
import { darkGradients, lightGradients } from "./gradients";
import { radii } from "./radii";
import { shadows } from "./shadows";
import { sizes } from "./sizes";
import { spacing } from "./spacing";
import type { ColorScheme, Theme } from "./types";
import { typography } from "./typography";

const shared = { spacing, typography, radii, shadows, sizes };

export const lightTheme: Theme = {
  scheme: "light",
  isDark: false,
  colors: lightColors,
  gradients: lightGradients,
  ...shared,
};

export const darkTheme: Theme = {
  scheme: "dark",
  isDark: true,
  colors: darkColors,
  gradients: darkGradients,
  ...shared,
};

export const themes: Record<ColorScheme, Theme> = {
  light: lightTheme,
  dark: darkTheme,
};
