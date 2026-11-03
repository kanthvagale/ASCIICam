import { StatusBar } from "expo-status-bar";
import type { PropsWithChildren, ReactNode } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { makeStyles, useTheme } from "@/theme";

import { Header } from "./ui/header";

export type ScreenProps = PropsWithChildren<{
  title: string;
  right?: ReactNode;
}>;

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
  // Offset the hit area so icon glyphs align with the content.
  header: {
    paddingHorizontal: Math.max(
      0,
      theme.spacing.lg - (theme.sizes.control.md - theme.sizes.icon.md) / 2,
    ),
  },
}));
