import { useTranslation } from "react-i18next";
import { Image, View } from "react-native";

import { Text } from "@/components/ui";
import { makeStyles, useTheme } from "@/theme";

const LOGO_WIDTH = 120;
// Source logo is 1588×394.
const LOGO_HEIGHT = (LOGO_WIDTH * 394) / 1588;

/** Brand footer. The dark parts of the logo follow the theme's text colour; the accent keeps its orange. */
export function MadeBy() {
  const styles = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.wrap} accessible accessibilityLabel={`${t("settings.madeBy")} happitite`}>
      <Text variant="small" color="textMuted">
        {t("settings.madeBy")}
      </Text>
      <View style={styles.logo}>
        <Image
          source={require("@/assets/images/brand/happitite-ink.png")}
          style={[styles.layer, { tintColor: theme.colors.text }]}
        />
        <Image source={require("@/assets/images/brand/happitite-accent.png")} style={styles.layer} />
      </View>
    </View>
  );
}

const useStyles = makeStyles((theme) => ({
  wrap: { alignItems: "center", gap: theme.spacing.sm, paddingTop: theme.spacing.lg },
  logo: { width: LOGO_WIDTH, height: LOGO_HEIGHT },
  layer: { position: "absolute", width: LOGO_WIDTH, height: LOGO_HEIGHT, resizeMode: "contain" },
}));
