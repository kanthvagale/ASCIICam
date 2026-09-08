import Ionicons from "@expo/vector-icons/Ionicons";
import type { StyleProp, TextStyle } from "react-native";

import { useTheme, type ColorToken } from "@/theme";

export type IconName = React.ComponentProps<typeof Ionicons>["name"];

export type IconProps = {
  name: IconName;
  size?: keyof ReturnType<typeof useTheme>["sizes"]["icon"] | number;
  color?: ColorToken;
  /** Escape hatch for category colors that aren't theme tokens. */
  tint?: string;
  style?: StyleProp<TextStyle>;
};

export function Icon({
  name,
  size = "md",
  color = "text",
  tint,
  style,
}: IconProps) {
  const theme = useTheme();
  const resolved = typeof size === "number" ? size : theme.sizes.icon[size];

  return (
    <Ionicons
      name={name}
      size={resolved}
      color={tint ?? theme.colors[color]}
      style={style}
    />
  );
}
