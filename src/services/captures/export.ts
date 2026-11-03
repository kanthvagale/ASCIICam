import { Album, Asset, requestPermissionsAsync } from "expo-media-library";

const ALBUM_NAME = "ASCIICam";

export type ExportResult = "saved" | "denied";

export async function exportToPhotos(pngUri: string): Promise<ExportResult> {
  const { granted } = await requestPermissionsAsync(true);
  if (!granted) return "denied";

  const asset = await Asset.create(pngUri);

  try {
    const album = await Album.get(ALBUM_NAME);
    if (album) await album.add(asset);
    else await Album.create(ALBUM_NAME, [asset], false);
  } catch {
    // Write-only access can't read albums; the photo is still saved.
  }

  return "saved";
}
