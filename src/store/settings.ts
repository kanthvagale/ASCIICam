import { create } from "zustand";
import { persist } from "zustand/middleware";

import { StorageKeys } from "@/constants/storage-keys";

import { persistStorage } from "./persist-storage";

export type CameraPosition = "back" | "front";

export type AppSettings = {
  defaultCamera: CameraPosition;
  mirrorFront: boolean;
  showFps: boolean;
  autoSaveToPhotos: boolean;
  haptics: boolean;
};

type SettingsState = AppSettings & {
  setSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
};

const defaultSettings: AppSettings = {
  defaultCamera: "back",
  mirrorFront: true,
  showFps: false,
  autoSaveToPhotos: false,
  haptics: true,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,
      setSetting: (key, value) => set({ [key]: value } as Partial<AppSettings>),
    }),
    { name: StorageKeys.settings, storage: persistStorage },
  ),
);
