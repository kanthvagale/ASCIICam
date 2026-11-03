import { Text as RNText, type TextProps as RNTextProps } from "react-native";

import { fontFamilies, useTheme, type ColorToken, type TextVariant } from "@/theme";

export type TextProps = RNTextProps & {
  variant?: TextVariant;
  color?: ColorToken;
  align?: "auto" | "left" | "right" | "center";
  /** Render in the app's monospace face (ASCII samples, numbers, the wordmark). */
  mono?: boolean;
};

export function Text({
  variant = "body",
  color = "text",
  align = "auto",
  mono = false,
  style,
  ...rest
}: TextProps) {
  const theme = useTheme();

  const textAlign = align === "auto" ? "left" : align;

  return (
    <RNText
      {...rest}
      style={[
        theme.typography[variant],
        {
          color: theme.colors[color],
          fontFamily: mono ? fontFamilies.mono : undefined,
          textAlign,
        },
        style,
      ]}
    />
  );
}
