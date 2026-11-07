import * as Haptics from "expo-haptics";
import { useIsFocused, useRouter } from "expo-router";
import { type RefObject, useCallback, useEffect, useState } from "react";
import { useSharedValue } from "react-native-reanimated";
import {
  type Frame,
  type FramePlane,
  useCameraPermission,
  useFrameOutput,
} from "react-native-vision-camera";
import { useResizer } from "react-native-vision-camera-resizer";
import { scheduleOnRN } from "react-native-worklets";

import type { AsciiRendererHandle } from "@/components/ascii";

import { useIsForeground } from "@/hooks/use-is-foreground";
import { type ChromaPlane, lumaToAscii, pixelsToAscii } from "@/lib/ascii";
import { capturePngUri, exportToPhotos, saveCapture } from "@/services/captures";
import { reportError } from "@/services/crashlytics";
import { useAsciiCamOptionsStore } from "@/store/camera-options";
import { useCapturesStore } from "@/store/captures";
import { type CameraPosition, useSettingsStore } from "@/store/settings";

// Fixed so changing the ASCII resolution never rebuilds the camera stream (a new object here
// recreates the frame output and reconfigures the session). 4:3 like the grid, enough for 512 columns.
const STREAM_RESOLUTION = { width: 640, height: 480 };

type AsciiFrame = { text: string; colors: Uint8Array | null };

// Module-level worklet: the React Compiler would hoist an inline helper out of the frame worklet.
function toPlane(plane: FramePlane): ChromaPlane {
  "worklet";
  return {
    pixels: new Uint8Array(plane.getPixelBuffer()),
    width: plane.width,
    height: plane.height,
    bytesPerRow: plane.bytesPerRow,
    // Frames don't expose the pixel stride; interleaved UV rows are twice the plane width.
    pixelStride: Math.min(2, Math.max(1, Math.round(plane.bytesPerRow / plane.width))),
  };
}

function reportResizeFailure(message: string) {
  reportError(new Error(message), "camera.resize");
}

export function useCameraController(previewRef: RefObject<AsciiRendererHandle | null>) {
  const router = useRouter();

  const options = useAsciiCamOptionsStore();
  const { resWidth, resHeight, asciiChars, invert, colorMode } = options;
  const withColor = colorMode === "original";
  const settings = useSettingsStore();
  const addCapture = useCapturesStore((s) => s.add);
  const latestCapture = useCapturesStore((s) => s.captures[0]);

  const { hasPermission, requestPermission } = useCameraPermission();
  const [position, setPosition] = useState<CameraPosition>(settings.defaultCamera);
  const [isCapturing, setIsCapturing] = useState(false);

  const ascii = useSharedValue<string>("");
  // Per-cell RGBA, only filled in original colour mode.
  const colors = useSharedValue<Uint8Array | null>(null);
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
    colors.set(null);
    fps.set(0);
    lastFrameTime.set(0);
    frameCount.set(0);
  }, [ascii, colors, fps, frameCount, isActive, lastFrameTime]);

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

  const gpuAscii = useCallback((frame: Frame): AsciiFrame | undefined => {
    "worklet";
    if (!resizer) return undefined;
    const resized = resizer.resize(frame);
    try {
      // A new resizer is created async after a resolution change, so use its own size.
      const { width, height } = resized;
      if (!width || !height) return undefined;
      const cellColors = withColor ? new Uint8Array(width * height * 4) : null;
      const text = pixelsToAscii(
        new Uint8Array(resized.getPixelBuffer()),
        { width, height, chars: asciiChars, invert, layout: { kind: "planar" }, reverse: true },
        cellColors ?? undefined,
      );
      return { text, colors: cellColors };
    } finally {
      resized.dispose();
    }
  }, [asciiChars, invert, resizer, withColor]);

  const cpuAscii = useCallback((frame: Frame): AsciiFrame | undefined => {
    "worklet";
    if (!frame.isPlanar) return undefined;
    const planes = frame.getPlanes();
    try {
      const [luma, u, v] = planes;
      if (!luma) return undefined;

      const cellColors = withColor && u && v ? new Uint8Array(resWidth * resHeight * 4) : null;

      const text = lumaToAscii(
        toPlane(luma),
        { width: resWidth, height: resHeight, chars: asciiChars, invert, reverse: true },
        cellColors ? { u: toPlane(u), v: toPlane(v), colors: cellColors } : undefined,
      );
      return { text, colors: cellColors };
    } finally {
      for (const plane of planes) plane.dispose();
    }
  }, [asciiChars, invert, resHeight, resWidth, withColor]);

  const frameOutput = useFrameOutput({
    pixelFormat: "yuv",
    targetResolution: STREAM_RESOLUTION,
    dropFramesWhileBusy: true,
    onFrame(frame) {
      "worklet";
      try {
        if (!frame.isValid) return;

        let result: AsciiFrame | undefined;
        if (resizer && !resizeFailed.get()) {
          try {
            result = gpuAscii(frame);
          } catch (error) {
            resizeFailed.set(true);
            scheduleOnRN(reportResizeFailure, String(error));
          }
        }
        if (result === undefined && (!resizer || resizeFailed.get())) result = cpuAscii(frame);
        if (result === undefined) return;

        trackFps(frame);
        if (result.colors) colors.set(result.colors);
        ascii.set(result.text);
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
        colorMode,
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
    colorMode,
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
    colors,
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
