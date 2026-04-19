import type { Metadata } from "next";
import { SiteChrome } from "@/components/site/SiteChrome";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  description:
    "Úvodní stránka rodinného webu — navigace na stránky Tinušky, Tea, sklepu a další.",
};

export default function Home() {
  const todayLabel = new Date().toLocaleDateString("cs-CZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <SiteChrome accent="blue">
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col py-6 sm:py-10">
        <header className="text-center md:text-left">
          <p className="text-xs font-semibold uppercase tracking-widest text-app-muted">
            Rodinný web
          </p>
          <h1 className="app-title-gradient mt-3 text-4xl font-bold tracking-[-0.06em] sm:text-5xl md:text-6xl md:tracking-[-0.08em]">
            Nekulovi
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg font-normal leading-relaxed text-app-muted sm:text-xl md:mx-0 md:max-w-none">
            Vítej — odkazy na jednotlivé stránky jsou nahoře v menu.
          </p>
        </header>
      </main>

      <footer className="mx-auto mt-auto max-w-3xl border-t border-app-divider py-10 text-center text-sm text-app-muted">
        <p>created by Pavel · {todayLabel}</p>
      </footer>
    </SiteChrome>
  );
}
