import { LogoIcon } from "@/assets/icons";
import { useTheme, type ColorToken } from "@/theme";

export type LogoProps = {
  size?: number;
  color?: ColorToken;
};

export function Logo({ size, color = "primaryText" }: LogoProps) {
  const theme = useTheme();
  const dimension = size ?? theme.sizes.icon.lg;

  return (
    <LogoIcon
      width={dimension}
      height={dimension}
      color={theme.colors[color]}
    />
  );
}
