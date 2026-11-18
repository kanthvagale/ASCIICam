import * as Haptics from "expo-haptics";
import { type PropsWithChildren, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { type AccessibilityActionEvent, View } from "react-native";
import { Gesture, GestureDetector, type PanGestureHandlerEventPayload } from "react-native-gesture-handler";
import Animated, {
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

import { Icon } from "@/components/ui";
import { makeStyles } from "@/theme";

const TRACK_HEIGHT = 180;
const THUMB_SIZE = 32;
const IDLE_OPACITY = 0.45;
const FADE_MS = 250;
/** Dragging this far over the preview sweeps the whole range; gentler than the bar. */
const PREVIEW_SWEEP = 360;

export type ExposureRange = {
  min: number;
  max: number;
  /** Smallest change the camera accepts (whole steps on Android). */
  step: number;
};

export type ExposureControlProps = PropsWithChildren<{
  exposure: SharedValue<number>;
  range: ExposureRange | null;
  haptics: boolean;
  /** Changing it re-syncs the thumb with the camera's exposure (e.g. after a flip). */
  resetKey: string;
}>;

function clamp(value: number, min: number, max: number) {
  "worklet";
  return Math.min(max, Math.max(min, value));
}

/** Control position (-1…1, up is brighter) to a camera exposure value on the range's steps. */
function toExposure(position: number, { min, max, step }: ExposureRange) {
  "worklet";
  const raw = position >= 0 ? position * max : position * -min;
  return clamp(Math.round(raw / step) * step, min, max);
}

function toPosition(value: number, { min, max }: ExposureRange) {
  if (value > 0) return max > 0 ? Math.min(1, value / max) : 0;
  if (value < 0) return min < 0 ? Math.max(-1, value / -min) : 0;
  return 0;
}

function tick() {
  void Haptics.selectionAsync();
}

export function ExposureControl({ exposure, range, haptics, resetKey, children }: ExposureControlProps) {
  const styles = useStyles();
  const { t } = useTranslation();
  const position = useSharedValue(0);
  const dragFrom = useSharedValue(0);
  const dragOrigin = useSharedValue(0);
  const active = useSharedValue(0);
  const rest = useSharedValue(0);

  // On mount and camera change, put the thumb where the camera's exposure already is.
  useEffect(() => {
    const value = exposure.get();
    position.set(range ? toPosition(value, range) : 0);
    rest.set(value === 0 ? 0 : IDLE_OPACITY);
  }, [exposure, position, range, resetKey, rest]);

  const sliderStyle = useAnimatedStyle(() => ({
    opacity: rest.get() + (1 - rest.get()) * active.get(),
  }));
  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: (-position.get() * TRACK_HEIGHT) / 2 }],
  }));

  if (!range) return <View style={styles.fill}>{children}</View>;

  const commit = (next: number) => {
    "worklet";
    const value = toExposure(next, range);
    const previous = exposure.get();
    if (value === previous) return;
    if (haptics && (value === 0 || Math.sign(value) !== Math.sign(previous))) scheduleOnRN(tick);
    if ((value === 0) !== (previous === 0)) rest.set(withTiming(value === 0 ? 0 : IDLE_OPACITY, { duration: FADE_MS }));
    exposure.set(value);
  };

  // Measured from where the gesture activated, so the activation slop doesn't cause a jump.
  const startDrag = (event: PanGestureHandlerEventPayload) => {
    "worklet";
    dragFrom.set(position.get());
    dragOrigin.set(event.translationY);
    active.set(withTiming(1, { duration: 120 }));
  };
  const dragBy = (event: PanGestureHandlerEventPayload, sweep: number) => {
    "worklet";
    const next = clamp(dragFrom.get() - (event.translationY - dragOrigin.get()) / (sweep / 2), -1, 1);
    position.set(next);
    commit(next);
  };
  const endDrag = () => {
    "worklet";
    active.set(withTiming(0, { duration: 400 }));
  };

  const sliderPan = Gesture.Pan()
    .onStart(startDrag)
    .onUpdate((event) => dragBy(event, TRACK_HEIGHT))
    .onFinalize(endDrag);
  const sliderReset = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      position.set(withTiming(0, { duration: 180 }));
      commit(0);
    });

  const previewPan = Gesture.Pan()
    .activeOffsetY([-12, 12])
    .failOffsetX([-24, 24])
    .requireExternalGestureToFail(sliderPan, sliderReset)
    .onStart(startDrag)
    .onUpdate((event) => dragBy(event, PREVIEW_SWEEP))
    .onFinalize(endDrag);

  const onAccessibilityAction = ({ nativeEvent }: AccessibilityActionEvent) => {
    const delta = nativeEvent.actionName === "increment" ? 0.1 : nativeEvent.actionName === "decrement" ? -0.1 : 0;
    if (delta === 0) return;
    const next = clamp(position.get() + delta, -1, 1);
    position.set(next);
    commit(next);
  };

  return (
    <GestureDetector gesture={previewPan}>
      <View style={styles.fill}>
        {children}
        <GestureDetector gesture={Gesture.Race(sliderPan, sliderReset)}>
          <Animated.View
            style={[styles.slider, sliderStyle]}
            accessible
            accessibilityRole="adjustable"
            accessibilityLabel={t("a11y.exposure")}
            accessibilityHint={t("a11y.exposureHint")}
            accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
            onAccessibilityAction={onAccessibilityAction}
          >
            <View style={styles.track} />
            <View style={styles.centerMark} />
            <Animated.View style={[styles.thumb, thumbStyle]}>
              <Icon name="sunny" size={16} tint="#FFFFFF" />
            </Animated.View>
          </Animated.View>
        </GestureDetector>
      </View>
    </GestureDetector>
  );
}

const useStyles = makeStyles((theme) => ({
  fill: { flex: 1 },
  slider: {
    position: "absolute",
    right: theme.spacing.sm,
    top: "50%",
    width: 48,
    height: TRACK_HEIGHT + THUMB_SIZE,
    marginTop: -(TRACK_HEIGHT + THUMB_SIZE) / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  track: {
    position: "absolute",
    width: 2,
    height: TRACK_HEIGHT,
    borderRadius: 1,
    backgroundColor: "rgba(255, 255, 255, 0.35)",
  },
  centerMark: {
    position: "absolute",
    width: 10,
    height: 2,
    borderRadius: 1,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.7)",
  },
}));
