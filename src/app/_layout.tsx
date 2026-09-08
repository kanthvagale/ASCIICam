import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

import { stackOptions } from "@/constants/navigation";
import { useLocale } from "@/i18n";
import { AppProviders } from "@/providers";
import { useTheme, useThemeContext } from "@/theme";

// Keep the native splash up until the persisted theme and language have been
// read — otherwise the first frame flashes the wrong theme/direction.
void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <AppProviders>
      <RootNavigator />
    </AppProviders>
  );
}

function RootNavigator() {
  const theme = useTheme();
  const { isReady: themeReady } = useThemeContext();
  const { isReady: localeReady } = useLocale();

  const isBootstrapped = themeReady && localeReady;

  useEffect(() => {
    if (isBootstrapped) void SplashScreen.hideAsync();
  }, [isBootstrapped]);

  if (!isBootstrapped) return null;

  return (
    <>
      <StatusBar style={theme.isDark ? "light" : "dark"} />
      <Stack screenOptions={stackOptions} />
    </>
  );
}
