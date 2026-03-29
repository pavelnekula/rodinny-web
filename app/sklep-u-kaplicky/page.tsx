import type { Metadata } from "next";
import Link from "next/link";

const MAPS_URL = "https://maps.app.goo.gl/qEx7BNZjUKY4hXLp6";

export const metadata: Metadata = {
  title: "Sklep u Kapličky | Rodinný web",
  description: "Sklep u Kapličky – naše oblíbené místo.",
};

export default function SklepUKaplickyPage() {
  return (
    <div className="min-h-screen bg-[#ffffff] text-[#1a1a1a]">
      <div className="mx-auto max-w-3xl px-6 py-16 sm:px-8 sm:py-20 md:py-24">
        <Link
          href="/"
          className="inline-flex text-sm font-light text-[#3b82f6] transition hover:underline focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#3b82f6] focus-visible:ring-offset-2"
          aria-label="Zpět na hlavní stránku"
        >
          ← Zpět domů
        </Link>

        <header className="mt-12 border-b border-[#e5e7eb] pb-12">
          <h1 className="text-4xl font-semibold leading-[1.15] tracking-tight text-[#1a1a1a] sm:text-5xl md:text-6xl">
            Sklep u Kapličky 🏚️
          </h1>
          <p className="mt-6 text-xl font-light leading-relaxed text-[#6b7280] sm:text-2xl">
            Naše oblíbené místo
          </p>
        </header>

        <article className="mt-16 border-t border-[#e5e7eb] pt-16">
          <h2 className="text-2xl font-semibold tracking-tight text-[#1a1a1a]">
            Historie místa
          </h2>
          <div className="mt-8 space-y-6 text-lg font-light leading-[1.75] text-[#6b7280]">
            <p>
              Zde bude příběh místa – kdy vzniklo, kdo ho postavil, jaké má pro
              nás místo v srdci…
            </p>
          </div>
        </article>

        <section className="mt-20 border-t border-[#e5e7eb] pt-20">
          <h2 className="text-2xl font-semibold tracking-tight text-[#1a1a1a]">
            Praktické informace
          </h2>
          <ul className="mt-10 flex flex-col gap-4">
            <li className="rounded-xl border border-[#e5e7eb] bg-[#ffffff] p-6 shadow-sm">
              <p className="text-sm font-medium text-[#1a1a1a]">
                <span aria-hidden>📍</span> Adresa
              </p>
              <p className="mt-2 font-light leading-relaxed text-[#6b7280]">
                Doplnit adresu
              </p>
            </li>
            <li className="rounded-xl border border-[#e5e7eb] bg-[#ffffff] p-6 shadow-sm">
              <p className="text-sm font-medium text-[#1a1a1a]">
                <span aria-hidden>🚗</span> Příjezd
              </p>
              <p className="mt-2 font-light leading-relaxed text-[#6b7280]">
                Doplnit popis příjezdu
              </p>
            </li>
            <li className="rounded-xl border border-[#e5e7eb] bg-[#ffffff] p-6 shadow-sm">
              <p className="text-sm font-medium text-[#1a1a1a]">
                <span aria-hidden>📞</span> Kontakt
              </p>
              <p className="mt-2 font-light leading-relaxed text-[#6b7280]">
                Doplnit kontakt
              </p>
            </li>
            <li className="rounded-xl border border-[#e5e7eb] bg-[#ffffff] p-6 shadow-sm">
              <p className="text-sm font-medium text-[#1a1a1a]">
                <span aria-hidden>🕐</span> Otevírací doba
              </p>
              <p className="mt-2 font-light leading-relaxed text-[#6b7280]">
                Doplnit
              </p>
            </li>
            <li className="rounded-xl border border-[#e5e7eb] bg-[#ffffff] p-6 shadow-sm transition-shadow hover:shadow-md">
              <p className="text-sm font-medium text-[#1a1a1a]">
                <span aria-hidden>🗺️</span> Mapa a fotky místa
              </p>
              <p className="mt-2 font-light leading-relaxed text-[#6b7280]">
                Přesná poloha, náhled a fotografie přímo v Google Mapách.
              </p>
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex text-sm font-medium text-[#3b82f6] transition hover:underline focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#3b82f6] focus-visible:ring-offset-2"
              >
                Otevřít v Google Mapách →
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
