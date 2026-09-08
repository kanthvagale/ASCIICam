import {
  ActivityIndicator,
  Pressable,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { makeStyles, useTheme, type ColorToken } from "@/theme";

import { GradientView } from "./gradient-view";
import { Icon, type IconName } from "./icon";
import { Text } from "./text";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger"
  | "gradient";
export type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
};

const labelColors: Record<ButtonVariant, ColorToken> = {
  primary: "primaryText",
  secondary: "text",
  ghost: "primary",
  danger: "primaryText",
  gradient: "primaryText",
};

export function Button({
  label,
  onPress,
  variant = "primary",
  size = "md",
  icon,
  loading = false,
  disabled = false,
  fullWidth = true,
  style,
}: ButtonProps) {
  const styles = useStyles();
  const theme = useTheme();
  const isDisabled = disabled || loading;
  const labelColor = labelColors[variant];

  const inner = (
    <View style={styles.row}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={theme.colors[labelColor]}
          style={styles.leading}
        />
      ) : icon ? (
        <Icon name={icon} size="sm" color={labelColor} style={styles.leading} />
      ) : null}
      <Text variant="button" color={labelColor} align="center">
        {label}
      </Text>
    </View>
  );

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        styles[size],
        variant !== "gradient" && styles[variant],
        fullWidth && styles.fullWidth,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {variant === "gradient" ? (
        <GradientView preset="primary" style={styles.gradientFill} />
      ) : null}
      {inner}
    </Pressable>
  );
}

const useStyles = makeStyles((theme) => ({
  base: {
    borderRadius: theme.radii.lg,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  fullWidth: { alignSelf: "stretch" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  leading: { marginEnd: theme.spacing.sm },
  sm: { height: theme.sizes.control.sm, paddingHorizontal: theme.spacing.md },
  md: { height: theme.sizes.control.md, paddingHorizontal: theme.spacing.lg },
  lg: { height: theme.sizes.control.lg, paddingHorizontal: theme.spacing.xl },
  primary: { backgroundColor: theme.colors.primary },
  secondary: {
    backgroundColor: theme.colors.surface,
    borderWidth: theme.sizes.border,
    borderColor: theme.colors.border,
  },
  ghost: { backgroundColor: "transparent" },
  danger: { backgroundColor: theme.colors.danger },
  gradientFill: {
    position: "absolute",
    top: 0,
    bottom: 0,
    start: 0,
    end: 0,
    borderRadius: theme.radii.lg,
  },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.5 },
}));
