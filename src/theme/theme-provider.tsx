import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { useColorScheme } from "react-native";

import { StorageKeys } from "@/constants/storage-keys";
import { storage } from "@/utils/storage";

import { themes } from "./themes";
import type { ColorScheme, Theme, ThemeMode } from "./types";

type ThemeContextValue = {
  theme: Theme;
  mode: ThemeMode;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  isReady: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const isThemeMode = (value: string | null): value is ThemeMode =>
  value === "light" || value === "dark" || value === "system";

export function ThemeProvider({ children }: PropsWithChildren) {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>("system");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    storage.get(StorageKeys.themeMode).then((stored) => {
      if (cancelled) return;
      if (isThemeMode(stored)) setModeState(stored);
      setIsReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    void storage.set(StorageKeys.themeMode, next);
  }, []);

  const scheme: ColorScheme =
    mode === "system" ? (systemScheme === "dark" ? "dark" : "light") : mode;
  const theme = themes[scheme];

  const toggleTheme = useCallback(() => {
    setMode(scheme === "dark" ? "light" : "dark");
  }, [scheme, setMode]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      mode,
      isDark: theme.isDark,
      setMode,
      toggleTheme,
      isReady,
    }),
    [theme, mode, setMode, toggleTheme, isReady]
  );

  return <ThemeContext value={value}>{children}</ThemeContext>;
}

export function useThemeContext(): ThemeContextValue {
  const ctx = use(ThemeContext);
  if (!ctx) throw new Error("useThemeContext must be used within ThemeProvider");
  return ctx;
}

/** The hook screens and components use. */
export function useTheme(): Theme {
  return useThemeContext().theme;
}
