import { changeLanguage } from "i18next";
import { I18nManager } from "react-native";

import { StorageKeys } from "@/constants/storage-keys";
import { restartApp } from "@/utils/restart";
import { storage } from "@/utils/storage";

import { isRtlLanguage, type Language } from "./config";

/** The direction the native layout engine is currently running in. */
export const isRTL = (): boolean => I18nManager.isRTL;

/**
 * Persists the language, swaps the i18next bundle, and — only when the writing
 * direction actually changes — flips the native layout and restarts.
 *
 * `forceRTL` mutates a native flag that is read once at startup, so a restart
 * is unavoidable; that is why the UI confirms before calling this.
 *
 * Returns true when a restart was triggered.
 */
export async function applyLanguage(language: Language): Promise<boolean> {
  await storage.set(StorageKeys.language, language);
  await changeLanguage(language);

  const shouldBeRTL = isRtlLanguage(language);
  if (I18nManager.isRTL === shouldBeRTL) return false;

  I18nManager.allowRTL(shouldBeRTL);
  I18nManager.forceRTL(shouldBeRTL);
  await restartApp();
  return true;
}

/**
 * Called once at bootstrap. Re-applies the stored language and makes sure the
 * native direction matches it (it can drift if the user changes the OS language
 * while the app is closed).
 */
export async function restoreLanguage(
  current: Language,
  stored: Language | null
): Promise<Language> {
  const language = stored ?? current;
  const shouldBeRTL = isRtlLanguage(language);

  // Keep the native flag in sync for the *next* launch without restarting now —
  // restarting during bootstrap would trap the user in a reload loop.
  I18nManager.allowRTL(shouldBeRTL);
  if (I18nManager.isRTL !== shouldBeRTL) I18nManager.forceRTL(shouldBeRTL);

  return language;
}
