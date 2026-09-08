import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { I18nManager } from "react-native";

import { StorageKeys } from "@/constants/storage-keys";
import { storage } from "@/utils/storage";

import { isSupportedLanguage, type Language } from "./config";
import { getDeviceLanguage, i18n } from "./i18n";
import { applyLanguage, restoreLanguage } from "./rtl";

type LocaleContextValue = {
  language: Language;
  isRTL: boolean;
  /** Persists, swaps strings and restarts when the direction changes. */
  setLanguage: (language: Language) => Promise<void>;
  isReady: boolean;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: PropsWithChildren) {
  const [language, setLanguageState] = useState<Language>(getDeviceLanguage);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const stored = await storage.get(StorageKeys.language);
      const resolved = await restoreLanguage(
        getDeviceLanguage(),
        isSupportedLanguage(stored) ? stored : null
      );
      if (cancelled) return;

      if (i18n.language !== resolved) await i18n.changeLanguage(resolved);
      setLanguageState(resolved);
      setIsReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const setLanguage = useCallback(async (next: Language) => {
    const restarting = await applyLanguage(next);
    // When a restart is triggered the component tree is about to be torn down,
    // so there is nothing left to update.
    if (!restarting) setLanguageState(next);
  }, []);

  const value = useMemo<LocaleContextValue>(
    () => ({
      language,
      isRTL: I18nManager.isRTL,
      setLanguage,
      isReady,
    }),
    [language, setLanguage, isReady]
  );

  return <LocaleContext value={value}>{children}</LocaleContext>;
}

export function useLocale(): LocaleContextValue {
  const ctx = use(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
