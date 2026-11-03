import { StatusBar } from "expo-status-bar";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";

import { EmptyState } from "@/components/empty-state";
import { useNotFoundController } from "@/services/controllers";
import { makeStyles, useTheme } from "@/theme";

export default function NotFoundScreen() {
  const styles = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  const { goHome } = useNotFoundController();

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style={theme.isDark ? "light" : "dark"} />
      <EmptyState
        icon="help-circle-outline"
        title={t("error.notFoundTitle")}
        body={t("error.notFoundBody")}
        actionLabel={t("common.goHome")}
        onAction={goHome}
      />
    </SafeAreaView>
  );
}

const useStyles = makeStyles((theme) => ({
  root: { flex: 1, backgroundColor: theme.colors.background },
}));
