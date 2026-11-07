import { useEffect } from "react";
import { useSharedValue } from "react-native-reanimated";

import { useAsciiCamOptionsStore } from "@/store/camera-options";

function sampleText(chars: string[], invert: boolean, columns: number, rows: number): string {
  const last = chars.length - 1;
  const lines: string[] = [];
  for (let y = 0; y < rows; y++) {
    let line = "";
    for (let x = 0; x < columns; x++) {
      const dx = x / (columns - 1) - 0.5;
      const dy = (y / (rows - 1) - 0.5) * 1.6;
      const level = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) * 1.6);
      const index = Math.round(level * last);
      line += chars[invert ? last - index : index];
    }
    lines.push(line);
  }
  return lines.join("\n");
}

/** A left-to-right rainbow, so original colour mode has something to show. */
function sampleColors(columns: number, rows: number): Uint8Array {
  const colors = new Uint8Array(columns * rows * 4);
  for (let x = 0; x < columns; x++) {
    const hue = (x / columns) * 6;
    const f = hue - Math.floor(hue);
    const rgb = [
      [1, f, 0],
      [1 - f, 1, 0],
      [0, 1, f],
      [0, 1 - f, 1],
      [f, 0, 1],
      [1, 0, 1 - f],
    ][Math.floor(hue) % 6];
    for (let y = 0; y < rows; y++) {
      const offset = (y * columns + x) * 4;
      colors[offset] = rgb[0] * 255;
      colors[offset + 1] = rgb[1] * 255;
      colors[offset + 2] = rgb[2] * 255;
      colors[offset + 3] = 255;
    }
  }
  return colors;
}

const SAMPLE_COLUMNS = 40;
const SAMPLE_ROWS = 12;
const SAMPLE_COLORS = sampleColors(SAMPLE_COLUMNS, SAMPLE_ROWS);

export function useOptionsController() {
  const store = useAsciiCamOptionsStore();
  const preview = useSharedValue("");
  const previewColors = useSharedValue<Uint8Array | null>(SAMPLE_COLORS);

  useEffect(() => {
    preview.value = sampleText(store.asciiChars, store.invert, SAMPLE_COLUMNS, SAMPLE_ROWS);
  }, [preview, store.asciiChars, store.invert]);

  return {
    options: {
      resWidth: store.resWidth,
      charsetId: store.charsetId,
      colorMode: store.colorMode,
      foreground: store.foreground,
      background: store.background,
      invert: store.invert,
    },
    preview,
    previewColors,
    chars: store.asciiChars,
    previewColumns: SAMPLE_COLUMNS,
    previewRows: SAMPLE_ROWS,
    setOptions: store.setOptions,
    resetOptions: store.resetOptions,
  };
}
