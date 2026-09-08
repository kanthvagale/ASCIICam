import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { makeStyles } from "@/theme";

import { BottomSheetModal } from "./bottom-sheet-modal";

export type ConfirmModalProps = {
  visible: boolean;
  title: string;
  body?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmModal({
  visible,
  title,
  body,
  confirmLabel,
  cancelLabel,
  destructive = false,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const styles = useStyles();
  const { t } = useTranslation();

  return (
    <BottomSheetModal visible={visible} onClose={onCancel} title={title}>
      {body ? (
        <Text variant="body" color="textMuted" align="center">
          {body}
        </Text>
      ) : null}

      <View style={styles.actions}>
        <Button
          label={confirmLabel ?? t("common.confirm")}
          variant={destructive ? "danger" : "primary"}
          loading={loading}
          onPress={onConfirm}
        />
        <Button
          label={cancelLabel ?? t("common.cancel")}
          variant="ghost"
          disabled={loading}
          onPress={onCancel}
        />
      </View>
    </BottomSheetModal>
  );
}

const useStyles = makeStyles((theme) => ({
  actions: { marginTop: theme.spacing.md, gap: theme.spacing.sm },
}));
