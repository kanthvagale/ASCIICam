import type { PropsWithChildren } from "react";
import { Pressable, View, type StyleProp, type ViewStyle } from "react-native";

import { makeStyles } from "@/theme";

export type CardProps = PropsWithChildren<{
  onPress?: () => void;
  padded?: boolean;
  elevated?: boolean;
  style?: StyleProp<ViewStyle>;
}>;

export function Card({
  onPress,
  padded = true,
  elevated = true,
  style,
  children,
}: CardProps) {
  const styles = useStyles();
  const content = [
    styles.card,
    padded && styles.padded,
    elevated && styles.elevated,
    style,
  ];

  if (!onPress) return <View style={content}>{children}</View>;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [content, pressed && styles.pressed]}
    >
      {children}
    </Pressable>
  );
}

const useStyles = makeStyles((theme) => ({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radii.lg,
    borderWidth: theme.sizes.border,
    borderColor: theme.colors.border,
    overflow: "hidden",
  },
  padded: { padding: theme.spacing.lg },
  elevated: theme.shadows.sm,
  pressed: { opacity: 0.9 },
}));
