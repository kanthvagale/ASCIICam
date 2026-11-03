import type { CharsetId } from "@/lib/ascii";

/**
 * Metadata for one saved capture. Files live in the app's document directory
 * as `captures/<id>.png` and `captures/<id>.json`; resolve their URIs with
 * `capturePngUri` / `captureJsonUri` rather than storing absolute paths, which
 * change between installs on iOS.
 */
export type Capture = {
  id: string;
  createdAt: number;
  source: "camera" | "upload";
  columns: number;
  rows: number;
  charsetId: CharsetId;
  foreground: string;
  background: string;
  invert: boolean;
};

/** What `<id>.json` holds — the metadata plus the raw characters. */
export type CaptureDocument = Capture & { ascii: string };
