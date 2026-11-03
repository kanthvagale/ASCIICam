import { Pressable, View } from "react-native";

import { makeStyles } from "@/theme";

export type ShutterButtonProps = {
  onPress: () => void;
  /** Touch-down — for haptics, so feedback lands before `onPress`. */
  onPressIn?: () => void;
  disabled?: boolean;
  accessibilityLabel: string;
};

export function ShutterButton({ onPress, onPressIn, disabled = false, accessibilityLabel }: ShutterButtonProps) {
  const styles = useStyles();

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={styles.ring}
    >
      {({ pressed }) => (
        <View style={[styles.core, (pressed || disabled) && styles.corePressed]} />
      )}
    </Pressable>
  );
}

const useStyles = makeStyles((theme) => ({
  ring: {
    width: theme.sizes.shutter,
    height: theme.sizes.shutter,
    borderRadius: theme.radii.pill,
    borderWidth: 4,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  core: {
    width: theme.sizes.shutter - 16,
    height: theme.sizes.shutter - 16,
    borderRadius: theme.radii.pill,
    backgroundColor: "#FFFFFF",
  },
  corePressed: { transform: [{ scale: 0.88 }], opacity: 0.8 },
}));
