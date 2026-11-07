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

function writeColor(colors: Uint8Array, cell: number, r: number, g: number, b: number) {
  "worklet";
  const offset = cell * 4;
  colors[offset] = r;
  colors[offset + 1] = g;
  colors[offset + 2] = b;
  colors[offset + 3] = 255;
}

/** BT.601 video-range YUV to RGB. */
function writeYuvColor(colors: Uint8Array, cell: number, y: number, u: number, v: number) {
  "worklet";
  const c = 1.164 * (y - 16);
  const d = u - 128;
  const e = v - 128;
  // Uint8Array wraps out-of-range values, so clamp first.
  writeColor(
    colors,
    cell,
    Math.min(255, Math.max(0, c + 1.596 * e)),
    Math.min(255, Math.max(0, c - 0.392 * d - 0.813 * e)),
    Math.min(255, Math.max(0, c + 2.017 * d)),
  );
}

/** `colors`, if given, gets each cell's RGBA (cols × rows × 4, in output order). */
export function pixelsToAscii(pixels: Uint8Array, options: ConvertOptions, colors?: Uint8Array): string {
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
    if (colors) writeColor(colors, n, r, g, b);

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

export type ChromaPlane = LumaPlane & {
  /** 1 for planar U/V, 2 for interleaved UV (NV12/NV21). */
  pixelStride: number;
};

/** The U and V planes of a YUV 4:2:0 frame, plus the RGBA buffer to fill. */
export type ChromaInput = { u: ChromaPlane; v: ChromaPlane; colors: Uint8Array };

/** Samples a camera Y (brightness) plane down to width × height, stretched like the GPU resizer. */
export function lumaToAscii(
  plane: LumaPlane,
  options: Omit<ConvertOptions, "layout">,
  chroma?: ChromaInput,
): string {
  "worklet";
  const { width, height, chars, invert, reverse = false } = options;
  let output = "";

  for (let row = 0; row < height; row++) {
    const y = reverse ? height - 1 - row : row;
    const fy = (y + 0.5) / height;
    const rowStart = Math.floor(fy * plane.height) * plane.bytesPerRow;

    for (let col = 0; col < width; col++) {
      const x = reverse ? width - 1 - col : col;
      const fx = (x + 0.5) / width;
      const luma = plane.pixels[rowStart + Math.floor(fx * plane.width)];
      // Camera Y is video range (16–235).
      output += luminanceToChar(Math.min(255, Math.max(0, ((luma - 16) * 255) / 219)), chars, invert);

      if (chroma) {
        const { u, v, colors } = chroma;
        const cu = u.pixels[Math.floor(fy * u.height) * u.bytesPerRow + Math.floor(fx * u.width) * u.pixelStride];
        const cv = v.pixels[Math.floor(fy * v.height) * v.bytesPerRow + Math.floor(fx * v.width) * v.pixelStride];
        writeYuvColor(colors, row * width + col, luma, cu, cv);
      }
    }

    if (row !== height - 1) output += "\n";
  }

  return output;
}
