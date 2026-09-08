/**
 * Semantic color tokens. Both palettes MUST expose the same keys so a screen
 * never has to branch on light/dark. Add a token here, not in a screen.
 */
export const lightColors = {
  background: "#FFFFFF",
  surface: "#F5F7FA",
  card: "#FFFFFF",
  text: "#0B1420",
  textMuted: "#66707D",
  textInverse: "#FFFFFF",
  border: "#E3E8EF",
  primary: "#2563EB",
  primaryMuted: "#DBEAFE",
  primaryText: "#FFFFFF",
  success: "#16A34A",
  warning: "#D97706",
  danger: "#DC2626",
  dangerMuted: "#FEE2E2",
  overlay: "rgba(11, 20, 32, 0.45)",
  skeleton: "#E8ECF2",
};

export const darkColors: typeof lightColors = {
  background: "#0B1420",
  surface: "#141E2C",
  card: "#18232F",
  text: "#F2F5F9",
  textMuted: "#94A2B3",
  textInverse: "#0B1420",
  border: "#26323F",
  primary: "#60A5FA",
  primaryMuted: "#1E3A5F",
  primaryText: "#08111C",
  success: "#4ADE80",
  warning: "#FBBF24",
  danger: "#F87171",
  dangerMuted: "#3B1D1D",
  overlay: "rgba(0, 0, 0, 0.6)",
  skeleton: "#1E2A38",
};

export type Colors = typeof lightColors;
export type ColorToken = keyof Colors;
