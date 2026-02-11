import ko from "./ko";
import en from "./en";

export type { TranslationKey } from "./ko";
export type Locale = "ko" | "en";

const dictionaries = { ko, en } as const;

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}

export { ko, en };
