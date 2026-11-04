export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

export const COLORS = {
  bg: "#0A0A0A",
  white: "#FFFFFF",
  dim: "#8A8A8A",
  sub: "#BDBDBD",
} as const;

export const DISPLAY_FONT = "JetBrains Mono";
export const WORDMARK_FONT = "Space Mono";
export const UI_FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";

// The recordings are 720 px wide and start below the status bar,
// which is ~75 px tall at that width on the CMF Phone 2 Pro.
export const SRC_WIDTH = 720;
export const SRC_STATUS_HEIGHT = 75;
export const SRC_SCREEN_HEIGHT = 1520;

export const sec = (seconds: number) => Math.round(seconds * FPS);
