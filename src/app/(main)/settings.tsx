import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Screen } from "@/components/screen";
import { Divider, ListItem, PillGroup, Section, Text, ToggleRow } from "@/components/ui";
import { useSettingsController } from "@/services/controllers";
import type { CameraPosition } from "@/store/settings";
import { makeStyles, type ThemeMode } from "@/theme";

export default function SettingsScreen() {
  const styles = useStyles();
  const { t } = useTranslation();
  const vm = useSettingsController();

  const themeOptions: { value: ThemeMode; label: string }[] = [
    { value: "light", label: t("settings.themeLight") },
    { value: "dark", label: t("settings.themeDark") },
    { value: "system", label: t("settings.themeSystem") },
  ];
  const cameraOptions: { value: CameraPosition; label: string }[] = [
    { value: "back", label: t("settings.cameraBack") },
    { value: "front", label: t("settings.cameraFront") },
  ];

  return (
    <Screen title={t("settings.title")}>
      <ScrollView contentContainerStyle={styles.content}>
        <Section title={t("settings.appearance")}>
          <PillGroup options={themeOptions} value={vm.themeMode} onChange={vm.setThemeMode} />
        </Section>

        <Section title={t("settings.camera")}>
          <Text variant="small" color="textMuted">
            {t("settings.defaultCamera")}
          </Text>
          <PillGroup
            options={cameraOptions}
            value={vm.settings.defaultCamera}
            onChange={(value) => vm.setSetting("defaultCamera", value)}
          />
        </Section>

        <Section card>
          <ToggleRow
            title={t("settings.mirrorFront")}
            icon="swap-horizontal-outline"
            value={vm.settings.mirrorFront}
            onChange={(value) => vm.setSetting("mirrorFront", value)}
          />
          <Divider inset />
          <ToggleRow
            title={t("settings.showFps")}
            icon="speedometer-outline"
            value={vm.settings.showFps}
            onChange={(value) => vm.setSetting("showFps", value)}
          />
        </Section>

        <Section title={t("settings.capture")} card>
          <ToggleRow
            title={t("settings.autoSave")}
            subtitle={t("settings.autoSaveHint")}
            icon="download-outline"
            value={vm.settings.autoSaveToPhotos}
            onChange={(value) => vm.setSetting("autoSaveToPhotos", value)}
          />
          <Divider inset />
          <ToggleRow
            title={t("settings.haptics")}
            icon="pulse-outline"
            value={vm.settings.haptics}
            onChange={(value) => vm.setSetting("haptics", value)}
          />
        </Section>

        <Section title={t("settings.storage")} card>
          <ListItem
            title={t("settings.captureCount", { count: vm.captureCount })}
            icon="images-outline"
          />
          <Divider inset />
          <ListItem
            title={t("settings.resetOptions")}
            icon="refresh"
            onPress={vm.resetOptions}
            showChevron={false}
          />
          <Divider inset />
          <ListItem
            title={t("settings.clearGallery")}
            icon="trash-outline"
            destructive
            onPress={vm.captureCount > 0 ? vm.requestClear : undefined}
            showChevron={false}
          />
        </Section>

        <Section title={t("settings.about")} card>
          <ListItem
            title={t("settings.version")}
            icon="information-circle-outline"
            right={
              <Text mono variant="small" color="textMuted">
                {vm.version}
              </Text>
            }
          />
          {vm.openLicenses ? (
            <View>
              <Divider inset />
              <ListItem title={t("settings.licenses")} icon="document-text-outline" onPress={vm.openLicenses} />
            </View>
          ) : null}
          {vm.openFeedback ? (
            <View>
              <Divider inset />
              <ListItem title={t("settings.feedback")} icon="chatbubble-outline" onPress={vm.openFeedback} />
            </View>
          ) : null}
        </Section>
      </ScrollView>

      <ConfirmModal
        visible={vm.confirmingClear}
        title={t("settings.clearTitle")}
        body={t("settings.clearBody")}
        confirmLabel={t("settings.clearGallery")}
        destructive
        onConfirm={vm.clearGallery}
        onCancel={vm.cancelClear}
      />
    </Screen>
  );
}

const useStyles = makeStyles((theme) => ({
  content: { padding: theme.spacing.lg, gap: theme.spacing.xl, paddingBottom: theme.spacing.xxxl },
}));
