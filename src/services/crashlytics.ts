import { getCrashlytics, log, recordError, setAttribute } from "@react-native-firebase/crashlytics";

const crashlytics = getCrashlytics();

export function breadcrumb(message: string) {
  log(crashlytics, message);
}

export function setScreen(route: string) {
  breadcrumb(`screen: ${route}`);
  void setAttribute(crashlytics, "screen", route);
}

/** Reports a handled error as a non-fatal; `context` names where it happened. */
export function reportError(error: unknown, context: string) {
  breadcrumb(`error: ${context}`);
  recordError(crashlytics, error instanceof Error ? error : new Error(String(error)), context);
}
