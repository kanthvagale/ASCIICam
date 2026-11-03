import type { IconName } from "./icon";
import { ListItem } from "./list-item";
import { Switch } from "./switch";

export type ToggleRowProps = {
  title: string;
  subtitle?: string;
  icon?: IconName;
  value: boolean;
  onChange: (value: boolean) => void;
};

export function ToggleRow({ title, subtitle, icon, value, onChange }: ToggleRowProps) {
  return (
    <ListItem
      title={title}
      subtitle={subtitle}
      icon={icon}
      onPress={() => onChange(!value)}
      showChevron={false}
      right={<Switch value={value} onValueChange={onChange} accessibilityLabel={title} />}
    />
  );
}
