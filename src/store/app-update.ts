import { create } from "zustand";
import { persist } from "zustand/middleware";

import { StorageKeys } from "@/constants/storage-keys";

import { persistStorage } from "./persist-storage";

type AppUpdateState = {
  /** The Play versionCode the user put off, and when. */
  dismissedVersion?: number;
  dismissedAt?: number;
  dismiss: (versionCode: number) => void;
};

export const useAppUpdateStore = create<AppUpdateState>()(
  persist(
    (set) => ({
      dismiss: (versionCode) => set({ dismissedVersion: versionCode, dismissedAt: Date.now() }),
    }),
    {
      name: StorageKeys.appUpdate,
      storage: persistStorage,
      partialize: ({ dismissedVersion, dismissedAt }) => ({ dismissedVersion, dismissedAt }),
    },
  ),
);
