/** Every AsyncStorage key the app uses. Namespaced so a clone can rename once. */
export const StorageKeys = {
  themeMode: "@starter/theme-mode",
  language: "@starter/language",
  onboarded: "@starter/onboarded",
  session: "@starter/session",
  recentSearches: "@starter/recent-searches",
} as const;
