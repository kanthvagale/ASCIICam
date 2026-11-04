import * as Haptics from "expo-haptics";
import { useIsFocused, useRouter } from "expo-router";
import { type RefObject, useCallback, useEffect, useState } from "react";
import { useSharedValue } from "react-native-reanimated";
import {
  type Frame,
  useCameraPermission,
  useFrameOutput,
} from "react-native-vision-camera";
import { useResizer } from "react-native-vision-camera-resizer";

import type { AsciiRendererHandle } from "@/components/ascii";

import { PREVIEW_FADE_MS } from "@/constants/ascii";
import { useIsForeground } from "@/hooks/use-is-foreground";
import { pixelsToAscii } from "@/lib/ascii";
import { capturePngUri, exportToPhotos, saveCapture } from "@/services/captures";
import { useAsciiCamOptionsStore } from "@/store/camera-options";
import { useCapturesStore } from "@/store/captures";
import { type CameraPosition, useSettingsStore } from "@/store/settings";

export function useCameraController(previewRef: RefObject<AsciiRendererHandle | null>) {
  const router = useRouter();

  const options = useAsciiCamOptionsStore();
  const { resWidth, resHeight, asciiChars, invert } = options;
  const settings = useSettingsStore();
  const addCapture = useCapturesStore((s) => s.add);
  const latestCapture = useCapturesStore((s) => s.captures[0]);

  const { hasPermission, requestPermission } = useCameraPermission();
  const [position, setPosition] = useState<CameraPosition>(settings.defaultCamera);
  const [isCapturing, setIsCapturing] = useState(false);

  const ascii = useSharedValue<string>("");
  const fps = useSharedValue(0);
  const lastFrameTime = useSharedValue(0);
  const frameCount = useSharedValue(0);

  // Pause the pipeline while covered or backgrounded.
  const isFocused = useIsFocused();
  const isForeground = useIsForeground();
  const isActive = isFocused && isForeground;

  useEffect(() => {
    if (isActive) return;
    // Clear after the fade-out so refocusing doesn't flash a stale frame.
    const timeout = setTimeout(() => {
      ascii.set("");
      fps.set(0);
      lastFrameTime.set(0);
      frameCount.set(0);
    }, PREVIEW_FADE_MS);
    return () => clearTimeout(timeout);
  }, [ascii, fps, frameCount, isActive, lastFrameTime]);

  useEffect(() => {
    if (!hasPermission) void requestPermission();
  }, [hasPermission, requestPermission]);

  const { resizer } = useResizer({
    width: resWidth,
    height: resHeight,
    channelOrder: "rgb",
    dataType: "uint8",
    pixelLayout: "planar",
    scaleMode: "stretch",
  });

  const trackFps = useCallback((frame: Frame) => {
    "worklet";
    // timestamp is in nanoseconds
    const timeStampMs = frame.timestamp / 1_000_000;
    if (lastFrameTime.get() === 0) lastFrameTime.set(timeStampMs);

    frameCount.set(frameCount.get() + 1);
    const elapsed = timeStampMs - lastFrameTime.get();

    if (elapsed >= 1000) {
      fps.set(Math.round((frameCount.get() * 1000) / elapsed));
      frameCount.set(0);
      lastFrameTime.set(timeStampMs);
    }
  }, [fps, frameCount, lastFrameTime]);

  const frameOutput = useFrameOutput({
    pixelFormat: "yuv",
    targetResolution: { height: resHeight, width: resWidth },
    dropFramesWhileBusy: true,
    onFrame(frame) {
      "worklet";
      const resizedFrame = resizer?.resize(frame);
      const buffer = resizedFrame?.getPixelBuffer();

      if (!buffer || !resizedFrame?.width || !frame.isValid) {
        resizedFrame?.dispose();
        frame.dispose();
        return;
      }

      trackFps(frame);

      ascii.set(pixelsToAscii(new Uint8Array(buffer), {
        width: resWidth,
        height: resHeight,
        chars: asciiChars,
        invert,
        layout: { kind: "planar" },
        reverse: true,
      }));

      resizedFrame.dispose();
      frame.dispose();
    },
  });

  const flip = useCallback(() => {
    setPosition((prev) => (prev === "back" ? "front" : "back"));
    if (settings.haptics) void Haptics.selectionAsync();
  }, [settings.haptics]);

  const shutterPressIn = useCallback(() => {
    if (settings.haptics) void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  }, [settings.haptics]);

  const capture = useCallback(async () => {
    if (!isActive || isCapturing || !ascii.get()) return;
    setIsCapturing(true);

    try {
      const text = ascii.get();
      const renderer = previewRef.current;
      if (!renderer) return;
      const tmpPngUri = await renderer.capturePng();
      const saved = await saveCapture({
        tmpPngUri,
        ascii: text,
        source: "camera",
        columns: resWidth,
        rows: resHeight,
        charsetId: options.charsetId,
        foreground: options.foreground,
        background: options.background,
        invert: options.invert,
      });
      addCapture(saved);
      if (settings.haptics) void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      if (settings.autoSaveToPhotos) {
        await exportToPhotos(capturePngUri(saved.id));
      }
    } finally {
      setIsCapturing(false);
    }
  }, [
    addCapture,
    ascii,
    isActive,
    isCapturing,
    previewRef,
    options.background,
    options.charsetId,
    options.foreground,
    options.invert,
    resHeight,
    resWidth,
    settings.autoSaveToPhotos,
    settings.haptics,
  ]);

  return {
    ascii,
    fps,
    frameOutput,
    hasPermission,
    requestPermission,
    isActive,
    position,
    showFps: settings.showFps,
    options,
    latestCapture,
    isCapturing,
    flip,
    shutterPressIn,
    capture,
    openSettings: () => router.push("/settings"),
    openOptions: () => router.push("/options"),
    openGallery: () => router.push("/gallery"),
  };
}
