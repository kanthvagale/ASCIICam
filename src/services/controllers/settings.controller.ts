import Constants from "expo-constants";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useCallback, useState } from "react";

import { AppLinks } from "@/constants/links";
import { deleteAllCaptureFiles } from "@/services/captures";
import { useAsciiCamOptionsStore } from "@/store/camera-options";
import { useCapturesStore } from "@/store/captures";
import { useSettingsStore } from "@/store/settings";
import { useThemeContext } from "@/theme";

export function useSettingsController() {
  const router = useRouter();
  const { mode, setMode } = useThemeContext();
  const settings = useSettingsStore();
  const captureCount = useCapturesStore((s) => s.captures.length);
  const clearCaptures = useCapturesStore((s) => s.clear);
  const resetOptions = useAsciiCamOptionsStore((s) => s.resetOptions);

  const [confirmingClear, setConfirmingClear] = useState(false);

  const clearGallery = useCallback(() => {
    deleteAllCaptureFiles();
    clearCaptures();
    setConfirmingClear(false);
  }, [clearCaptures]);

  const openLink = (url: string) => () => void WebBrowser.openBrowserAsync(url);

  return {
    themeMode: mode,
    setThemeMode: setMode,
    settings,
    setSetting: settings.setSetting,
    captureCount,
    confirmingClear,
    requestClear: () => setConfirmingClear(true),
    cancelClear: () => setConfirmingClear(false),
    clearGallery,
    resetOptions,
    openGallery: () => router.push("/gallery"),
    version: Constants.expoConfig?.version ?? "—",
    openLicenses: AppLinks.licenses ? openLink(AppLinks.licenses) : undefined,
    openFeedback: AppLinks.feedback ? openLink(AppLinks.feedback) : undefined,
  };
}
