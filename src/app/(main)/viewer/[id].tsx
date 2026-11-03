import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button, IconButton, Text } from "@/components/ui";
import { useViewerController } from "@/services/controllers";
import { makeStyles } from "@/theme";

export default function ViewerScreen() {
  const styles = useStyles();
  const { t } = useTranslation();
  const vm = useViewerController();

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="light" />

      <View style={styles.top}>
        <IconButton icon="close" tint="#FFFFFF" filled onPress={vm.close} accessibilityLabel={t("a11y.back")} />
        {vm.capture ? (
          <Text mono variant="caption" style={styles.meta}>
            {`${vm.capture.columns}×${vm.capture.rows} · ${new Date(vm.capture.createdAt).toLocaleString()}`}
          </Text>
        ) : null}
        <IconButton
          icon="trash-outline"
          tint="#FFFFFF"
          filled
          disabled={!vm.capture}
          onPress={vm.requestDelete}
          accessibilityLabel={t("common.delete")}
        />
      </View>

      {vm.imageUri ? (
        <Image source={{ uri: vm.imageUri }} style={styles.image} contentFit="contain" />
      ) : (
        <View style={styles.image} />
      )}

      <View style={styles.actions}>
        <Button
          label={t("gallery.export")}
          icon="download-outline"
          loading={vm.isExporting}
          disabled={!vm.capture}
          onPress={() => void vm.exportCapture()}
        />
        <Button
          label={t("gallery.copyText")}
          icon="copy-outline"
          variant="secondary"
          disabled={!vm.capture}
          onPress={() => void vm.copyAscii()}
        />
      </View>

      <ConfirmModal
        visible={vm.confirmingDelete}
        title={t("gallery.deleteTitle")}
        body={t("gallery.deleteBody")}
        confirmLabel={t("common.delete")}
        destructive
        onConfirm={vm.deleteCapture}
        onCancel={vm.cancelDelete}
      />
    </SafeAreaView>
  );
}

const useStyles = makeStyles((theme) => ({
  root: { flex: 1, backgroundColor: "#000000" },
  top: {
    height: theme.sizes.header,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.lg,
  },
  meta: { color: "rgba(255, 255, 255, 0.7)" },
  image: { flex: 1 },
  actions: { padding: theme.spacing.lg, gap: theme.spacing.sm },
}));
