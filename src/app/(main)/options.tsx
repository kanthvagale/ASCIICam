import { useTranslation } from "react-i18next";
import { ScrollView, useWindowDimensions, View } from "react-native";

import { AsciiOptionsForm, AsciiRenderer } from "@/components/ascii";
import { Screen } from "@/components/screen";
import { Button, Section } from "@/components/ui";
import { MONO_CHAR_ASPECT } from "@/constants/ascii";
import { useOptionsController } from "@/services/controllers";
import { makeStyles, useTheme } from "@/theme";

export default function OptionsScreen() {
  const styles = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const vm = useOptionsController();

  const previewWidth = width - theme.spacing.lg * 2;
  const previewHeight = (previewWidth * vm.previewRows) / (vm.previewColumns * MONO_CHAR_ASPECT);

  return (
    <Screen title={t("options.title")}>
      <ScrollView contentContainerStyle={styles.content}>
        <Section title={t("options.preview")}>
          <View style={[styles.preview, { height: previewHeight }]}>
            <AsciiRenderer
              text={vm.preview}
              columns={vm.previewColumns}
              rows={vm.previewRows}
              color={vm.options.foreground}
              background={vm.options.background}
            />
          </View>
        </Section>

        <AsciiOptionsForm value={vm.options} onChange={vm.setOptions} />

        <Button label={t("options.reset")} variant="ghost" icon="refresh" onPress={vm.resetOptions} />
      </ScrollView>
    </Screen>
  );
}

const useStyles = makeStyles((theme) => ({
  content: { padding: theme.spacing.lg, gap: theme.spacing.xl, paddingBottom: theme.spacing.xxxl },
  preview: {
    borderRadius: theme.radii.lg,
    overflow: "hidden",
    borderWidth: theme.sizes.border,
    borderColor: theme.colors.border,
  },
}));
