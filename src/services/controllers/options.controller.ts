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

const SAMPLE_COLUMNS = 40;
const SAMPLE_ROWS = 12;

export function useOptionsController() {
  const store = useAsciiCamOptionsStore();
  const preview = useSharedValue("");

  useEffect(() => {
    preview.value = sampleText(store.asciiChars, store.invert, SAMPLE_COLUMNS, SAMPLE_ROWS);
  }, [preview, store.asciiChars, store.invert]);

  return {
    options: {
      resWidth: store.resWidth,
      charsetId: store.charsetId,
      foreground: store.foreground,
      background: store.background,
      invert: store.invert,
    },
    preview,
    previewColumns: SAMPLE_COLUMNS,
    previewRows: SAMPLE_ROWS,
    setOptions: store.setOptions,
    resetOptions: store.resetOptions,
  };
}
