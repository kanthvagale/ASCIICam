import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

import { fontFamilies, makeStyles } from "@/theme";

import { TwinkleStar } from "./twinkle-star";

export const SPLASH_DELAY = 500;
export const SPLASH_DURATION = 3000;

const ZOOM_DURATION = 1200;
const SUBTITLE_AT = 900;
const STAR_AT = 1100;
const FADE_OUT = 350;

const TITLE_SIZE = 72;

export type SplashWordmarkProps = {
  onFinish: () => void;
};

export function SplashWordmark({ onFinish }: SplashWordmarkProps) {
  const styles = useStyles();
  const { t } = useTranslation();

  const titleScale = useSharedValue(1.8);
  const titleOpacity = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);
  const subtitleShift = useSharedValue(12);
  const containerOpacity = useSharedValue(1);

  useEffect(() => {
    const ease = Easing.out(Easing.cubic);

    titleScale.value = withDelay(SPLASH_DELAY, withTiming(1, { duration: ZOOM_DURATION, easing: ease }));
    titleOpacity.value = withDelay(SPLASH_DELAY, withTiming(1, { duration: 600 }));

    const subtitleDelay = SPLASH_DELAY + SUBTITLE_AT;
    subtitleOpacity.value = withDelay(subtitleDelay, withTiming(1, { duration: 500 }));
    subtitleShift.value = withDelay(subtitleDelay, withTiming(0, { duration: 500, easing: ease }));

    containerOpacity.value = withDelay(
      SPLASH_DELAY + SPLASH_DURATION - FADE_OUT,
      withTiming(0, { duration: FADE_OUT }, (finished) => {
        if (finished) scheduleOnRN(onFinish);
      }),
    );
  }, [containerOpacity, onFinish, subtitleOpacity, subtitleShift, titleOpacity, titleScale]);

  const containerStyle = useAnimatedStyle(() => ({ opacity: containerOpacity.value }));
  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ scale: titleScale.value }],
  }));
  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
    transform: [{ translateY: subtitleShift.value }],
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <Animated.View style={titleStyle}>
        <View style={styles.star}>
          <TwinkleStar size={28} color="#FFFFFF" delay={SPLASH_DELAY + STAR_AT} />
        </View>
        <Animated.Text style={styles.title}>{t("splash.title")}</Animated.Text>
      </Animated.View>
      <Animated.Text style={[styles.subtitle, subtitleStyle]}>{t("splash.subtitle")}</Animated.Text>
    </Animated.View>
  );
}

const useStyles = makeStyles((theme) => ({
  container: { alignItems: "center" },
  title: {
    fontFamily: fontFamilies.monoBold,
    fontSize: TITLE_SIZE,
    lineHeight: TITLE_SIZE * 1.1,
    color: "#FFFFFF",
    includeFontPadding: false,
  },
  subtitle: {
    fontFamily: fontFamilies.mono,
    fontSize: 20,
    letterSpacing: 8,
    color: "#BDBDBD",
    marginTop: theme.spacing.xs,
  },
  star: { position: "absolute", top: -14, left: -18 },
}));
