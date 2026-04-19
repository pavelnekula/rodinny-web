import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  description:
    "Úvodní stránka rodinného webu — navigace na stránky Tinušky, Tea, sklepu a další.",
};

const navLinkClass =
  "w-fit text-lg font-medium text-[#1a1a1a] underline-offset-4 transition hover:text-[#3b82f6] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3b82f6] focus-visible:ring-offset-2";

export default function Home() {
  const todayLabel = new Date().toLocaleDateString("cs-CZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex min-h-screen flex-col bg-[#ffffff] text-[#1a1a1a] md:flex-row">
      <aside className="flex w-full shrink-0 flex-col border-b border-[#e5e7eb] bg-[#ffffff] md:w-56 md:max-w-xs md:border-b-0 md:border-r">
        <div className="p-8 md:sticky md:top-0 md:py-14 md:pl-10 md:pr-8">
          <nav
            className="flex flex-col gap-6"
            aria-label="Hlavní stránky webu"
          >
            <Link href="/tinuska" className={navLinkClass}>
              Tinuška
            </Link>
            <Link href="/teo" className={navLinkClass}>
              Teo
            </Link>
            <Link href="/sklep-u-kaplicky" className={navLinkClass}>
              Sklep u Kapličky
            </Link>
          </nav>
        </div>
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-16 sm:px-8 sm:py-20 md:py-24 lg:px-10">
          <header className="text-center md:text-left">
            <p className="text-sm font-medium uppercase tracking-wide text-[#6b7280]">
              Rodinný web
            </p>
            <h1 className="mt-2 text-4xl font-semibold leading-[1.15] tracking-tight text-[#1a1a1a] sm:text-5xl md:text-6xl">
              Nekulovi
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-lg font-light leading-relaxed text-[#6b7280] sm:text-xl md:mx-0 md:max-w-none">
              Vítej — odkazy na jednotlivé stránky jsou v levém menu.
            </p>
          </header>
        </main>

        <footer className="border-t border-[#e5e7eb] bg-[#ffffff] px-6 py-10 text-center text-sm font-light text-[#6b7280]">
          <p>created by Pavel · {todayLabel}</p>
        </footer>
      </div>
    </div>
  );
}
