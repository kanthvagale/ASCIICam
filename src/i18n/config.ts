export const SUPPORTED_LANGUAGES = ["en", "ar"] as const;

export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: Language = "en";

/** Languages that lay out right-to-left. Add "he", "fa", "ur" as needed. */
export const RTL_LANGUAGES: readonly Language[] = ["ar"];

export const LANGUAGE_LABELS: Record<Language, { native: string; english: string }> = {
  en: { native: "English", english: "English" },
  ar: { native: "العربية", english: "Arabic" },
};

export const isSupportedLanguage = (value: unknown): value is Language =>
  typeof value === "string" &&
  (SUPPORTED_LANGUAGES as readonly string[]).includes(value);

export const isRtlLanguage = (language: Language): boolean =>
  RTL_LANGUAGES.includes(language);
