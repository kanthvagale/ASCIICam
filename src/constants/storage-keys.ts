/** Every AsyncStorage key the app uses. Namespaced so a clone can rename once. */
export const StorageKeys = {
  themeMode: "@asciicam/theme-mode",
  cameraOptions: "@asciicam/camera-options",
  settings: "@asciicam/settings",
  captures: "@asciicam/captures",
} as const;
