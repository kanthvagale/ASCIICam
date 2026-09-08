import { useCallback } from "react";

import { useLocale } from "@/i18n";
import type { Localized } from "@/types/models";

/**
 * Picks the right side of a `Localized` value from the dummy data.
 * Screens call `L(item.title)` instead of branching on the language.
 */
export function useLocalized() {
  const { language } = useLocale();
  return useCallback((value: Localized) => value[language], [language]);
}
