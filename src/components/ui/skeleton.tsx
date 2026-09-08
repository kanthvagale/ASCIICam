import { useEffect } from "react";
import type { DimensionValue, StyleProp, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { makeStyles } from "@/theme";

export type SkeletonProps = {
  width?: DimensionValue;
  height?: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
};

/** Pulsing placeholder block for loading lists. */
export function Skeleton({ width = "100%", height = 16, radius, style }: SkeletonProps) {
  const styles = useStyles();
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 800 }), -1, true);
  }, [opacity]);

  const animated = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        styles.block,
        { width, height, borderRadius: radius ?? height / 2 },
        animated,
        style,
      ]}
    />
  );
}

const useStyles = makeStyles((theme) => ({
  block: { backgroundColor: theme.colors.skeleton },
}));
