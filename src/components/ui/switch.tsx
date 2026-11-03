import { useEffect } from "react";
import { Pressable, type StyleProp, type ViewStyle } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { makeStyles, useTheme } from "@/theme";

export type SwitchProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

export function Switch({ value, onValueChange, disabled = false, accessibilityLabel, style }: SwitchProps) {
  const styles = useStyles();
  const theme = useTheme();
  const { width, height, inset } = theme.sizes.switch;
  const travel = width - height;

  const progress = useSharedValue(value ? 1 : 0);
  const pressed = useSharedValue(0);

  useEffect(() => {
    progress.set(withSpring(value ? 1 : 0, { damping: 18, stiffness: 260, mass: 0.6 }));
  }, [progress, value]);

  const offColor = theme.colors.border;
  const onColor = theme.colors.text;

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.get(), [0, 1], [offColor, onColor]),
  }));

  const thumbStyle = useAnimatedStyle(() => ({
    width: height - inset * 2 + pressed.get() * inset * 2,
    transform: [{ translateX: progress.get() * (travel - pressed.get() * inset * 2) }],
  }));

  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      onPressIn={() => pressed.set(withTiming(1, { duration: 120 }))}
      onPressOut={() => pressed.set(withTiming(0, { duration: 160 }))}
      disabled={disabled}
      hitSlop={theme.sizes.hitSlop}
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: value, disabled }}
      style={[disabled && styles.disabled, style]}
    >
      <Animated.View style={[styles.track, trackStyle]}>
        <Animated.View style={[styles.thumb, thumbStyle]} />
      </Animated.View>
    </Pressable>
  );
}

const useStyles = makeStyles((theme) => ({
  track: {
    width: theme.sizes.switch.width,
    height: theme.sizes.switch.height,
    borderRadius: theme.radii.pill,
    padding: theme.sizes.switch.inset,
    justifyContent: "center",
  },
  thumb: {
    height: theme.sizes.switch.height - theme.sizes.switch.inset * 2,
    borderRadius: theme.radii.pill,
    backgroundColor: theme.colors.background,
    ...theme.shadows.sm,
  },
  disabled: { opacity: 0.4 },
}));
