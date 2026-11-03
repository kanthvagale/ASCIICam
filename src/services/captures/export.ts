import { Album, Asset, requestPermissionsAsync } from "expo-media-library";

const ALBUM_NAME = "ASCIICam";

export type ExportResult = "saved" | "denied";

/**
 * Copies a PNG into the system photo library, inside an "ASCIICam" album when
 * the platform lets us read albums. Write-only access is enough to save, so the
 * album step is best-effort.
 */
export async function exportToPhotos(pngUri: string): Promise<ExportResult> {
  const { granted } = await requestPermissionsAsync(true);
  if (!granted) return "denied";

  const asset = await Asset.create(pngUri);

  try {
    const album = await Album.get(ALBUM_NAME);
    if (album) await album.add(asset);
    else await Album.create(ALBUM_NAME, [asset], false);
  } catch {
    // Write-only permission can't read albums — the photo is saved regardless.
  }

  return "saved";
}
