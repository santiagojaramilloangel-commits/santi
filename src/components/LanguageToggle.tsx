"use client";

import { useI18n } from "@/contexts/I18nContext";

export function LanguageToggle() {
  const { locale, setLocale, dict } = useI18n();

  return (
    <div
      className="inline-flex items-center gap-1 rounded-md border border-[var(--border)] p-0.5"
      role="group"
      aria-label={dict.language}
    >
      <button
        type="button"
        onClick={() => setLocale("en")}
        className={`min-h-10 min-w-10 rounded px-2 text-sm font-semibold transition ${
          locale === "en"
            ? "bg-[var(--gold)] text-[var(--bg)]"
            : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
        }`}
        aria-pressed={locale === "en"}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLocale("es")}
        className={`min-h-10 min-w-10 rounded px-2 text-sm font-semibold transition ${
          locale === "es"
            ? "bg-[var(--gold)] text-[var(--bg)]"
            : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
        }`}
        aria-pressed={locale === "es"}
      >
        ES
      </button>
    </div>
  );
}
