import { Image } from "expo-image";
import type { Ref } from "react";
import { Pressable, View } from "react-native";

import { Icon } from "@/components/ui";
import { makeStyles, useTheme } from "@/theme";

export type GalleryThumbProps = {
  uri?: string;
  onPress: () => void;
  accessibilityLabel: string;
  ref?: Ref<View>;
};

export function GalleryThumb({ uri, onPress, accessibilityLabel, ref }: GalleryThumbProps) {
  const styles = useStyles();
  const theme = useTheme();

  return (
    <Pressable
      ref={ref}
      onPress={onPress}
      hitSlop={theme.sizes.hitSlop}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [styles.thumb, pressed && styles.pressed]}
    >
      {uri ? (
        <Image source={{ uri }} style={styles.image} contentFit="cover" transition={150} />
      ) : (
        <View style={styles.empty}>
          <Icon name="images-outline" size="xs" tint="#FFFFFF" />
        </View>
      )}
    </Pressable>
  );
}

const useStyles = makeStyles((theme) => ({
  thumb: {
    width: theme.sizes.control.lg,
    height: theme.sizes.control.lg,
    borderRadius: theme.radii.pill,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.8)",
    overflow: "hidden",
  },
  image: { flex: 1 },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.12)",
  },
  pressed: { opacity: 0.7 },
}));
