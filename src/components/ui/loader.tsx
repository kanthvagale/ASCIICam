import { ActivityIndicator, View, type StyleProp, type ViewStyle } from "react-native";

import { makeStyles, useTheme } from "@/theme";

import { Text } from "./text";

export function Loader({
  label,
  fullscreen = false,
  style,
}: {
  label?: string;
  fullscreen?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const styles = useStyles();
  const theme = useTheme();

  return (
    <View style={[styles.wrap, fullscreen && styles.fullscreen, style]}>
      <ActivityIndicator color={theme.colors.primary} />
      {label ? (
        <Text variant="small" color="textMuted" align="center">
          {label}
        </Text>
      ) : null}
    </View>
  );
}

const useStyles = makeStyles((theme) => ({
  wrap: { alignItems: "center", justifyContent: "center", gap: theme.spacing.sm },
  fullscreen: { flex: 1, backgroundColor: theme.colors.background },
}));
