import { Platform } from "react-native";
import SpInAppUpdates, {
  IAUInstallStatus,
  IAUUpdateKind,
  type StatusUpdateEvent,
} from "sp-react-native-in-app-updates";

import { breadcrumb, reportError } from "@/services/crashlytics";

/** Play in-app updates only work on Android builds installed from Play. */
export const appUpdatesSupported = Platform.OS === "android" && !__DEV__;

const inAppUpdates = appUpdatesSupported ? new SpInAppUpdates(false) : null;

/** Returns the newer Play versionCode, or null when there's nothing to offer. */
export async function checkForUpdate(): Promise<number | null> {
  if (!inAppUpdates) return null;
  try {
    // Play only reports an update for a higher versionCode, so skip the library's
    // comparison (it compares that code with the version name).
    const result = await inAppUpdates.checkNeedsUpdate({ customVersionComparator: () => 1 });
    if (!result.shouldUpdate || !("isFlexibleUpdateAllowed" in result.other)) return null;
    return result.other.isFlexibleUpdateAllowed ? result.other.versionCode : null;
  } catch {
    // Expected when the app wasn't installed from Play.
    return null;
  }
}

/** Opens Play's flexible update dialog; the download then runs in the background. */
export async function startFlexibleUpdate() {
  if (!inAppUpdates) return;
  try {
    await inAppUpdates.startUpdate({ updateType: IAUUpdateKind.FLEXIBLE });
  } catch (error) {
    reportError(error, "app-update.start");
  }
}

/** Installs a downloaded update; Play restarts the app. */
export function installUpdate() {
  inAppUpdates?.installUpdate();
}

export function onUpdateDownloaded(listener: () => void): () => void {
  const updates = inAppUpdates;
  if (!updates) return () => {};

  const handler = (event: StatusUpdateEvent) => {
    if (event.status === IAUInstallStatus.DOWNLOADED) listener();
    else if (event.status === IAUInstallStatus.FAILED) breadcrumb("update: download failed");
  };
  updates.addStatusUpdateListener(handler);
  return () => updates.removeStatusUpdateListener(handler);
}

/** Fires with false when the user closes Play's update dialog without accepting. */
export function onUpdateChoice(listener: (accepted: boolean) => void): () => void {
  const updates = inAppUpdates;
  if (!updates) return () => {};

  const handler = (result: IAUInstallStatus) => listener(result === IAUInstallStatus.INSTALLED);
  updates.addIntentSelectionListener(handler);
  return () => updates.removeIntentSelectionListener(handler);
}
