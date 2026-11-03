import { JetBrainsMono_700Bold } from "@expo-google-fonts/jetbrains-mono/700Bold";
import {
  Canvas,
  ImageFormat,
  Picture,
  Skia,
  useCanvasRef,
  useFont,
} from "@shopify/react-native-skia";
import { File, Paths } from "expo-file-system";
import { useImperativeHandle, useMemo, useState, type Ref } from "react";
import { View, type LayoutChangeEvent, type StyleProp, type ViewStyle } from "react-native";
import { useDerivedValue, type SharedValue } from "react-native-reanimated";

import { makeStyles } from "@/theme";

const BASE_FONT_SIZE = 32;

export type AsciiRendererHandle = {
  capturePng: () => Promise<string>;
};

export type AsciiRendererProps = {
  text: SharedValue<string>;
  columns: number;
  rows: number;
  color: string;
  background: string;
  ref?: Ref<AsciiRendererHandle>;
  style?: StyleProp<ViewStyle>;
};

type Size = { width: number; height: number };

export function AsciiRenderer({ text, columns, rows, color, background, ref, style }: AsciiRendererProps) {
  const styles = useStyles();
  const canvasRef = useCanvasRef();
  const font = useFont(JetBrainsMono_700Bold, BASE_FONT_SIZE);
  const [frame, setFrame] = useState<Size | null>(null);

  const onLayout = ({ nativeEvent }: LayoutChangeEvent) => {
    const { width, height } = nativeEvent.layout;
    setFrame((prev) => (prev?.width === width && prev?.height === height ? prev : { width, height }));
  };

  const layout = useMemo(() => {
    if (!font || !frame || frame.width <= 0 || frame.height <= 0) return null;

    const advance = font.getGlyphWidths(font.getGlyphIDs("0"))[0];
    const { ascent, descent } = font.getMetrics();
    const lineHeight = BASE_FONT_SIZE;
    const blockWidth = columns * advance;
    const blockHeight = rows * lineHeight;
    const scale = Math.min(frame.width / blockWidth, frame.height / blockHeight);

    const paint = Skia.Paint();
    paint.setColor(Skia.Color(color));
    paint.setAntiAlias(true);

    return {
      width: frame.width,
      height: frame.height,
      scale,
      offsetX: (frame.width - blockWidth * scale) / 2,
      offsetY: (frame.height - blockHeight * scale) / 2,
      lineHeight,
      baseline: (lineHeight - (descent - ascent)) / 2 - ascent,
      paint,
      background: Skia.Color(background),
    };
  }, [background, color, columns, font, frame, rows]);

  const picture = useDerivedValue(() => {
    const recorder = Skia.PictureRecorder();
    // Finishing an unstarted recorder crashes natively.
    if (!layout || !font) {
      recorder.beginRecording(Skia.XYWHRect(0, 0, 1, 1));
      return recorder.finishRecordingAsPicture();
    }

    const canvas = recorder.beginRecording(Skia.XYWHRect(0, 0, layout.width, layout.height));
    canvas.drawColor(layout.background);
    canvas.translate(layout.offsetX, layout.offsetY);
    canvas.scale(layout.scale, layout.scale);

    const lines = text.value.split("\n");
    for (let i = 0; i < lines.length; i++) {
      canvas.drawText(lines[i], 0, layout.baseline + i * layout.lineHeight, layout.paint, font);
    }

    return recorder.finishRecordingAsPicture();
  });

  useImperativeHandle(
    ref,
    () => ({
      capturePng: async () => {
        const image = await canvasRef.current?.makeImageSnapshotAsync();
        if (!image) throw new Error("ASCII canvas is not ready");
        const file = new File(Paths.cache, `ascii-${Date.now()}.png`);
        file.create({ overwrite: true });
        file.write(image.encodeToBytes(ImageFormat.PNG));
        return file.uri;
      },
    }),
    [canvasRef],
  );

  return (
    <View onLayout={onLayout} pointerEvents="none" style={[styles.frame, { backgroundColor: background }, style]}>
      <Canvas ref={canvasRef} style={styles.canvas}>
        <Picture picture={picture} />
      </Canvas>
    </View>
  );
}

const useStyles = makeStyles(() => ({
  frame: { flex: 1, overflow: "hidden" },
  canvas: { flex: 1 },
}));
