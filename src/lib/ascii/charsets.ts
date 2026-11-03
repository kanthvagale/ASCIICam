/** Darkest → brightest. */
export const CHARSETS = {
  standard: "     ....----==++**#%@",
  detailed: " .'`^\",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$",
  minimal: " .:-=+*#%@",
  blocks: " ░▒▓█",
  binary: "  01",
} as const;

export type CharsetId = keyof typeof CHARSETS;

export const CHARSET_IDS = Object.keys(CHARSETS) as CharsetId[];

export const DEFAULT_CHARSET: CharsetId = "standard";

export function getCharset(id: CharsetId): string[] {
  return (CHARSETS[id] ?? CHARSETS[DEFAULT_CHARSET]).split("");
}
