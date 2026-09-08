import { View, type StyleProp, type ViewStyle } from "react-native";

import { makeStyles } from "@/theme";

import { Text } from "./text";

export type BadgeProps = {
  label?: string | number;
  /** Small coloured dot with no text. */
  dot?: boolean;
  tone?: "primary" | "danger" | "success";
  style?: StyleProp<ViewStyle>;
};

export function Badge({ label, dot = false, tone = "primary", style }: BadgeProps) {
  const styles = useStyles();

  if (dot) return <View style={[styles.dot, styles[tone], style]} />;

  return (
    <View style={[styles.badge, styles[tone], style]}>
      <Text variant="caption" color="primaryText" align="center" forceLtr>
        {label}
      </Text>
    </View>
  );
}

const useStyles = makeStyles((theme) => ({
  badge: {
    minWidth: theme.spacing.xl,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: theme.radii.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    width: theme.spacing.sm,
    height: theme.spacing.sm,
    borderRadius: theme.radii.pill,
  },
  primary: { backgroundColor: theme.colors.primary },
  danger: { backgroundColor: theme.colors.danger },
  success: { backgroundColor: theme.colors.success },
}));
