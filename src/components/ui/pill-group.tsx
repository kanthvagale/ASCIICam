import { ScrollView, View } from "react-native";

import { makeStyles } from "@/theme";

import { Chip } from "./chip";

export type PillOption<T extends string | number> = {
  value: T;
  label: string;
};

export type PillGroupProps<T extends string | number> = {
  options: readonly PillOption<T>[];
  value: T;
  onChange: (value: T) => void;
  scrollable?: boolean;
};

export function PillGroup<T extends string | number>({
  options,
  value,
  onChange,
  scrollable = false,
}: PillGroupProps<T>) {
  const styles = useStyles();

  const pills = options.map((option) => (
    <Chip
      key={String(option.value)}
      label={option.label}
      selected={option.value === value}
      onPress={() => onChange(option.value)}
    />
  ));

  if (scrollable) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {pills}
      </ScrollView>
    );
  }

  return <View style={[styles.row, styles.wrap]}>{pills}</View>;
}

const useStyles = makeStyles((theme) => ({
  row: { flexDirection: "row", gap: theme.spacing.sm },
  wrap: { flexWrap: "wrap" },
}));
