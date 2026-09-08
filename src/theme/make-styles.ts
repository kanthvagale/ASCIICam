import { useMemo } from "react";
import { StyleSheet, type ImageStyle, type TextStyle, type ViewStyle } from "react-native";

import { useTheme } from "./theme-provider";
import type { Theme } from "./types";

type NamedStyles = Record<string, ViewStyle | TextStyle | ImageStyle>;

/**
 * Turns a theme-aware style factory into a hook.
 *
 *   export const useLoginStyles = makeStyles((t) => ({
 *     root: { padding: t.spacing.lg, backgroundColor: t.colors.background },
 *   }));
 *
 * Styles are recomputed only when the theme object identity changes
 * (i.e. on light/dark switch), so this is cheap on every other render.
 */
export function makeStyles<T extends NamedStyles>(factory: (theme: Theme) => T) {
  return function useStyles() {
    const theme = useTheme();
    return useMemo(() => StyleSheet.create(factory(theme)), [theme]);
  };
}
