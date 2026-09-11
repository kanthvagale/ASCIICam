import AnimatedText from "@/components/ui/animated-text";
import {
  pixelCount,
  resolutionHeight,
  resolutionWidth,
} from "@/constants/camera";
import { useHomeController } from "@/services";
import { makeStyles } from "@/theme";
import { useEffect, useState } from "react";
import { Pressable } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Camera,
  CameraDevice,
  TargetCameraPosition,
  useCameraPermission,
  useFrameOutput,
} from "react-native-vision-camera";
import { useResizer } from "react-native-vision-camera-resizer";

const chars = "    ....----===+++***##%%@@";

export default function HomeScreen() {
  const styles = useStyles();
  useHomeController();
  const ascii = useSharedValue<string>("");
  const { hasPermission, requestPermission } = useCameraPermission();
  const [camDevice, setCamDevice] = useState<
    CameraDevice | TargetCameraPosition
  >("back");

  useEffect(() => {
    if (!hasPermission) requestPermission();
  }, [hasPermission, requestPermission]);

  const { resizer } = useResizer({
    width: resolutionWidth,
    height: resolutionHeight,
    channelOrder: "rgb",
    dataType: "uint8",
    pixelLayout: "planar",
    scaleMode: "stretch",
  });

  const getAsciiFrame = (
    pixels: Uint8Array<ArrayBuffer>,
    i: number,
    output: string,
  ): string => {
    "worklet";

    const r = pixels[i];
    const g = pixels[pixelCount + i];
    const b = pixels[pixelCount * 2 + i];

    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    const index = Math.floor((luminance / 255) * (chars.length - 1));

    output += chars[index];

    if (i % resolutionWidth === 0) {
      output += "\n";
    }

    return output;
  };

  const frameOutput = useFrameOutput({
    // ...options
    pixelFormat: "yuv",
    targetResolution: { height: resolutionHeight, width: resolutionWidth },
    onFrame(frame) {
      "worklet";
      const resizedFrame = resizer?.resize(frame);

      const buffer = resizedFrame?.getPixelBuffer();

      if (!buffer || !resizedFrame?.width) {
        resizedFrame?.dispose();
        frame.dispose();
        return;
      }

      const pixels = new Uint8Array(buffer);
      let output = "";

      for (let i = pixelCount - 1; i >= 0; i--) {
        output = getAsciiFrame(pixels, i, output);
      }

      ascii.value = output;

      resizedFrame?.dispose();
      frame.dispose();
    },
  });

  return (
    <SafeAreaView style={styles.root}>
      <Camera
        style={styles.invisible}
        isActive={true}
        device={camDevice}
        outputs={[frameOutput]}
        mirrorMode="off"
      />

      <Pressable
        onPress={() =>
          setCamDevice((prev) => {
            if (prev === "back") {
              return "front";
            } else {
              return "back";
            }
          })
        }
        style={styles.sty}
      >
        <AnimatedText text={ascii} />
      </Pressable>
    </SafeAreaView>
  );
}

const useStyles = makeStyles((theme) => ({
  root: { flex: 1, backgroundColor: theme.colors.background },
  background: { height: "100%", width: "100%", position: "absolute" },
  invisible: { height: 0, width: 0, position: "absolute" },
  sty: { flex: 1, backgroundColor: "black" },
}));
