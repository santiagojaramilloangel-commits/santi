"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DemoBanner } from "@/components/DemoBanner";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useI18n } from "@/contexts/I18nContext";
import { brand } from "@/lib/brand";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { dict } = useI18n();
  const pathname = usePathname();
  const onBarber = pathname.startsWith("/barber");

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-[var(--bg)] text-[var(--fg)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(255,215,0,0.08),transparent_45%),radial-gradient(ellipse_at_80%_20%,rgba(255,255,255,0.04),transparent_40%),linear-gradient(180deg,#262626_0%,#1F1F1F_40%,#171717_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22><path d=%22M0 40L40 0M-10 10L10 -10M30 50L50 30%22 stroke=%22%23fff%22 stroke-width=%221%22/></svg>')]" />

      <div className="relative mx-auto flex min-h-dvh w-full max-w-lg flex-col">
        <DemoBanner />
        <header className="flex items-center justify-between gap-3 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={brand.logoPath}
              alt=""
              className="h-10 w-10 shrink-0"
            />
            <div className="min-w-0">
              <p className="font-display truncate text-xl leading-none tracking-tight text-[var(--fg)]">
                {brand.shopName}
              </p>
              <p className="mt-1 truncate text-xs text-[var(--fg-muted)]">
                {dict.tagline}
              </p>
            </div>
          </Link>
          <LanguageToggle />
        </header>

        <main className="flex-1 px-4">{children}</main>

        <nav
          className="sticky bottom-0 z-40 border-t border-[var(--border)] bg-[var(--bg)]/95 backdrop-blur-md"
          style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
        >
          <div className="grid grid-cols-2 gap-2 px-4 pt-3">
            <Link
              href="/"
              className={`rounded-sm py-3 text-center text-sm font-semibold ${
                !onBarber
                  ? "bg-[var(--gold)] text-[var(--bg)]"
                  : "border border-[var(--border)] text-[var(--fg-muted)]"
              }`}
            >
              {dict.navTryOn}
            </Link>
            <Link
              href="/barber"
              className={`rounded-sm py-3 text-center text-sm font-semibold ${
                onBarber
                  ? "bg-[var(--gold)] text-[var(--bg)]"
                  : "border border-[var(--border)] text-[var(--fg-muted)]"
              }`}
            >
              {dict.navBarber}
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
