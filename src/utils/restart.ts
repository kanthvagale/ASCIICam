import * as Updates from "expo-updates";
import { DevSettings } from "react-native";

/**
 * Reloads the JS bundle so a native layout-direction change takes effect.
 *
 * `Updates.reloadAsync()` rejects in Expo Go and in development builds
 * (see the SDK 57 expo-updates docs), so fall back to `DevSettings.reload()`
 * while developing. In a release build the first call is the one that runs.
 */
export async function restartApp(): Promise<void> {
  try {
    await Updates.reloadAsync();
  } catch {
    if (__DEV__) {
      DevSettings.reload();
      return;
    }
    throw new Error("Unable to restart the app automatically.");
  }
}
