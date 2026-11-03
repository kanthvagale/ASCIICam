import { darkColors, lightColors } from "./colors";
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
  ...shared,
};

export const darkTheme: Theme = {
  scheme: "dark",
  isDark: true,
  colors: darkColors,
  ...shared,
};

export const themes: Record<ColorScheme, Theme> = {
  light: lightTheme,
  dark: darkTheme,
};
