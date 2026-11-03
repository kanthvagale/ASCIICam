import type { TextStyle } from "react-native";
import { moderateScale } from "react-native-size-matters";

/** 0.3 factor keeps type from ballooning on tablets. */
const font = (size: number) => moderateScale(size, 0.3);

export const fontWeights = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
} as const satisfies Record<string, TextStyle["fontWeight"]>;

export type TextVariant =
  | "display"
  | "h1"
  | "h2"
  | "h3"
  | "body"
  | "bodyBold"
  | "small"
  | "caption"
  | "button"
  | "label";

export const typography: Record<TextVariant, TextStyle> = {
  display: {
    fontSize: font(32),
    lineHeight: font(40),
    fontWeight: fontWeights.bold,
  },
  h1: { fontSize: font(26), lineHeight: font(34), fontWeight: fontWeights.bold },
  h2: {
    fontSize: font(21),
    lineHeight: font(28),
    fontWeight: fontWeights.semibold,
  },
  h3: {
    fontSize: font(17),
    lineHeight: font(24),
    fontWeight: fontWeights.semibold,
  },
  body: {
    fontSize: font(15),
    lineHeight: font(23),
    fontWeight: fontWeights.regular,
  },
  bodyBold: {
    fontSize: font(15),
    lineHeight: font(23),
    fontWeight: fontWeights.semibold,
  },
  small: {
    fontSize: font(13),
    lineHeight: font(19),
    fontWeight: fontWeights.regular,
  },
  caption: {
    fontSize: font(11),
    lineHeight: font(16),
    fontWeight: fontWeights.medium,
  },
  button: {
    fontSize: font(15),
    lineHeight: font(20),
    fontWeight: fontWeights.semibold,
  },
  label: {
    fontSize: font(13),
    lineHeight: font(18),
    fontWeight: fontWeights.medium,
  },
};

export const fontFamilies = {
  mono: "SpaceMono-Regular",
  monoBold: "SpaceMono-Bold",
  ascii: "JetBrainsMono_700Bold",
} as const;

export type Typography = typeof typography;
