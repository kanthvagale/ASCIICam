import type { ReactNode } from "react";
import { I18nManager, Pressable, View, type StyleProp, type ViewStyle } from "react-native";

import { makeStyles } from "@/theme";

import { Icon, type IconName } from "./icon";
import { Text } from "./text";

export type ListItemProps = {
  title: string;
  subtitle?: string;
  icon?: IconName;
  iconTint?: string;
  onPress?: () => void;
  /** Replaces the chevron — e.g. a Switch or a value label. */
  right?: ReactNode;
  showChevron?: boolean;
  destructive?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function ListItem({
  title,
  subtitle,
  icon,
  iconTint,
  onPress,
  right,
  showChevron = true,
  destructive = false,
  style,
}: ListItemProps) {
  const styles = useStyles();
  // The chevron points the way navigation moves, which mirrors under RTL.
  const chevron: IconName = I18nManager.isRTL ? "chevron-back" : "chevron-forward";

  const body = (
    <>
      {icon ? (
        <View style={[styles.iconWrap, iconTint ? { backgroundColor: `${iconTint}22` } : null]}>
          <Icon
            name={icon}
            size="sm"
            color={destructive ? "danger" : "primary"}
            tint={iconTint}
          />
        </View>
      ) : null}

      <View style={styles.labels}>
        <Text variant="body" color={destructive ? "danger" : "text"} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text variant="small" color="textMuted" numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {right ?? (onPress && showChevron ? (
        <Icon name={chevron} size="sm" color="textMuted" />
      ) : null)}
    </>
  );

  if (!onPress) return <View style={[styles.row, style]}>{body}</View>;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.row, pressed && styles.pressed, style]}
    >
      {body}
    </Pressable>
  );
}

const useStyles = makeStyles((theme) => ({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  iconWrap: {
    width: theme.sizes.icon.lg,
    height: theme.sizes.icon.lg,
    borderRadius: theme.radii.sm,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primaryMuted,
  },
  labels: { flex: 1, gap: 2 },
  pressed: { backgroundColor: theme.colors.surface },
}));
