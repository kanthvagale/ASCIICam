import { useRef, useState } from "react";
import {
  Pressable,
  TextInput,
  View,
  type NativeSyntheticEvent,
  type TextInputKeyPressEventData,
} from "react-native";

import { makeStyles } from "@/theme";

import { Text } from "./text";

export type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  autoFocus?: boolean;
  hasError?: boolean;
};

/**
 * Boxed one-time-code field.
 *
 * A single hidden TextInput holds the value and the boxes are just a display —
 * that keeps paste, autofill and backspace behaving natively, and the boxes are
 * laid out LTR in both directions because digit order never mirrors.
 */
export function OtpInput({
  value,
  onChange,
  length = 6,
  autoFocus = true,
  hasError = false,
}: OtpInputProps) {
  const styles = useStyles();
  const inputRef = useRef<TextInput>(null);
  const [focused, setFocused] = useState(false);

  const digits = Array.from({ length }, (_, index) => value[index] ?? "");
  const activeIndex = Math.min(value.length, length - 1);

  const handleChange = (next: string) => {
    onChange(next.replace(/\D/g, "").slice(0, length));
  };

  const handleKeyPress = (
    event: NativeSyntheticEvent<TextInputKeyPressEventData>
  ) => {
    if (event.nativeEvent.key === "Backspace" && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <Pressable onPress={() => inputRef.current?.focus()} style={styles.wrap}>
      {digits.map((digit, index) => (
        <View
          key={index}
          style={[
            styles.box,
            focused && index === activeIndex && styles.boxActive,
            hasError && styles.boxError,
          ]}
        >
          <Text variant="h2" align="center" forceLtr>
            {digit}
          </Text>
        </View>
      ))}

      <TextInput
        ref={inputRef}
        allowFontScaling={false}
        value={value}
        onChangeText={handleChange}
        onKeyPress={handleKeyPress}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoFocus={autoFocus}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="one-time-code"
        maxLength={length}
        style={styles.hidden}
      />
    </Pressable>
  );
}

const useStyles = makeStyles((theme) => ({
  wrap: {
    flexDirection: "row",
    direction: "ltr",
    justifyContent: "center",
    gap: theme.spacing.sm,
  },
  box: {
    flex: 1,
    maxWidth: theme.sizes.avatar.md,
    height: theme.sizes.control.lg,
    borderRadius: theme.radii.md,
    borderWidth: theme.sizes.border,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  boxActive: { borderColor: theme.colors.primary },
  boxError: { borderColor: theme.colors.danger },
  hidden: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
  },
}));
