import { Pressable, type StyleProp, type ViewStyle } from "react-native";

import { makeStyles } from "@/theme";

import { Icon, type IconName } from "./icon";
import { Text } from "./text";

export type ChipProps = {
  label: string;
  onPress?: () => void;
  selected?: boolean;
  icon?: IconName;
  /** Category accent colour; falls back to the theme primary. */
  tint?: string;
  style?: StyleProp<ViewStyle>;
};

export function Chip({ label, onPress, selected = false, icon, tint, style }: ChipProps) {
  const styles = useStyles();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={({ pressed }) => [
        styles.chip,
        selected && styles.selected,
        selected && tint ? { backgroundColor: tint, borderColor: tint } : null,
        pressed && styles.pressed,
        style,
      ]}
    >
      {icon ? (
        <Icon
          name={icon}
          size="xs"
          color={selected ? "primaryText" : "textMuted"}
          tint={!selected && tint ? tint : undefined}
          style={styles.icon}
        />
      ) : null}
      <Text variant="small" color={selected ? "primaryText" : "text"}>
        {label}
      </Text>
    </Pressable>
  );
}

const useStyles = makeStyles((theme) => ({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radii.pill,
    borderWidth: theme.sizes.border,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  selected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  icon: { marginEnd: theme.spacing.xs },
  pressed: { opacity: 0.85 },
}));
