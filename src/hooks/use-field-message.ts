import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import type { FieldError } from "@/utils/validators";

/**
 * Validators return i18n keys, not sentences. This turns one into the message
 * an `Input` shows, so error copy is translated like everything else.
 */
export function useFieldMessage() {
  const { t } = useTranslation();
  return useCallback(
    (error: FieldError) => (error ? t(error.key, error.params) : null),
    [t]
  );
}
