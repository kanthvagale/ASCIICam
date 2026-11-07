/** Worklet-safe: runs on the frame processor and the JS thread. */

export type PixelLayout =
  /** RRR…GGG…BBB… */
  | { kind: "planar" }
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
  /** Rotate 180° (camera frames arrive upside down). */
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

    const rowEnd = reverse ? x === 0 : x === width - 1;
    if (rowEnd && n !== pixelCount - 1) output += "\n";
  }

  return output;
}

export type LumaPlane = {
  pixels: Uint8Array;
  width: number;
  height: number;
  bytesPerRow: number;
};

/** Samples a camera Y (brightness) plane down to width × height, stretched like the GPU resizer. */
export function lumaToAscii(plane: LumaPlane, options: Omit<ConvertOptions, "layout">): string {
  "worklet";
  const { width, height, chars, invert, reverse = false } = options;
  let output = "";

  for (let row = 0; row < height; row++) {
    const y = reverse ? height - 1 - row : row;
    const rowStart = Math.floor(((y + 0.5) * plane.height) / height) * plane.bytesPerRow;

    for (let col = 0; col < width; col++) {
      const x = reverse ? width - 1 - col : col;
      const luma = plane.pixels[rowStart + Math.floor(((x + 0.5) * plane.width) / width)];
      // Camera Y is video range (16–235).
      output += luminanceToChar(Math.min(255, Math.max(0, ((luma - 16) * 255) / 219)), chars, invert);
    }

    if (row !== height - 1) output += "\n";
  }

  return output;
}
