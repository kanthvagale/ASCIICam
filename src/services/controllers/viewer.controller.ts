import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";

import {
  capturePngUri,
  deleteCaptureFiles,
  exportToPhotos,
  readCaptureAscii,
} from "@/services/captures";
import { reportError } from "@/services/crashlytics";
import { useCapturesStore } from "@/store/captures";

export function useViewerController() {
  const router = useRouter();
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const capture = useCapturesStore((s) => s.captures.find((c) => c.id === id));
  const removeCapture = useCapturesStore((s) => s.remove);

  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const exportCapture = useCallback(async () => {
    if (!capture) return;
    setIsExporting(true);
    try {
      const result = await exportToPhotos(capturePngUri(capture.id));
      Alert.alert(result === "saved" ? t("gallery.exported") : t("gallery.exportDenied"));
    } catch (error) {
      reportError(error, "viewer.export");
      Alert.alert(t("error.genericTitle"), t("error.genericBody"));
    } finally {
      setIsExporting(false);
    }
  }, [capture, t]);

  const copyAscii = useCallback(async () => {
    if (!capture) return;
    try {
      await Clipboard.setStringAsync(await readCaptureAscii(capture.id));
      Alert.alert(t("gallery.copied"));
    } catch (error) {
      reportError(error, "viewer.copy");
      Alert.alert(t("error.genericTitle"), t("error.genericBody"));
    }
  }, [capture, t]);

  const deleteCapture = useCallback(() => {
    if (!capture) return;
    setConfirmingDelete(false);
    deleteCaptureFiles(capture.id);
    removeCapture(capture.id);
    router.back();
  }, [capture, removeCapture, router]);

  return {
    capture,
    imageUri: capture ? capturePngUri(capture.id) : undefined,
    isExporting,
    confirmingDelete,
    close: () => router.back(),
    exportCapture,
    copyAscii,
    requestDelete: () => setConfirmingDelete(true),
    cancelDelete: () => setConfirmingDelete(false),
    deleteCapture,
  };
}
