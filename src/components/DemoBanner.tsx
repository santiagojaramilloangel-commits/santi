"use client";

import { useI18n } from "@/contexts/I18nContext";
import { useSession } from "@/contexts/SessionContext";

export function DemoBanner() {
  const { demoMode } = useSession();
  const { dict } = useI18n();
  if (!demoMode) return null;

  return (
    <div
      role="status"
      className="sticky top-0 z-50 border-b border-[var(--gold)]/40 bg-[var(--bg-elevated)] px-4 py-2 text-center text-sm font-medium text-[var(--gold)]"
    >
      {dict.demoBanner}
    </div>
  );
}
