import { useState, type Ref } from "react";
import {
  PixelRatio,
  Text,
  TextInput,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type TextLayoutEvent,
  type ViewStyle,
} from "react-native";
import Animated, { useAnimatedProps, type SharedValue } from "react-native-reanimated";

import { MONO_CHAR_ASPECT } from "@/constants/ascii";
import { fontFamilies, makeStyles } from "@/theme";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export type AsciiRendererProps = {
  /** Updated from any thread (frame processor, JS) without a React re-render. */
  text: SharedValue<string>;
  /** Grid size — the renderer sizes the text so this grid fills the frame. */
  columns: number;
  rows: number;
  color: string;
  background: string;
  /** Attach for `react-native-view-shot` — captures the whole framed output. */
  ref?: Ref<View>;
  style?: StyleProp<ViewStyle>;
};

type Size = { width: number; height: number };

/**
 * Largest font size, in whole device pixels, at which the grid fits the frame.
 *
 * Android rounds font sizes *up* to whole pixels, so an unrounded size renders
 * wider than computed and rows overflow or wrap. Flooring to a pixel first
 * leaves nothing for it to round.
 */
function pixelFontSize(frame: Size, columns: number, rows: number): number {
  const target = Math.min(frame.width / (columns * MONO_CHAR_ASPECT), frame.height / rows);
  const ratio = PixelRatio.get();
  return Math.max(1, Math.floor(target * ratio)) / ratio;
}

/**
 * Renders ASCII art by driving a read-only TextInput's `text` prop from a
 * SharedValue. A plain <Text> would need a React render per frame; this updates
 * natively, which is what keeps the live camera smooth.
 *
 * Sizing is exact on both platforms: pick a pixel-aligned font size, measure
 * how wide one row really renders (glyph advances can round too), then scale
 * the block so that row spans the frame edge to edge.
 */
export function AsciiRenderer({ text, columns, rows, color, background, ref, style }: AsciiRendererProps) {
  const styles = useStyles();
  const [frame, setFrame] = useState<Size | null>(null);
  // Keyed by what was measured, so a stale width is never applied to a new size.
  const [measured, setMeasured] = useState<{ key: string; rowWidth: number } | null>(null);

  const animatedProps = useAnimatedProps(() => ({
    value: text.value,
    text: text.value,
  }));

  const onFrameLayout = ({ nativeEvent }: LayoutChangeEvent) => {
    const { width, height } = nativeEvent.layout;
    setFrame((prev) => (prev?.width === width && prev?.height === height ? prev : { width, height }));
  };

  const fontSize = frame && frame.width > 0 && frame.height > 0 ? pixelFontSize(frame, columns, rows) : 0;
  const measureKey = `${fontSize}|${columns}`;
  const rowWidth = measured?.key === measureKey ? measured.rowWidth : null;

  const onRowLayout = ({ nativeEvent }: TextLayoutEvent) => {
    const width = nativeEvent.lines[0]?.width;
    if (width) setMeasured({ key: measureKey, rowWidth: width });
  };

  const fontStyle = { fontSize, lineHeight: fontSize };
  const blockHeight = rows * fontSize;
  const scale =
    frame && rowWidth ? Math.min(frame.width / rowWidth, frame.height / blockHeight) : 1;

  return (
    <View
      ref={ref}
      collapsable={false}
      pointerEvents="none"
      onLayout={onFrameLayout}
      style={[styles.frame, { backgroundColor: background }, style]}
    >
      {fontSize > 0 ? (
        <>
          {/* Invisible probe: one full row, in a box wide enough never to wrap. */}
          <View style={[styles.probe, { width: columns * fontSize * 2 }]}>
            <Text
              allowFontScaling={false}
              numberOfLines={1}
              onTextLayout={onRowLayout}
              style={[styles.glyphs, fontStyle]}
            >
              {"0".repeat(columns)}
            </Text>
          </View>

          {rowWidth ? (
            <AnimatedTextInput
              animatedProps={animatedProps}
              editable={false}
              allowFontScaling={false}
              multiline
              scrollEnabled={false}
              style={[
                styles.glyphs,
                styles.input,
                fontStyle,
                {
                  color,
                  // A pixel of slack so the input's own layout never wraps a row.
                  width: rowWidth + 1,
                  height: blockHeight,
                  transform: [{ scale }],
                },
              ]}
            />
          ) : null}
        </>
      ) : null}
    </View>
  );
}

const useStyles = makeStyles(() => ({
  frame: { flex: 1, alignItems: "center", justifyContent: "center", overflow: "hidden" },
  glyphs: {
    fontFamily: fontFamilies.ascii,
    includeFontPadding: false,
    // JetBrains Mono ligatures would merge runs like "--" and "==" in the ramps.
    fontVariant: ["no-contextual", "no-common-ligatures"],
    padding: 0,
  },
  input: {
    textAlign: "center",
    textAlignVertical: "center",
    backgroundColor: "transparent",
  },
  probe: { position: "absolute", top: 0, left: 0, opacity: 0 },
}));
