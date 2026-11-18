import { Image } from "expo-image";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

export type Rect = { x: number; y: number; width: number; height: number };

const FLIGHT_MS = 380;
/** Covers the thumbnail while its new image loads, then fades. */
const LINGER_MS = 150;
const FADE_MS = 120;

export type CaptureFlyoverProps = {
  uri: string;
  from: Rect;
  to: Rect;
  fromRadius: number;
  onLanded: () => void;
  onDone: () => void;
};

export function CaptureFlyover({ uri, from, to, fromRadius, onLanded, onDone }: CaptureFlyoverProps) {
  const progress = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    progress.set(
      withTiming(1, { duration: FLIGHT_MS, easing: Easing.inOut(Easing.cubic) }, (finished) => {
        if (!finished) return;
        scheduleOnRN(onLanded);
        opacity.set(
          withDelay(
            LINGER_MS,
            withTiming(0, { duration: FADE_MS }, (faded) => {
              if (faded) scheduleOnRN(onDone);
            }),
          ),
        );
      }),
    );
  }, [onDone, onLanded, opacity, progress]);

  const style = useAnimatedStyle(() => {
    const p = progress.get();
    return {
      left: interpolate(p, [0, 1], [from.x, to.x]),
      top: interpolate(p, [0, 1], [from.y, to.y]),
      width: interpolate(p, [0, 1], [from.width, to.width]),
      height: interpolate(p, [0, 1], [from.height, to.height]),
      borderRadius: interpolate(p, [0, 1], [fromRadius, to.width / 2]),
      opacity: opacity.get(),
    };
  });

  return (
    <Animated.View pointerEvents="none" style={[styles.flyover, style]}>
      <Image source={{ uri }} style={styles.image} contentFit="cover" priority="high" />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  flyover: { position: "absolute", overflow: "hidden" },
  image: { flex: 1 },
});
