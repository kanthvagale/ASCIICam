import {
  ErrorBoundary as RouterErrorBoundary,
  type ErrorBoundaryProps,
  SplashScreen,
  Stack,
  usePathname,
} from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

import useFontLoading from "@/hooks/use-font-loading";
import { FadeScreen, stackScreenOptions } from "@/layout";
import { AppProviders } from "@/providers";
import { reportError, setScreen } from "@/services/crashlytics";
import { useThemeContext } from "@/theme";

// Keep the native splash up until theme and fonts load.
void SplashScreen.preventAutoHideAsync();

export function ErrorBoundary(props: ErrorBoundaryProps) {
  useEffect(() => {
    reportError(props.error, "render");
  }, [props.error]);

  return <RouterErrorBoundary {...props} />;
}

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
  const pathname = usePathname();

  useEffect(() => {
    setScreen(pathname);
  }, [pathname]);

  useEffect(() => {
    if (isBootstrapped) void SplashScreen.hideAsync();
  }, [isBootstrapped]);

  if (!isBootstrapped) return null;

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={stackScreenOptions}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(main)" options={FadeScreen} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
}
