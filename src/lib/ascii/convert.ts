/**
 * Pure, worklet-safe pixel → ASCII conversion. Shared by the live camera
 * (frame processor thread) and uploaded images (JS thread).
 */

export type PixelLayout =
  /** RRR…GGG…BBB… — what the vision-camera resizer produces. */
  | { kind: "planar" }
  /** Interleaved bytes; offsets are the R/G/B byte positions inside a pixel. */
  | {
      kind: "interleaved";
      bytesPerPixel: number;
      bytesPerRow: number;
      r: number;
      g: number;
      b: number;
    };

export type ConvertOptions = {
  width: number;
  height: number;
  chars: string[];
  invert: boolean;
  layout: PixelLayout;
  /**
   * Walk the buffer back to front — a 180° rotation. The camera frame arrives
   * upside down relative to the portrait preview, so the live view sets this.
   */
  reverse?: boolean;
};

export function luminanceToChar(
  luminance: number,
  chars: string[],
  invert: boolean,
): string {
  "worklet";
  const last = chars.length - 1;
  const index = Math.floor((luminance / 255) * last);
  return chars[invert ? last - index : index];
}

export function pixelsToAscii(pixels: Uint8Array, options: ConvertOptions): string {
  "worklet";
  const { width, height, chars, invert, layout, reverse = false } = options;
  const pixelCount = width * height;
  let output = "";

  for (let n = 0; n < pixelCount; n++) {
    const i = reverse ? pixelCount - 1 - n : n;
    const x = i % width;
    const y = (i - x) / width;

    let r: number;
    let g: number;
    let b: number;

    if (layout.kind === "planar") {
      r = pixels[i];
      g = pixels[pixelCount + i];
      b = pixels[pixelCount * 2 + i];
    } else {
      const offset = y * layout.bytesPerRow + x * layout.bytesPerPixel;
      r = pixels[offset + layout.r];
      g = pixels[offset + layout.g];
      b = pixels[offset + layout.b];
    }

    output += luminanceToChar(0.2126 * r + 0.7152 * g + 0.0722 * b, chars, invert);

    // End of a row in walk order: x === 0 when reversed, x === width - 1 otherwise.
    const rowEnd = reverse ? x === 0 : x === width - 1;
    if (rowEnd && n !== pixelCount - 1) output += "\n";
  }

  return output;
}
