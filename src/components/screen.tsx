import { StatusBar } from "expo-status-bar";
import type { PropsWithChildren, ReactNode } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { makeStyles, useTheme } from "@/theme";

import { Header } from "./ui/header";

export type ScreenProps = PropsWithChildren<{
  title: string;
  /** Header's trailing slot — icon buttons. */
  right?: ReactNode;
}>;

/**
 * Shell for every themed screen: safe area, theme background, a status bar
 * that matches the theme (the camera and splash force a light one), and the
 * shared header with a back button.
 */
export function Screen({ title, right, children }: ScreenProps) {
  const styles = useStyles();
  const theme = useTheme();

  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      <StatusBar style={theme.isDark ? "light" : "dark"} />
      <View style={styles.header}>
        <Header title={title} showBack right={right} />
      </View>
      {children}
    </SafeAreaView>
  );
}

const useStyles = makeStyles((theme) => ({
  root: { flex: 1, backgroundColor: theme.colors.background },
  // Header icons sit in `control.md` hit areas; pull them out by the area's
  // padding so the glyphs line up with the content's `lg` margin below.
  header: {
    paddingHorizontal: Math.max(
      0,
      theme.spacing.lg - (theme.sizes.control.md - theme.sizes.icon.md) / 2,
    ),
  },
}));
