import type { ColorMode } from "@/constants/ascii";
import type { CharsetId } from "@/lib/ascii";

/** Resolve file URIs via capturePngUri; absolute paths change between iOS installs. */
export type Capture = {
  id: string;
  createdAt: number;
  source: "camera" | "upload";
  columns: number;
  rows: number;
  charsetId: CharsetId;
  /** Missing on captures saved before colour mode existed. */
  colorMode?: ColorMode;
  foreground: string;
  background: string;
  invert: boolean;
};

export type CaptureDocument = Capture & { ascii: string };
