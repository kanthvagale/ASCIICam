import { Directory, File, Paths } from "expo-file-system";

import type { Capture, CaptureDocument } from "@/types/capture";

const capturesDir = () => new Directory(Paths.document, "captures");

export const capturePngUri = (id: string) => new File(capturesDir(), `${id}.png`).uri;
export const captureJsonUri = (id: string) => new File(capturesDir(), `${id}.json`).uri;

const newId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

export type SaveCaptureInput = Omit<Capture, "id" | "createdAt"> & {
  /** Temp PNG from `AsciiRendererHandle.capturePng()`; moved into app storage. */
  tmpPngUri: string;
  ascii: string;
};

/** Moves the snapshot into app storage and writes the ASCII alongside it. */
export async function saveCapture({ tmpPngUri, ascii, ...meta }: SaveCaptureInput): Promise<Capture> {
  const dir = capturesDir();
  dir.create({ intermediates: true, idempotent: true });

  const capture: Capture = { ...meta, id: newId(), createdAt: Date.now() };

  await new File(tmpPngUri).move(new File(dir, `${capture.id}.png`));

  const json = new File(dir, `${capture.id}.json`);
  json.create({ overwrite: true });
  json.write(JSON.stringify({ ...capture, ascii } satisfies CaptureDocument));

  return capture;
}

export async function readCaptureAscii(id: string): Promise<string> {
  const doc = JSON.parse(await new File(capturesDir(), `${id}.json`).text()) as CaptureDocument;
  return doc.ascii;
}

export function deleteCaptureFiles(id: string): void {
  for (const name of [`${id}.png`, `${id}.json`]) {
    const file = new File(capturesDir(), name);
    if (file.exists) file.delete();
  }
}

export function deleteAllCaptureFiles(): void {
  const dir = capturesDir();
  if (dir.exists) dir.delete();
}
