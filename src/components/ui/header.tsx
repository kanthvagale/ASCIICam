import { useRouter } from "expo-router";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { makeStyles } from "@/theme";

import { IconButton } from "./icon-button";
import { Text } from "./text";

export type HeaderProps = {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  right?: ReactNode;
};

export function Header({ title, subtitle, showBack = false, onBack, right }: HeaderProps) {
  const styles = useStyles();
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <View style={styles.row}>
      <View style={styles.side}>
        {showBack ? (
          <IconButton
            icon="chevron-back"
            onPress={onBack ?? (() => router.back())}
            accessibilityLabel={t("a11y.back")}
          />
        ) : null}
      </View>

      <View style={styles.center}>
        {title ? (
          <Text variant="h3" align="center" numberOfLines={1}>
            {title}
          </Text>
        ) : null}
        {subtitle ? (
          <Text variant="caption" color="textMuted" align="center" numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      <View style={[styles.side, styles.end]}>{right}</View>
    </View>
  );
}

const useStyles = makeStyles((theme) => ({
  row: {
    height: theme.sizes.header,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  side: {
    width: theme.sizes.control.md,
    flexDirection: "row",
    alignItems: "center",
  },
  end: { justifyContent: "flex-end" },
  center: { flex: 1, alignItems: "center" },
}));
