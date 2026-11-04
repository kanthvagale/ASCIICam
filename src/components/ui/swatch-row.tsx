import { Pressable, ScrollView, View } from "react-native";

import { makeStyles } from "@/theme";

export type Swatch = { value: string; label: string };

export type SwatchRowProps = {
  swatches: readonly Swatch[];
  value: string;
  onChange: (value: string) => void;
};

export function SwatchRow({ swatches, value, onChange }: SwatchRowProps) {
  const styles = useStyles();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.bleed}
      contentContainerStyle={[styles.row, styles.bleedContent]}
    >
      {swatches.map((swatch) => {
        const color = swatch.value;
        const selected = color.toLowerCase() === value.toLowerCase();
        return (
          <Pressable
            key={swatch.value}
            onPress={() => onChange(swatch.value)}
            accessibilityRole="button"
            accessibilityLabel={swatch.label}
            accessibilityState={{ selected }}
            style={[styles.ring, selected && styles.ringSelected]}
          >
            <View style={[styles.dot, { backgroundColor: color }]} />
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const useStyles = makeStyles((theme) => ({
  row: { flexDirection: "row", gap: theme.spacing.sm },
  // Run edge to edge past the screen's content padding.
  bleed: { marginHorizontal: -theme.spacing.lg },
  bleedContent: { paddingHorizontal: theme.spacing.lg },
  ring: {
    width: theme.sizes.control.sm,
    height: theme.sizes.control.sm,
    borderRadius: theme.radii.pill,
    borderWidth: 2,
    borderColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  ringSelected: { borderColor: theme.colors.text },
  dot: {
    width: theme.sizes.control.sm - 10,
    height: theme.sizes.control.sm - 10,
    borderRadius: theme.radii.pill,
    borderWidth: theme.sizes.border,
    borderColor: theme.colors.border,
  },
}));
