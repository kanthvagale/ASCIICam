import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, useWindowDimensions, View } from "react-native";

import { AsciiOptionsForm, AsciiRenderer } from "@/components/ascii";
import { EmptyState } from "@/components/empty-state";
import { Screen } from "@/components/screen";
import { Button, Loader } from "@/components/ui";
import { MONO_CHAR_ASPECT } from "@/constants/ascii";
import { useUploadController } from "@/services/controllers";
import { makeStyles, useTheme } from "@/theme";

export default function UploadScreen() {
  const styles = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  const { width, height } = useWindowDimensions();
  const previewRef = useRef<View>(null);
  const vm = useUploadController(previewRef);

  if (!vm.hasImage) {
    return (
      <Screen title={t("upload.title")}>
        <EmptyState
          icon="image-outline"
          title={t("upload.emptyTitle")}
          body={t("upload.emptyBody")}
          actionLabel={t("upload.pick")}
          onAction={() => void vm.pickImage()}
        />
      </Screen>
    );
  }

  // Frame takes the grid's shape at full width, capped at half the screen
  // for tall images (the renderer then fits by height instead).
  const maxWidth = width - theme.spacing.lg * 2;
  const maxHeight = height * 0.5;
  const previewHeight = vm.grid
    ? Math.min((maxWidth * vm.grid.rows) / (vm.grid.columns * MONO_CHAR_ASPECT), maxHeight)
    : maxHeight * 0.6;

  return (
    <Screen title={t("upload.title")}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.preview, { height: previewHeight, backgroundColor: vm.options.background }]}>
          {/* Nothing to size until the first conversion lands. */}
          {vm.grid ? (
            <AsciiRenderer
              ref={previewRef}
              text={vm.ascii}
              columns={vm.grid.columns}
              rows={vm.grid.rows}
              color={vm.options.foreground}
              background={vm.options.background}
            />
          ) : null}
          {vm.isConverting ? <Loader style={styles.loader} /> : null}
        </View>

        <View style={styles.actions}>
          <Button
            label={t("upload.pickAnother")}
            variant="secondary"
            icon="images-outline"
            fullWidth={false}
            style={styles.action}
            onPress={() => void vm.pickImage()}
          />
          <Button
            label={
              vm.isSaving ? t("common.saving") : vm.isSaved ? t("upload.saved") : t("common.save")
            }
            icon={vm.isSaved ? "checkmark-done" : "checkmark"}
            fullWidth={false}
            style={styles.action}
            loading={vm.isSaving}
            disabled={!vm.grid || vm.isConverting || vm.isSaved}
            onPress={() => void vm.save()}
          />
        </View>

        <AsciiOptionsForm value={vm.options} onChange={vm.setOptions} compact />
      </ScrollView>
    </Screen>
  );
}

const useStyles = makeStyles((theme) => ({
  content: { padding: theme.spacing.lg, gap: theme.spacing.xl, paddingBottom: theme.spacing.xxxl },
  preview: { borderRadius: theme.radii.md, overflow: "hidden" },
  loader: { position: "absolute", top: 0, bottom: 0, start: 0, end: 0, backgroundColor: "rgba(0, 0, 0, 0.35)" },
  actions: { flexDirection: "row", gap: theme.spacing.sm },
  action: { flex: 1 },
}));
