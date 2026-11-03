import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { IconButton } from "@/components/ui";
import { makeStyles } from "@/theme";

import { GalleryThumb } from "./gallery-thumb";
import { ShutterButton } from "./shutter-button";

export type CameraBottomBarProps = {
  thumbnailUri?: string;
  isCapturing: boolean;
  onGallery: () => void;
  onCapture: () => void;
  onShutterPressIn?: () => void;
  onFlip: () => void;
};

export function CameraBottomBar({
  thumbnailUri,
  isCapturing,
  onGallery,
  onCapture,
  onShutterPressIn,
  onFlip,
}: CameraBottomBarProps) {
  const styles = useStyles();
  const { t } = useTranslation();

  return (
    <View style={styles.bar}>
      <View style={styles.side}>
        <GalleryThumb uri={thumbnailUri} onPress={onGallery} accessibilityLabel={t("a11y.gallery")} />
      </View>

      <ShutterButton
        onPress={onCapture}
        onPressIn={onShutterPressIn}
        disabled={isCapturing}
        accessibilityLabel={t("a11y.shutter")}
      />

      <View style={[styles.side, styles.end]}>
        <IconButton
          icon="camera-reverse-outline"
          size="md"
          tint="#FFFFFF"
          filled
          onPress={onFlip}
          accessibilityLabel={t("a11y.flip")}
        />
      </View>
    </View>
  );
}

const useStyles = makeStyles((theme) => ({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
  },
  side: { width: theme.sizes.control.lg * 1.5 },
  end: { alignItems: "flex-end" },
}));
