import { useState } from "react";
import {
  Pressable,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from "react-native";

import { isRtlLanguage, useLocale } from "@/i18n";
import { fontFamilies, makeStyles, useTheme } from "@/theme";

import { Icon, type IconName } from "./icon";
import { Text } from "./text";

export type InputProps = Omit<TextInputProps, "style"> & {
  label?: string;
  error?: string | null;
  hint?: string;
  icon?: IconName;
  /** Renders a show/hide toggle and starts obscured. */
  secure?: boolean;
  /** Keep the value LTR (emails, phone numbers) inside an RTL layout. */
  ltrValue?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
};

export function Input({
  label,
  error,
  hint,
  icon,
  secure = false,
  ltrValue = false,
  containerStyle,
  onFocus,
  onBlur,
  ...rest
}: InputProps) {
  const styles = useStyles();
  const theme = useTheme();
  const { language } = useLocale();
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(secure);
  const textAlign = isRtlLanguage(language) ? "right" : "left";

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <Text variant="label" color="textMuted" style={styles.label}>
          {label}
        </Text>
      ) : null}

      <View
        style={[
          styles.field,
          rest.multiline && styles.fieldMultiline,
          focused && styles.fieldFocused,
          error ? styles.fieldError : null,
        ]}
      >
        {icon ? (
          <Icon name={icon} size="sm" color="textMuted" style={styles.icon} />
        ) : null}

        <TextInput
          allowFontScaling={false}
          {...rest}
          secureTextEntry={hidden}
          placeholderTextColor={theme.colors.textMuted}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          style={[
            styles.input,
            { fontFamily: fontFamilies[language], textAlign },
            rest.multiline && styles.inputMultiline,
            ltrValue && styles.ltr,
          ]}
        />

        {secure ? (
          <Pressable
            onPress={() => setHidden((value) => !value)}
            hitSlop={theme.sizes.hitSlop}
            style={styles.trailing}
          >
            <Icon
              name={hidden ? "eye-outline" : "eye-off-outline"}
              size="sm"
              color="textMuted"
            />
          </Pressable>
        ) : null}
      </View>

      {error ? (
        <Text variant="caption" color="danger" style={styles.helper}>
          {error}
        </Text>
      ) : hint ? (
        <Text variant="caption" color="textMuted" style={styles.helper}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

const useStyles = makeStyles((theme) => ({
  container: { marginBottom: theme.spacing.lg },
  label: { marginBottom: theme.spacing.xs },
  field: {
    flexDirection: "row",
    alignItems: "center",
    height: theme.sizes.control.md,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radii.md,
    borderWidth: theme.sizes.border,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  fieldMultiline: {
    height: theme.sizes.control.lg * 2,
    alignItems: "flex-start",
    paddingVertical: theme.spacing.md,
  },
  fieldFocused: { borderColor: theme.colors.primary },
  fieldError: { borderColor: theme.colors.danger },
  icon: { marginEnd: theme.spacing.sm },
  trailing: { marginStart: theme.spacing.sm },
  input: {
    flex: 1,
    color: theme.colors.text,
    ...theme.typography.body,
    // Height is set by the wrapper; a fixed lineHeight clips descenders on Android.
    lineHeight: undefined,
    padding: 0,
  },
  inputMultiline: { height: "100%", textAlignVertical: "top" },
  // Keeps the characters in LTR order (emails, phone numbers) while the field
  // itself stays aligned with the layout.
  ltr: { writingDirection: "ltr" },
  helper: { marginTop: theme.spacing.xs },
}));
