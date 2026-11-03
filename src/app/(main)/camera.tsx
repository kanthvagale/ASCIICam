import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Camera } from "react-native-vision-camera";

import { type AsciiRendererHandle, AsciiRenderer } from "@/components/ascii";
import { CameraBottomBar, CameraTopBar } from "@/components/camera";
import { Button, Text } from "@/components/ui";
import { PREVIEW_FADE_MS } from "@/constants/ascii";
import { capturePngUri } from "@/services/captures";
import { useCameraController } from "@/services/controllers";
import { makeStyles } from "@/theme";

export default function CameraScreen() {
  const styles = useStyles();
  const { t } = useTranslation();
  const previewRef = useRef<AsciiRendererHandle>(null);
  const vm = useCameraController(previewRef);

  return (
    <SafeAreaView style={styles.root} edges={["top", "bottom"]}>
      <CameraTopBar
        columns={vm.options.resWidth}
        rows={vm.options.resHeight}
        fps={vm.fps}
        showFps={vm.showFps}
        onSettings={vm.openSettings}
        onOptions={vm.openOptions}
      />

      <View style={styles.preview}>
        {vm.hasPermission ? (
          <>
            {/* Zero-size: frames feed the ASCII pipeline, the preview is the text. */}
            <Camera
              style={styles.invisible}
              isActive={vm.isActive}
              device={vm.position}
              outputs={[vm.frameOutput]}
              mirrorMode={vm.mirrorMode}
              constraints={[{ fps: 60 }]}
              orientationSource="custom"
            />
            {vm.isActive ? (
              <Animated.View
                entering={FadeIn.duration(PREVIEW_FADE_MS)}
                exiting={FadeOut.duration(PREVIEW_FADE_MS)}
                style={styles.fill}
              >
                <AsciiRenderer
                  ref={previewRef}
                  text={vm.ascii}
                  columns={vm.options.resWidth}
                  rows={vm.options.resHeight}
                  color={vm.options.foreground}
                  background={vm.options.background}
                />
              </Animated.View>
            ) : null}
          </>
        ) : (
          <View style={styles.permission}>
            <Text variant="h3" align="center" style={styles.light}>
              {t("camera.permissionTitle")}
            </Text>
            <Text variant="body" align="center" style={styles.muted}>
              {t("camera.permissionBody")}
            </Text>
            <Button
              label={t("camera.permissionAction")}
              variant="secondary"
              fullWidth={false}
              onPress={() => void vm.requestPermission()}
            />
          </View>
        )}
      </View>

      <CameraBottomBar
        thumbnailUri={vm.latestCapture ? capturePngUri(vm.latestCapture.id) : undefined}
        isCapturing={vm.isCapturing}
        onGallery={vm.openGallery}
        onCapture={() => void vm.capture()}
        onShutterPressIn={vm.shutterPressIn}
        onFlip={vm.flip}
      />
    </SafeAreaView>
  );
}

// The camera is always dark, whatever the app theme.
const useStyles = makeStyles((theme) => ({
  root: { flex: 1, backgroundColor: "#000000" },
  preview: { flex: 1, borderRadius: theme.radii.lg, overflow: "hidden" },
  invisible: { height: 0, width: 0, position: "absolute" },
  fill: { flex: 1 },
  permission: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  light: { color: "#FFFFFF" },
  muted: { color: "rgba(255, 255, 255, 0.6)" },
}));
