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
import { scheduleOnRN } from "react-native-worklets";

import type { AsciiRendererHandle } from "@/components/ascii";

import { useIsForeground } from "@/hooks/use-is-foreground";
import { lumaToAscii, pixelsToAscii } from "@/lib/ascii";
import { capturePngUri, exportToPhotos, saveCapture } from "@/services/captures";
import { reportError } from "@/services/crashlytics";
import { useAsciiCamOptionsStore } from "@/store/camera-options";
import { useCapturesStore } from "@/store/captures";
import { type CameraPosition, useSettingsStore } from "@/store/settings";

// Fixed so changing the ASCII resolution never rebuilds the camera stream (a new object here
// recreates the frame output and reconfigures the session). 4:3 like the grid, enough for 512 columns.
const STREAM_RESOLUTION = { width: 640, height: 480 };

function reportResizeFailure(message: string) {
  reportError(new Error(message), "camera.resize");
}

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

  // Clear so refocusing doesn't flash a stale frame.
  useEffect(() => {
    if (isActive) return;
    ascii.set("");
    fps.set(0);
    lastFrameTime.set(0);
    frameCount.set(0);
  }, [ascii, fps, frameCount, isActive, lastFrameTime]);

  useEffect(() => {
    if (!hasPermission) void requestPermission();
  }, [hasPermission, requestPermission]);

  // The GPU resizer needs Vulkan 1.1, which many low-end Android phones lack; those fall back to the CPU.
  const { resizer, error: resizerError } = useResizer({
    width: resWidth,
    height: resHeight,
    channelOrder: "rgb",
    dataType: "uint8",
    pixelLayout: "planar",
    scaleMode: "stretch",
  });
  const resizeFailed = useSharedValue(false);

  useEffect(() => {
    if (resizerError) reportError(resizerError, "camera.resizer");
  }, [resizerError]);

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

  const gpuAscii = useCallback((frame: Frame) => {
    "worklet";
    if (!resizer) return undefined;
    const resized = resizer.resize(frame);
    try {
      // A new resizer is created async after a resolution change, so use its own size.
      if (!resized.width || !resized.height) return undefined;
      return pixelsToAscii(new Uint8Array(resized.getPixelBuffer()), {
        width: resized.width,
        height: resized.height,
        chars: asciiChars,
        invert,
        layout: { kind: "planar" },
        reverse: true,
      });
    } finally {
      resized.dispose();
    }
  }, [asciiChars, invert, resizer]);

  const cpuAscii = useCallback((frame: Frame) => {
    "worklet";
    if (!frame.isPlanar) return undefined;
    const planes = frame.getPlanes();
    try {
      const luma = planes[0];
      if (!luma) return undefined;
      return lumaToAscii(
        {
          pixels: new Uint8Array(luma.getPixelBuffer()),
          width: luma.width,
          height: luma.height,
          bytesPerRow: luma.bytesPerRow,
        },
        { width: resWidth, height: resHeight, chars: asciiChars, invert, reverse: true },
      );
    } finally {
      for (const plane of planes) plane.dispose();
    }
  }, [asciiChars, invert, resHeight, resWidth]);

  const frameOutput = useFrameOutput({
    pixelFormat: "yuv",
    targetResolution: STREAM_RESOLUTION,
    dropFramesWhileBusy: true,
    onFrame(frame) {
      "worklet";
      try {
        if (!frame.isValid) return;

        let text: string | undefined;
        if (resizer && !resizeFailed.get()) {
          try {
            text = gpuAscii(frame);
          } catch (error) {
            resizeFailed.set(true);
            scheduleOnRN(reportResizeFailure, String(error));
          }
        }
        if (text === undefined && (!resizer || resizeFailed.get())) text = cpuAscii(frame);
        if (text === undefined) return;

        trackFps(frame);
        ascii.set(text);
      } finally {
        frame.dispose();
      }
    },
  });

  const onCameraError = useCallback((error: Error) => reportError(error, "camera.session"), []);

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
    onCameraError,
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
