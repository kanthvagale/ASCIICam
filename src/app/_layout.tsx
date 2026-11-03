import { SplashScreen } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

import useFontLoading from "@/hooks/use-font-loading";
import { TransitionStack as Stack } from "@/layout";
import { AppProviders } from "@/providers";
import { useThemeContext } from "@/theme";

// Keep the native splash up until the persisted theme and fonts are ready —
// otherwise the first frame flashes the wrong theme or a fallback font.
void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <AppProviders>
      <RootNavigator />
    </AppProviders>
  );
}

function RootNavigator() {
  const { isReady: themeReady } = useThemeContext();
  const { isReady: fontReady } = useFontLoading();

  const isBootstrapped = themeReady && fontReady;

  useEffect(() => {
    if (isBootstrapped) void SplashScreen.hideAsync();
  }, [isBootstrapped]);

  if (!isBootstrapped) return null;

  return (
    <>
      {/* Splash and camera are always black, so the status bar starts light;
          themed screens set their own. */}
      <StatusBar style="light" />
      <Stack>
        <Stack.Screen name="index" />
        <Stack.Screen name="(main)" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
}
