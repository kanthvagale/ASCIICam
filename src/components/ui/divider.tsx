import { View, type StyleProp, type ViewStyle } from "react-native";

import { makeStyles } from "@/theme";

export function Divider({
  inset = false,
  style,
}: {
  inset?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const styles = useStyles();
  return <View style={[styles.line, inset && styles.inset, style]} />;
}

const useStyles = makeStyles((theme) => ({
  line: {
    height: theme.sizes.border,
    backgroundColor: theme.colors.border,
  },
  inset: { marginStart: theme.spacing.xxl },
}));
