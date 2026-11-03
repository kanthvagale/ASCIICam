import { TextInput } from "react-native";
import Animated, { useAnimatedProps, type SharedValue } from "react-native-reanimated";

import { fontFamilies, makeStyles } from "@/theme";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export function FpsBadge({ fps }: { fps: SharedValue<number> }) {
  const styles = useStyles();

  const animatedProps = useAnimatedProps(() => {
    const label = `${fps.value} fps`;
    return { value: label, text: label };
  });

  return (
    <AnimatedTextInput
      animatedProps={animatedProps}
      editable={false}
      pointerEvents="none"
      style={styles.badge}
    />
  );
}

const useStyles = makeStyles((theme) => ({
  badge: {
    fontFamily: fontFamilies.mono,
    fontSize: 12,
    color: "#FFFFFF",
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.radii.pill,
    overflow: "hidden",
  },
}));
