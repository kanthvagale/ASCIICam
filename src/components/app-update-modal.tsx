import { useTranslation } from "react-i18next";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { useAppUpdateController } from "@/services/controllers";

/** Offers a Play update, then a restart once it has downloaded. */
export function AppUpdateModal({ enabled }: { enabled: boolean }) {
  const { t } = useTranslation();
  const vm = useAppUpdateController();
  const ready = vm.prompt === "ready";

  return (
    <ConfirmModal
      visible={enabled && vm.prompt !== null}
      title={t(ready ? "update.readyTitle" : "update.availableTitle")}
      body={t(ready ? "update.readyBody" : "update.availableBody")}
      confirmLabel={t(ready ? "update.restart" : "update.update")}
      cancelLabel={t("update.later")}
      onConfirm={ready ? vm.restart : vm.update}
      onCancel={vm.later}
    />
  );
}
