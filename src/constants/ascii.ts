import type { Swatch } from "@/components/ui/swatch-row";

export const FONT_WH_RATIO = 3 / 4;

/** JetBrains Mono advance width as a fraction of font size. */
export const MONO_CHAR_ASPECT = 0.6;

export const RESOLUTION_PRESETS = [48, 64, 96, 128, 160, 256, 512] as const;
export type Resolution = (typeof RESOLUTION_PRESETS)[number];

export const DEFAULT_RESOLUTION: Resolution = 96;

export const FOREGROUND_PRESETS: readonly Swatch[] = [
  { value: "#FFFFFF", label: "White" },
  { value: "#33FF66", label: "Terminal green" },
  { value: "#FFB000", label: "Amber" },
  { value: "#00E5FF", label: "Cyan" },
  { value: "#FF4FD8", label: "Magenta" },
  { value: "#000000", label: "Black" },
];

export const BACKGROUND_PRESETS: readonly Swatch[] = [
  { value: "#000000", label: "Black" },
  { value: "#0B1420", label: "Midnight" },
  { value: "#021A0A", label: "Phosphor" },
  { value: "#F4ECD8", label: "Paper" },
  { value: "#FFFFFF", label: "White" },
];

export const PREVIEW_FADE_MS = 220;
