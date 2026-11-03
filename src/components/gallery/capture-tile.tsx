import { Image } from "expo-image";
import { Pressable } from "react-native";

import { capturePngUri } from "@/services/captures";
import { makeStyles } from "@/theme";
import type { Capture } from "@/types/capture";

export type CaptureTileProps = {
  capture: Capture;
  size: number;
  onPress: (capture: Capture) => void;
};

export function CaptureTile({ capture, size, onPress }: CaptureTileProps) {
  const styles = useStyles();

  return (
    <Pressable
      onPress={() => onPress(capture)}
      accessibilityRole="imagebutton"
      style={({ pressed }) => [
        styles.tile,
        { width: size, height: size, backgroundColor: capture.background },
        pressed && styles.pressed,
      ]}
    >
      <Image
        source={{ uri: capturePngUri(capture.id) }}
        style={styles.image}
        contentFit="cover"
        recyclingKey={capture.id}
        transition={120}
      />
    </Pressable>
  );
}

const useStyles = makeStyles((theme) => ({
  tile: { borderRadius: theme.radii.sm, overflow: "hidden" },
  image: { flex: 1 },
  pressed: { opacity: 0.75 },
}));
