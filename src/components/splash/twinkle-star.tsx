import { useEffect } from "react";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

const STAR_PATH =
  "M12 0C12.8 7.2 16.8 11.2 24 12C16.8 12.8 12.8 16.8 12 24C11.2 16.8 7.2 12.8 0 12C7.2 11.2 11.2 7.2 12 0Z";

export type TwinkleStarProps = {
  size: number;
  color: string;
  delay: number;
};

export function TwinkleStar({ size, color, delay }: TwinkleStarProps) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const rotate = useSharedValue(-45);

  useEffect(() => {
    const t = (to: number, duration: number) =>
      withTiming(to, { duration, easing: Easing.inOut(Easing.quad) });

    scale.value = withDelay(
      delay,
      withSequence(t(1.25, 260), t(0.75, 200), t(1.1, 200), t(0.85, 200), t(1, 220)),
    );
    opacity.value = withDelay(
      delay,
      withSequence(t(1, 200), t(0.35, 200), t(1, 200), t(0.5, 200), t(1, 280)),
    );
    rotate.value = withDelay(
      delay,
      withTiming(45, { duration: 1080, easing: Easing.out(Easing.cubic) }),
    );
  }, [delay, opacity, rotate, scale]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }, { rotate: `${rotate.value}deg` }],
  }));

  return (
    <Animated.View style={style}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path d={STAR_PATH} fill={color} />
      </Svg>
    </Animated.View>
  );
}
