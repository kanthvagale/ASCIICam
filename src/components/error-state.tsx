import { useTranslation } from "react-i18next";
import type { StyleProp, ViewStyle } from "react-native";

import { EmptyState } from "./empty-state";
import type { IconName } from "./ui/icon";

export type ErrorStateProps = {
  title?: string;
  body?: string;
  icon?: IconName;
  onRetry?: () => void;
  retryLabel?: string;
  style?: StyleProp<ViewStyle>;
};

export function ErrorState({
  title,
  body,
  icon = "alert-circle-outline",
  onRetry,
  retryLabel,
  style,
}: ErrorStateProps) {
  const { t } = useTranslation();

  return (
    <EmptyState
      icon={icon}
      title={title ?? t("error.genericTitle")}
      body={body ?? t("error.genericBody")}
      actionLabel={onRetry ? (retryLabel ?? t("common.retry")) : undefined}
      onAction={onRetry}
      style={style}
    />
  );
}
