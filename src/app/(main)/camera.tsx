import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Camera } from "react-native-vision-camera";

import { type AsciiRendererHandle, AsciiRenderer } from "@/components/ascii";
import { CameraBottomBar, CameraTopBar, ExposureControl } from "@/components/camera";
import { CaptureFlyover } from "@/components/camera/capture-flyover";
import { Button, Text } from "@/components/ui";
import { capturePngUri } from "@/services/captures";
import { useCaptureFlight } from "@/hooks/use-capture-flight";
import { useCameraController } from "@/services/controllers";
import { makeStyles, useTheme } from "@/theme";

export default function CameraScreen() {
  const styles = useStyles();
  const { t } = useTranslation();
  const previewRef = useRef<AsciiRendererHandle>(null);
  const vm = useCameraController(previewRef);
  const theme = useTheme();

  const overlayRef = useRef<View>(null);
  const previewBoxRef = useRef<View>(null);
  const thumbRef = useRef<View>(null);
  const flight = useCaptureFlight({
    latest: vm.latestCapture,
    isActive: vm.isActive,
    overlayRef,
    fromRef: previewBoxRef,
    toRef: thumbRef,
  });

  const flash = useSharedValue(0);
  const flashStyle = useAnimatedStyle(() => ({ opacity: flash.get() }));

  const onCapture = () => {
    if (vm.isActive && !vm.isCapturing) {
      flash.set(withSequence(withTiming(0.6, { duration: 50 }), withTiming(0, { duration: 250 })));
    }
    void vm.capture();
  };

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

      <View ref={previewBoxRef} style={styles.preview}>
        {vm.hasPermission ? (
          <>
            {/* Hidden: only feeds frames to the ASCII pipeline. */}
            <Camera
              style={styles.invisible}
              isActive={vm.isActive}
              device={vm.position}
              outputs={[vm.frameOutput]}
              mirrorMode="off"
              orientationSource="custom"
              exposure={vm.exposureRange ? vm.exposure : undefined}
              onError={vm.onCameraError}
            />
            {vm.isActive ? (
              <ExposureControl
                exposure={vm.exposure}
                range={vm.exposureRange}
                haptics={vm.haptics}
                resetKey={vm.position}
              >
                <AsciiRenderer
                  ref={previewRef}
                  text={vm.ascii}
                  columns={vm.options.resWidth}
                  rows={vm.options.resHeight}
                  color={vm.options.foreground}
                  background={vm.options.background}
                />
              </ExposureControl>
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
        <Animated.View pointerEvents="none" style={[styles.flash, flashStyle]} />
      </View>

      <CameraBottomBar
        thumbRef={thumbRef}
        thumbnailUri={flight.thumbId ? capturePngUri(flight.thumbId) : undefined}
        isCapturing={vm.isCapturing}
        onGallery={vm.openGallery}
        onCapture={onCapture}
        onShutterPressIn={vm.shutterPressIn}
        onFlip={vm.flip}
      />

      <View ref={overlayRef} style={StyleSheet.absoluteFill} pointerEvents="none">
        {flight.flight ? (
          <CaptureFlyover
            key={flight.flight.id}
            uri={capturePngUri(flight.flight.id)}
            from={flight.flight.from}
            to={flight.flight.to}
            fromRadius={theme.radii.lg}
            onLanded={flight.onLanded}
            onDone={flight.onDone}
          />
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const useStyles = makeStyles((theme) => ({
  root: { flex: 1, backgroundColor: "#000000" },
  preview: { flex: 1, borderRadius: theme.radii.lg, overflow: "hidden" },
  invisible: { height: 0, width: 0, position: "absolute" },
  flash: { position: "absolute", top: 0, right: 0, bottom: 0, left: 0, backgroundColor: "#FFFFFF", opacity: 0 },
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
