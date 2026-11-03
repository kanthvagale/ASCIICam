import type { SharedValue } from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { IconButton, Text } from "@/components/ui";
import { makeStyles } from "@/theme";

import { FpsBadge } from "./fps-badge";

export type CameraTopBarProps = {
  columns: number;
  rows: number;
  fps: SharedValue<number>;
  showFps: boolean;
  onSettings: () => void;
  onOptions: () => void;
};

export function CameraTopBar({ columns, rows, fps, showFps, onSettings, onOptions }: CameraTopBarProps) {
  const styles = useStyles();
  const { t } = useTranslation();

  return (
    <View style={styles.bar}>
      <IconButton
        icon="settings-outline"
        size="sm"
        tint="#FFFFFF"
        filled
        onPress={onSettings}
        accessibilityLabel={t("a11y.settings")}
      />

      <View style={styles.center}>
        <Text mono variant="caption" style={styles.label}>
          {t("camera.resolution", { width: columns, height: rows })}
        </Text>
        {showFps ? <FpsBadge fps={fps} /> : null}
      </View>

      <IconButton
        icon="options-outline"
        size="sm"
        tint="#FFFFFF"
        filled
        onPress={onOptions}
        accessibilityLabel={t("a11y.options")}
      />
    </View>
  );
}

const useStyles = makeStyles((theme) => ({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  center: { flexDirection: "row", alignItems: "center", gap: theme.spacing.sm },
  label: { color: "rgba(255, 255, 255, 0.7)" },
}));
