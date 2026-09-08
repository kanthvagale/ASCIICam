import { useRouter } from "expo-router";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { I18nManager, Pressable, View } from "react-native";

import { makeStyles, useTheme } from "@/theme";

import { Icon, type IconName } from "./icon";
import { Text } from "./text";

export type HeaderProps = {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  right?: ReactNode;
};

export function Header({
  title,
  subtitle,
  showBack = false,
  onBack,
  right,
}: HeaderProps) {
  const styles = useStyles();
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();

  // Back arrows mirror: in RTL, "back" points to the right of the screen.
  const backIcon: IconName = I18nManager.isRTL ? "arrow-forward" : "arrow-back";

  return (
    <View style={styles.row}>
      <View style={styles.side}>
        {showBack ? (
          <Pressable
            onPress={onBack ?? (() => router.back())}
            hitSlop={theme.sizes.hitSlop}
            accessibilityRole="button"
            accessibilityLabel={t("a11y.back")}
          >
            <Icon name={backIcon} size="md" color="text" />
          </Pressable>
        ) : null}
      </View>

      <View style={styles.center}>
        {title ? (
          <Text variant="h3" align="center" numberOfLines={1}>
            {title}
          </Text>
        ) : null}
        {subtitle ? (
          <Text
            variant="caption"
            color="textMuted"
            align="center"
            numberOfLines={1}
          >
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
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  side: { minWidth: theme.sizes.icon.lg, justifyContent: "center" },
  end: { alignItems: "flex-end" },
  center: { flex: 1, alignItems: "center" },
}));
