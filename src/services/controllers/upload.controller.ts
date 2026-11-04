import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { type RefObject, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";
import { useSharedValue } from "react-native-reanimated";

import type { AsciiRendererHandle } from "@/components/ascii";
import { RESOLUTION_PRESETS } from "@/constants/ascii";
import { getCharset, imageToAscii } from "@/lib/ascii";
import { saveCapture } from "@/services/captures";
import { reportError } from "@/services/crashlytics";
import { type AsciiOptions, useAsciiCamOptionsStore } from "@/store/camera-options";
import { useCapturesStore } from "@/store/captures";
import { useSettingsStore } from "@/store/settings";

export function useUploadController(previewRef: RefObject<AsciiRendererHandle | null>) {
  const { t } = useTranslation();
  const addCapture = useCapturesStore((s) => s.add);
  const haptics = useSettingsStore((s) => s.haptics);

  const [options, setOptionsState] = useState<AsciiOptions>(() => {
    const { charsetId, foreground, background, invert } = useAsciiCamOptionsStore.getState();
    return { resWidth: RESOLUTION_PRESETS[0], charsetId, foreground, background, invert };
  });
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [grid, setGrid] = useState<{ columns: number; rows: number } | null>(null);
  const [convertedKey, setConvertedKey] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const ascii = useSharedValue("");

  const { resWidth, charsetId, invert } = options;
  // Colours don't change the characters.
  const inputKey = imageUri ? `${imageUri}|${resWidth}|${charsetId}|${invert}` : null;
  const isConverting = inputKey !== null && inputKey !== convertedKey;
  const lookKey = inputKey ? `${inputKey}|${options.foreground}|${options.background}` : null;
  const isSaved = lookKey !== null && lookKey === savedKey;

  useEffect(() => {
    if (!imageUri || !inputKey) return;
    let cancelled = false;

    imageToAscii(imageUri, { columns: resWidth, chars: getCharset(charsetId), invert })
      .then((result) => {
        if (cancelled) return;
        ascii.value = result.text;
        setGrid({ columns: result.columns, rows: result.rows });
      })
      .catch((error: unknown) => {
        reportError(error, "upload.convert");
        if (!cancelled) Alert.alert(t("upload.failed"));
      })
      .finally(() => {
        if (!cancelled) setConvertedKey(inputKey);
      });

    return () => {
      cancelled = true;
    };
  }, [ascii, charsetId, imageUri, inputKey, invert, resWidth, t]);

  const pickImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
    });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  }, []);

  const save = useCallback(async () => {
    if (!grid || isSaving || isSaved) return;
    setIsSaving(true);
    try {
      const renderer = previewRef.current;
      if (!renderer) return;
      const tmpPngUri = await renderer.capturePng();
      const saved = await saveCapture({
        tmpPngUri,
        ascii: ascii.value,
        source: "upload",
        columns: grid.columns,
        rows: grid.rows,
        charsetId: options.charsetId,
        foreground: options.foreground,
        background: options.background,
        invert: options.invert,
      });
      addCapture(saved);
      if (haptics) void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setSavedKey(lookKey);
    } catch (error) {
      reportError(error, "upload.save");
      Alert.alert(t("error.genericTitle"), t("error.genericBody"));
    } finally {
      setIsSaving(false);
    }
  }, [addCapture, ascii, grid, haptics, isSaved, isSaving, lookKey, options, previewRef, t]);

  const copyText = useCallback(async () => {
    try {
      await Clipboard.setStringAsync(ascii.value);
      Alert.alert(t("gallery.copied"));
    } catch (error) {
      reportError(error, "upload.copy");
      Alert.alert(t("error.genericTitle"), t("error.genericBody"));
    }
  }, [ascii, t]);

  return {
    ascii,
    options,
    setOptions: (patch: Partial<AsciiOptions>) => setOptionsState((prev) => ({ ...prev, ...patch })),
    hasImage: imageUri !== null,
    grid,
    isConverting,
    isSaving,
    isSaved,
    pickImage,
    save,
    copyText,
  };
}
