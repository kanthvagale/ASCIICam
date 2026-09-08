import { Text as RNText, type TextProps as RNTextProps } from "react-native";

import { useLocale } from "@/i18n";
import {
  fontFamilies,
  useTheme,
  type ColorToken,
  type TextVariant,
} from "@/theme";

export type TextProps = RNTextProps & {
  variant?: TextVariant;
  color?: ColorToken;
  align?: "auto" | "left" | "right" | "center";
  /** Digits, emails and codes should stay LTR even in an RTL layout. */
  forceLtr?: boolean;
};

export function Text({
  variant = "body",
  color = "text",
  align = "auto",
  forceLtr = false,
  style,
  ...rest
}: TextProps) {
  const theme = useTheme();
  const { language } = useLocale();

  const textAlign = align === "auto" ? "left" : align;

  return (
    <RNText
      {...rest}
      style={[
        theme.typography[variant],
        {
          color: theme.colors[color],
          fontFamily: fontFamilies[language],
          textAlign,
          writingDirection: forceLtr ? "ltr" : "auto",
        },
        style,
      ]}
    />
  );
}
