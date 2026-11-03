import type { PropsWithChildren } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";

import { makeStyles } from "@/theme";

import { Text } from "./text";

export type SectionProps = PropsWithChildren<{
  title?: string;
  hint?: string;
  card?: boolean;
  style?: StyleProp<ViewStyle>;
}>;

export function Section({ title, hint, card = false, style, children }: SectionProps) {
  const styles = useStyles();

  return (
    <View style={[styles.wrap, style]}>
      {title ? (
        <Text variant="label" color="textMuted" style={styles.title}>
          {title.toUpperCase()}
        </Text>
      ) : null}
      <View style={card ? styles.card : styles.plain}>{children}</View>
      {hint ? (
        <Text variant="caption" color="textMuted" style={styles.hint}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

const useStyles = makeStyles((theme) => ({
  wrap: { gap: theme.spacing.sm },
  title: { letterSpacing: 1 },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radii.lg,
    borderWidth: theme.sizes.border,
    borderColor: theme.colors.border,
    overflow: "hidden",
  },
  plain: { gap: theme.spacing.sm },
  hint: { paddingHorizontal: theme.spacing.xs },
}));
