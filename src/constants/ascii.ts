import type { Swatch } from "@/components/ui/swatch-row";

/** Rows per column: the camera grid is 4:3 (landscape sensor, portrait screen). */
export const FONT_WH_RATIO = 3 / 4;

/**
 * Advance width of JetBrains Mono (`fontFamilies.ascii`) as a fraction of its
 * font size — 600 / 1000 units. Used to shape frames and uploaded-image grids;
 * `AsciiRenderer` measures the real rendered width rather than trusting it.
 */
export const MONO_CHAR_ASPECT = 0.6;

/** Characters per row the user can pick from. */
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

/** Camera preview fade when the screen gains or loses focus. */
export const PREVIEW_FADE_MS = 220;
