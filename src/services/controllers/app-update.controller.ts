import { useCallback, useEffect, useRef, useState } from "react";

import { useIsForeground } from "@/hooks/use-is-foreground";
import {
  appUpdatesSupported,
  checkForUpdate,
  installUpdate,
  onUpdateChoice,
  onUpdateDownloaded,
  startFlexibleUpdate,
} from "@/services/app-update";
import { breadcrumb } from "@/services/crashlytics";
import { useAppUpdateStore, useHasHydrated } from "@/store";

/** "Later" hides a given version for this long. */
const SNOOZE_MS = 3 * 24 * 60 * 60 * 1000;

export type UpdatePrompt = "available" | "ready" | null;

export function useAppUpdateController() {
  const isForeground = useIsForeground();
  const hydrated = useHasHydrated(useAppUpdateStore);
  const dismiss = useAppUpdateStore((s) => s.dismiss);

  const [prompt, setPrompt] = useState<UpdatePrompt>(null);
  const [versionCode, setVersionCode] = useState<number>();
  const downloaded = useRef(false);

  // Check on launch and whenever the app comes back to the foreground.
  useEffect(() => {
    if (!appUpdatesSupported || !isForeground || !hydrated) return;
    let cancelled = false;

    const check = async () => {
      // Downloaded but not installed yet (the user picked Later on the restart prompt).
      if (downloaded.current) {
        setPrompt("ready");
        return;
      }
      const available = await checkForUpdate();
      if (cancelled || available === null) return;

      const { dismissedVersion, dismissedAt = 0 } = useAppUpdateStore.getState();
      if (dismissedVersion === available && Date.now() - dismissedAt < SNOOZE_MS) return;

      breadcrumb(`update: ${available} available`);
      setVersionCode(available);
      setPrompt((current) => current ?? "available");
    };

    void check();
    return () => {
      cancelled = true;
    };
  }, [hydrated, isForeground]);

  useEffect(
    () =>
      onUpdateDownloaded(() => {
        downloaded.current = true;
        setPrompt("ready");
      }),
    [],
  );

  // Declining Play's own dialog counts as Later.
  useEffect(
    () =>
      onUpdateChoice((accepted) => {
        if (!accepted && versionCode !== undefined) dismiss(versionCode);
      }),
    [dismiss, versionCode],
  );

  const update = useCallback(() => {
    setPrompt(null);
    void startFlexibleUpdate();
  }, []);

  const later = useCallback(() => {
    if (prompt === "available" && versionCode !== undefined) dismiss(versionCode);
    setPrompt(null);
  }, [dismiss, prompt, versionCode]);

  const restart = useCallback(() => {
    setPrompt(null);
    installUpdate();
  }, []);

  return { prompt, update, later, restart };
}
