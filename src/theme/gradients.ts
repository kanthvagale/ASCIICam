import type { LinearGradientProps } from "expo-linear-gradient";

export type GradientPreset = "primary" | "hero" | "cardOverlay" | "muted";

type Gradient = {
  colors: LinearGradientProps["colors"];
  start: LinearGradientProps["start"];
  end: LinearGradientProps["end"];
};

const horizontal = { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } };
const vertical = { start: { x: 0, y: 0 }, end: { x: 0, y: 1 } };

export const lightGradients: Record<GradientPreset, Gradient> = {
  primary: { colors: ["#3B82F6", "#2563EB"], ...horizontal },
  hero: { colors: ["#EFF6FF", "#DBEAFE", "#FFFFFF"], ...vertical },
  cardOverlay: { colors: ["transparent", "rgba(11,20,32,0.65)"], ...vertical },
  muted: { colors: ["#F5F7FA", "#FFFFFF"], ...vertical },
};

export const darkGradients: Record<GradientPreset, Gradient> = {
  primary: { colors: ["#60A5FA", "#3B82F6"], ...horizontal },
  hero: { colors: ["#12233A", "#0B1420", "#0B1420"], ...vertical },
  cardOverlay: { colors: ["transparent", "rgba(0,0,0,0.75)"], ...vertical },
  muted: { colors: ["#141E2C", "#0B1420"], ...vertical },
};

export type Gradients = typeof lightGradients;
