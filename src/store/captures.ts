import { create } from "zustand";
import { persist } from "zustand/middleware";

import { StorageKeys } from "@/constants/storage-keys";
import type { Capture } from "@/types/capture";

import { persistStorage } from "./persist-storage";

type CapturesState = {
  /** Newest first. */
  captures: Capture[];
  add: (capture: Capture) => void;
  remove: (id: string) => void;
  clear: () => void;
};

export const useCapturesStore = create<CapturesState>()(
  persist(
    (set) => ({
      captures: [],
      add: (capture) => set((s) => ({ captures: [capture, ...s.captures] })),
      remove: (id) => set((s) => ({ captures: s.captures.filter((c) => c.id !== id) })),
      clear: () => set({ captures: [] }),
    }),
    { name: StorageKeys.captures, storage: persistStorage },
  ),
);
