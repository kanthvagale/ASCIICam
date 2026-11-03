import { Pressable, type StyleProp, type ViewStyle } from "react-native";

import { makeStyles, useTheme, type ColorToken } from "@/theme";

import { Icon, type IconName } from "./icon";

export type IconButtonProps = {
  icon: IconName;
  onPress?: () => void;
  accessibilityLabel: string;
  size?: "sm" | "md" | "lg";
  color?: ColorToken;
  /** Escape hatch for screens with a fixed background (camera, splash). */
  tint?: string;
  /** Filled circular background — for buttons that float over the preview. */
  filled?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function IconButton({
  icon,
  onPress,
  accessibilityLabel,
  size = "md",
  color = "text",
  tint,
  filled = false,
  disabled = false,
  style,
}: IconButtonProps) {
  const styles = useStyles();
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={theme.sizes.hitSlop}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [
        styles.base,
        filled && styles.filled,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Icon name={icon} size={size} color={color} tint={tint} />
    </Pressable>
  );
}

const useStyles = makeStyles((theme) => ({
  base: {
    width: theme.sizes.control.md,
    height: theme.sizes.control.md,
    borderRadius: theme.radii.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  filled: { backgroundColor: "rgba(255, 255, 255, 0.12)" },
  pressed: { opacity: 0.6 },
  disabled: { opacity: 0.35 },
}));
