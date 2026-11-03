import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { PillGroup, Section, SwatchRow, ToggleRow } from "@/components/ui";
import {
  BACKGROUND_PRESETS,
  FOREGROUND_PRESETS,
  RESOLUTION_PRESETS,
} from "@/constants/ascii";
import { CHARSET_IDS } from "@/lib/ascii";
import type { AsciiOptions } from "@/store/camera-options";
import { makeStyles } from "@/theme";

export type AsciiOptionsFormProps = {
  value: AsciiOptions;
  onChange: (patch: Partial<AsciiOptions>) => void;
  /** Upload screen: hide hints and the background row to stay compact. */
  compact?: boolean;
};

/** The ASCII controls shared by the Options and Upload screens. */
export function AsciiOptionsForm({ value, onChange, compact = false }: AsciiOptionsFormProps) {
  const styles = useStyles();
  const { t } = useTranslation();

  const resolutionOptions = RESOLUTION_PRESETS.map((width) => ({
    value: width,
    label: String(width),
  }));
  const charsetOptions = CHARSET_IDS.map((id) => ({
    value: id,
    label: t(`options.charsets.${id}`),
  }));

  return (
    <View style={styles.form}>
      <Section title={t("options.resolution")} hint={compact ? undefined : t("options.resolutionHint")}>
        <PillGroup
          options={resolutionOptions}
          value={value.resWidth}
          onChange={(resWidth) => onChange({ resWidth })}
          scrollable={compact}
        />
      </Section>

      <Section title={t("options.charset")}>
        <PillGroup
          options={charsetOptions}
          value={value.charsetId}
          onChange={(charsetId) => onChange({ charsetId })}
          scrollable={compact}
        />
      </Section>

      <Section title={t("options.foreground")}>
        <SwatchRow
          swatches={FOREGROUND_PRESETS}
          value={value.foreground}
          onChange={(foreground) => onChange({ foreground })}
        />
      </Section>

      {compact ? null : (
        <Section title={t("options.background")}>
          <SwatchRow
            swatches={BACKGROUND_PRESETS}
            value={value.background}
            onChange={(background) => onChange({ background })}
          />
        </Section>
      )}

      <Section card>
        <ToggleRow
          title={t("options.invert")}
          subtitle={compact ? undefined : t("options.invertHint")}
          icon="contrast-outline"
          value={value.invert}
          onChange={(invert) => onChange({ invert })}
        />
      </Section>
    </View>
  );
}

const useStyles = makeStyles((theme) => ({
  form: { gap: theme.spacing.xl },
}));
