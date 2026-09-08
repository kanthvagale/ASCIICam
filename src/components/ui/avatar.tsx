import { Image } from "expo-image";
import { View, type ImageStyle, type StyleProp, type ViewStyle } from "react-native";

import { makeStyles, useTheme } from "@/theme";

import { Text } from "./text";

export type AvatarProps = {
  uri?: string;
  /** Fallback initials when there's no image. */
  name?: string;
  size?: "sm" | "md" | "lg";
  style?: StyleProp<ViewStyle>;
};

const initialsOf = (name?: string) =>
  (name ?? "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

export function Avatar({ uri, name, size = "md", style }: AvatarProps) {
  const styles = useStyles();
  const theme = useTheme();
  const dimension = theme.sizes.avatar[size];
  const shape = { width: dimension, height: dimension, borderRadius: dimension / 2 };

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[styles.image, shape, style] as StyleProp<ImageStyle>}
        contentFit="cover"
        transition={200}
      />
    );
  }

  return (
    <View style={[styles.fallback, shape, style]}>
      <Text variant={size === "lg" ? "h2" : "bodyBold"} color="primary">
        {initialsOf(name)}
      </Text>
    </View>
  );
}

const useStyles = makeStyles((theme) => ({
  image: { backgroundColor: theme.colors.skeleton },
  fallback: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primaryMuted,
  },
}));
