"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  detectLocale,
  dictionaries,
  loadStoredLocale,
  storeLocale,
  type Dictionary,
  type Locale,
} from "@/lib/i18n";

type I18nContextValue = {
  locale: Locale;
  dict: Dictionary;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = loadStoredLocale();
    setLocaleState(stored ?? detectLocale());
    setReady(true);
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    storeLocale(next);
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale(locale === "en" ? "es" : "en");
  }, [locale, setLocale]);

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      dict: dictionaries[locale],
      setLocale,
      toggleLocale,
    }),
    [locale, setLocale, toggleLocale],
  );

  if (!ready) {
    return (
      <div className="min-h-dvh bg-[var(--bg)] text-[var(--fg)]" aria-hidden />
    );
  }

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return ctx;
}
