import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  type ColorMode,
  DEFAULT_RESOLUTION,
  FONT_WH_RATIO,
  type Resolution,
} from "@/constants/ascii";
import { StorageKeys } from "@/constants/storage-keys";
import { DEFAULT_CHARSET, getCharset, type CharsetId } from "@/lib/ascii";

import { persistStorage } from "./persist-storage";

export type AsciiOptions = {
  resWidth: Resolution;
  charsetId: CharsetId;
  colorMode: ColorMode;
  foreground: string;
  background: string;
  invert: boolean;
};

/** Derived, kept here so worklets read plain numbers. */
type DerivedOptions = {
  resHeight: number;
  pixelCount: number;
  asciiChars: string[];
};

export type AsciiCamOptions = AsciiOptions &
  DerivedOptions & {
    setOptions: (patch: Partial<AsciiOptions>) => void;
    resetOptions: () => void;
  };

export const defaultAsciiOptions: AsciiOptions = {
  resWidth: DEFAULT_RESOLUTION,
  charsetId: DEFAULT_CHARSET,
  colorMode: "mono",
  foreground: "#FFFFFF",
  background: "#000000",
  invert: false,
};

export function deriveOptions(options: AsciiOptions): DerivedOptions {
  const resHeight = Math.floor(options.resWidth * FONT_WH_RATIO);
  return {
    resHeight,
    pixelCount: options.resWidth * resHeight,
    asciiChars: getCharset(options.charsetId),
  };
}

const pickOptions = (state: AsciiOptions): AsciiOptions => ({
  resWidth: state.resWidth,
  charsetId: state.charsetId,
  colorMode: state.colorMode,
  foreground: state.foreground,
  background: state.background,
  invert: state.invert,
});

export const useAsciiCamOptionsStore = create<AsciiCamOptions>()(
  persist(
    (set, get) => ({
      ...defaultAsciiOptions,
      ...deriveOptions(defaultAsciiOptions),

      setOptions: (patch) => {
        const next = { ...pickOptions(get()), ...patch };
        set({ ...next, ...deriveOptions(next) });
      },

      resetOptions: () =>
        set({ ...defaultAsciiOptions, ...deriveOptions(defaultAsciiOptions) }),
    }),
    {
      name: StorageKeys.cameraOptions,
      storage: persistStorage,
      partialize: (state) => pickOptions(state),
      merge: (persisted, current) => {
        const options = { ...pickOptions(current), ...(persisted as Partial<AsciiOptions>) };
        return { ...current, ...options, ...deriveOptions(options) };
      },
    },
  ),
);
