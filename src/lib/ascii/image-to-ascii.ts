import { loadImage, type PixelFormat } from "react-native-nitro-image";

import { MONO_CHAR_ASPECT } from "@/constants/ascii";

import { pixelsToAscii, type PixelLayout } from "./convert";

export type ImageToAsciiOptions = {
  columns: number;
  chars: string[];
  invert: boolean;
};

export type AsciiImage = {
  text: string;
  columns: number;
  rows: number;
};

/** BGRA on iOS, RGBA on Android. */
function layoutFor(format: PixelFormat, width: number, height: number, byteLength: number): PixelLayout {
  const channels = format === "unknown" ? "RGBA" : format;
  const bytesPerPixel = channels.length;
  return {
    kind: "interleaved",
    bytesPerPixel,
    // Rows can be padded, so take the stride from the buffer.
    bytesPerRow: Math.max(width * bytesPerPixel, Math.floor(byteLength / height)),
    r: channels.indexOf("R"),
    g: channels.indexOf("G"),
    b: channels.indexOf("B"),
  };
}

export async function imageToAscii(uri: string, options: ImageToAsciiOptions): Promise<AsciiImage> {
  const image = await loadImage({ filePath: uri });
  const columns = options.columns;
  const rows = Math.max(1, Math.round(columns * (image.height / image.width) * MONO_CHAR_ASPECT));

  // Free the full-size decode early.
  const resized = await image.resizeAsync(columns, rows).finally(() => image.dispose());
  const raw = await resized.toRawPixelDataAsync().finally(() => resized.dispose());

  const text = pixelsToAscii(new Uint8Array(raw.buffer), {
    width: raw.width,
    height: raw.height,
    chars: options.chars,
    invert: options.invert,
    layout: layoutFor(raw.pixelFormat, raw.width, raw.height, raw.buffer.byteLength),
  });

  return { text, columns: raw.width, rows: raw.height };
}
