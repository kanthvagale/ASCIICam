/**
 * Semantic color tokens. Both palettes MUST expose the same keys so a screen
 * never has to branch on light/dark. Add a token here, not in a screen.
 *
 * The palette is deliberately monochrome — the ASCII output is the colour.
 */
export const lightColors = {
  background: "#FAFAFA",
  surface: "#F0F0F0",
  card: "#FFFFFF",
  text: "#0A0A0A",
  textMuted: "#6B6B6B",
  textInverse: "#FFFFFF",
  border: "#E2E2E2",
  primary: "#0A0A0A",
  primaryMuted: "#E6E6E6",
  primaryText: "#FFFFFF",
  success: "#16A34A",
  warning: "#D97706",
  danger: "#DC2626",
  dangerMuted: "#FEE2E2",
  overlay: "rgba(0, 0, 0, 0.45)",
  skeleton: "#E8E8E8",
};

export const darkColors: typeof lightColors = {
  background: "#000000",
  surface: "#111111",
  card: "#161616",
  text: "#F5F5F5",
  textMuted: "#8A8A8A",
  textInverse: "#0A0A0A",
  border: "#262626",
  primary: "#F5F5F5",
  primaryMuted: "#262626",
  primaryText: "#0A0A0A",
  success: "#4ADE80",
  warning: "#FBBF24",
  danger: "#F87171",
  dangerMuted: "#3B1D1D",
  overlay: "rgba(0, 0, 0, 0.6)",
  skeleton: "#1C1C1C",
};

export type Colors = typeof lightColors;
export type ColorToken = keyof Colors;
