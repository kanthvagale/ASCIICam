import type { PropsWithChildren } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { LocaleProvider } from "@/i18n";
import { ThemeProvider } from "@/theme";

import { NetworkProvider } from "./network-provider";

/**
 * One place to see the whole provider stack, outermost first.
 * Order matters: theme and locale must resolve before anything renders UI.
 */
export function AppProviders({ children }: PropsWithChildren) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
        <SafeAreaProvider>
          <ThemeProvider>
            <LocaleProvider>
              <NetworkProvider>{children}</NetworkProvider>
            </LocaleProvider>
          </ThemeProvider>
        </SafeAreaProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

export * from "./network-provider";

