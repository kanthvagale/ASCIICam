import { JetBrainsMono_700Bold } from "@expo-google-fonts/jetbrains-mono/700Bold";
import {
  AlphaType,
  Canvas,
  ColorType,
  FilterMode,
  ImageFormat,
  MipmapMode,
  Picture,
  Skia,
  TileMode,
  useCanvasRef,
  useFont,
  type SkFont,
  type SkImage,
} from "@shopify/react-native-skia";
import { File, Paths } from "expo-file-system";
import { useImperativeHandle, useMemo, useState, type Ref } from "react";
import { View, type LayoutChangeEvent, type StyleProp, type ViewStyle } from "react-native";
import { useDerivedValue, type SharedValue } from "react-native-reanimated";

import { makeStyles } from "@/theme";

const BASE_FONT_SIZE = 32;
/** Empty pixels around each atlas glyph so sampling never bleeds into the next one. */
const ATLAS_PADDING = 1;

/** Draws every cell's glyph from the atlas, tinted with that cell's colour. */
const COLOR_EFFECT = Skia.RuntimeEffect.Make(`
uniform shader indices;
uniform shader colors;
uniform shader glyphs;
uniform float2 grid;
uniform float2 cell;
uniform float slot;
uniform float2 origin;
uniform float scale;
uniform float4 background;

half4 main(float2 p) {
  float2 q = (p - origin) / scale;
  float2 c = floor(q / cell);
  if (c.x < 0.0 || c.y < 0.0 || c.x >= grid.x || c.y >= grid.y) {
    return half4(background);
  }
  float2 center = c + 0.5;
  float index = floor(indices.eval(center).r * 255.0 + 0.5);
  float2 local = q - c * cell;
  float coverage = glyphs.eval(float2(index * slot + ${ATLAS_PADDING}.0 + local.x, local.y)).a;
  float3 tint = colors.eval(center).rgb;
  return half4(half3(mix(background.rgb, tint, coverage)), 1.0);
}
`);

export type AsciiRendererHandle = {
  capturePng: () => Promise<string>;
};

export type AsciiRendererProps = {
  text: SharedValue<string>;
  columns: number;
  rows: number;
  color: string;
  background: string;
  /** Per-cell RGBA (columns × rows × 4). With `chars`, draws each character in its own colour. */
  colors?: SharedValue<Uint8Array | null>;
  /** The charset `text` was made from; needed for `colors`. */
  chars?: string[];
  ref?: Ref<AsciiRendererHandle>;
  style?: StyleProp<ViewStyle>;
};

type Size = { width: number; height: number };

type GlyphAtlas = {
  image: SkImage;
  /** Width of one glyph's slot in the atlas. */
  slot: number;
  indexOf: Record<string, number>;
};

/** Renders each character once, white on transparent, side by side. */
function makeGlyphAtlas(font: SkFont, chars: string[], advance: number, baseline: number): GlyphAtlas | null {
  const slot = Math.ceil(advance) + ATLAS_PADDING * 2;
  const surface = Skia.Surface.Make(slot * chars.length, BASE_FONT_SIZE);
  if (!surface) return null;

  const canvas = surface.getCanvas();
  canvas.clear(Skia.Color("transparent"));
  const paint = Skia.Paint();
  paint.setColor(Skia.Color("white"));
  paint.setAntiAlias(true);

  const indexOf: Record<string, number> = {};
  chars.forEach((char, i) => {
    indexOf[char] ??= i;
    canvas.drawText(char, i * slot + ATLAS_PADDING, baseline, paint, font);
  });
  surface.flush();

  return { image: surface.makeImageSnapshot(), slot, indexOf };
}

/** One texel per cell, no blending between neighbours. */
function nearestShader(image: SkImage) {
  "worklet";
  return image.makeShaderOptions(TileMode.Clamp, TileMode.Clamp, FilterMode.Nearest, MipmapMode.None);
}

export function AsciiRenderer({
  text,
  columns,
  rows,
  color,
  background,
  colors,
  chars,
  ref,
  style,
}: AsciiRendererProps) {
  const styles = useStyles();
  const canvasRef = useCanvasRef();
  const font = useFont(JetBrainsMono_700Bold, BASE_FONT_SIZE);
  const [frame, setFrame] = useState<Size | null>(null);

  const onLayout = ({ nativeEvent }: LayoutChangeEvent) => {
    const { width, height } = nativeEvent.layout;
    setFrame((prev) => (prev?.width === width && prev?.height === height ? prev : { width, height }));
  };

  const metrics = useMemo(() => {
    if (!font) return null;
    const advance = font.getGlyphWidths(font.getGlyphIDs("0"))[0];
    const { ascent, descent } = font.getMetrics();
    const lineHeight = BASE_FONT_SIZE;
    return { advance, lineHeight, baseline: (lineHeight - (descent - ascent)) / 2 - ascent };
  }, [font]);

  const atlas = useMemo(
    () => (font && metrics && chars && colors ? makeGlyphAtlas(font, chars, metrics.advance, metrics.baseline) : null),
    [chars, colors, font, metrics],
  );

  const layout = useMemo(() => {
    if (!metrics || !frame || frame.width <= 0 || frame.height <= 0) return null;

    const blockWidth = columns * metrics.advance;
    const blockHeight = rows * metrics.lineHeight;
    const scale = Math.min(frame.width / blockWidth, frame.height / blockHeight);

    const paint = Skia.Paint();
    paint.setColor(Skia.Color(color));
    paint.setAntiAlias(true);

    return {
      ...metrics,
      width: frame.width,
      height: frame.height,
      scale,
      offsetX: (frame.width - blockWidth * scale) / 2,
      offsetY: (frame.height - blockHeight * scale) / 2,
      paint,
      background: Skia.Color(background),
    };
  }, [background, color, columns, frame, metrics, rows]);

  const picture = useDerivedValue(() => {
    const recorder = Skia.PictureRecorder();
    // Finishing an unstarted recorder crashes natively.
    if (!layout || !font) {
      recorder.beginRecording(Skia.XYWHRect(0, 0, 1, 1));
      return recorder.finishRecordingAsPicture();
    }

    const bounds = Skia.XYWHRect(0, 0, layout.width, layout.height);
    const canvas = recorder.beginRecording(bounds);
    const lines = text.value.split("\n");
    const cellColors = colors?.value;

    // Original colours: one shader pass over the glyph atlas.
    if (cellColors && atlas && COLOR_EFFECT) {
      const gridRows = lines.length;
      const gridColumns = lines[0]?.length ?? 0;

      if (gridColumns > 0 && cellColors.length === gridColumns * gridRows * 4) {
        const indices = new Uint8Array(gridColumns * gridRows);
        for (let y = 0; y < gridRows; y++) {
          const line = lines[y];
          for (let x = 0; x < gridColumns; x++) {
            indices[y * gridColumns + x] = atlas.indexOf[line[x]] ?? 0;
          }
        }

        const indexImage = Skia.Image.MakeImage(
          { width: gridColumns, height: gridRows, colorType: ColorType.Gray_8, alphaType: AlphaType.Opaque },
          Skia.Data.fromBytes(indices),
          gridColumns,
        );
        const colorImage = Skia.Image.MakeImage(
          { width: gridColumns, height: gridRows, colorType: ColorType.RGBA_8888, alphaType: AlphaType.Opaque },
          Skia.Data.fromBytes(cellColors),
          gridColumns * 4,
        );

        if (indexImage && colorImage) {
          const shader = COLOR_EFFECT.makeShaderWithChildren(
            [
              gridColumns,
              gridRows,
              layout.advance,
              layout.lineHeight,
              atlas.slot,
              layout.offsetX,
              layout.offsetY,
              layout.scale,
              layout.background[0],
              layout.background[1],
              layout.background[2],
              layout.background[3],
            ],
            [
              nearestShader(indexImage),
              nearestShader(colorImage),
              atlas.image.makeShaderOptions(TileMode.Clamp, TileMode.Clamp, FilterMode.Linear, MipmapMode.None),
            ],
          );
          const paint = Skia.Paint();
          paint.setShader(shader);
          canvas.drawRect(bounds, paint);
          return recorder.finishRecordingAsPicture();
        }
      }
    }

    canvas.drawColor(layout.background);
    canvas.translate(layout.offsetX, layout.offsetY);
    canvas.scale(layout.scale, layout.scale);
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
