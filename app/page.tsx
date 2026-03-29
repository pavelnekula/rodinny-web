import Image from "next/image";
import Link from "next/link";
import { tinuskaSubjects, teoSubjects } from "@/lib/subjects";

export const dynamic = "force-dynamic";

export default function Home() {
  const todayLabel = new Date().toLocaleDateString("cs-CZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex min-h-screen flex-col bg-[#ffffff] text-[#1a1a1a] md:flex-row">
      {/* Levé menu */}
      <aside className="flex w-full shrink-0 flex-col border-b border-[#e5e7eb] bg-[#ffffff] md:w-80 md:max-w-sm md:border-b-0 md:border-r">
        <div className="p-8 md:sticky md:top-0 md:max-h-screen md:overflow-y-auto md:py-14 md:pl-10 md:pr-8">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#6b7280]">
            Nabídka
          </p>

          <nav
            className="mt-12 flex flex-col gap-14"
            aria-label="Vzdělávání"
          >
            <section className="border-t border-[#e5e7eb] pt-10 first:mt-0 first:border-t-0 first:pt-0">
              <h2 className="text-base font-semibold tracking-tight text-[#1a1a1a]">
                Vzdělávání Tini
              </h2>
              <p className="mt-2 text-sm font-light leading-relaxed text-[#6b7280]">
                Předměty
              </p>
              <ul className="mt-6 flex flex-col gap-3">
                {tinuskaSubjects.map((s) => (
                  <li key={s.name}>
                    <Link
                      href={s.href}
                      className="flex items-center gap-3 rounded-xl border border-[#e5e7eb] bg-[#ffffff] px-4 py-4 text-sm shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3b82f6] focus-visible:ring-offset-2"
                      aria-label={`Otevřít ${s.name}${s.href === "/tinuska/anglictina" ? " – slovíčka" : ""}`}
                    >
                      <span className="text-lg" aria-hidden>
                        {s.emoji}
                      </span>
                      <span className="font-medium text-[#1a1a1a]">
                        {s.name}
                      </span>
                      <span
                        className="ml-auto text-[#3b82f6]"
                        aria-hidden
                      >
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <section className="border-t border-[#e5e7eb] pt-14">
              <h2 className="text-base font-semibold tracking-tight text-[#1a1a1a]">
                Vzdělávání Teo
              </h2>
              <p className="mt-2 text-sm font-light leading-relaxed text-[#6b7280]">
                Předměty
              </p>
              <ul className="mt-6 flex flex-col gap-3">
                {teoSubjects.map((s) => (
                  <li key={s.name}>
                    <Link
                      href={s.href}
                      className="flex items-center gap-3 rounded-xl border border-[#e5e7eb] bg-[#ffffff] px-4 py-4 text-sm shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3b82f6] focus-visible:ring-offset-2"
                      aria-label={`Otevřít ${s.name} (Teo)`}
                    >
                      <span className="text-lg" aria-hidden>
                        {s.emoji}
                      </span>
                      <span className="font-medium text-[#1a1a1a]">
                        {s.name}
                      </span>
                      <span
                        className="ml-auto text-[#3b82f6]"
                        aria-hidden
                      >
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </nav>
        </div>
      </aside>

      {/* Hlavní obsah */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-16 sm:px-8 sm:py-20 md:py-24 lg:px-10">
          <header className="text-center md:text-left">
            <h1 className="text-4xl font-semibold leading-[1.15] tracking-tight text-[#1a1a1a] sm:text-5xl md:text-6xl">
              Rodinný web – Nekulovi 🏠
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-lg font-light leading-relaxed text-[#6b7280] sm:text-xl md:mx-0 md:max-w-none">
              Jsme doma ve Znojmě – městě s historií, výhledy a klidem na učení.
              Předměty a aktivity spustíš z menu vlevo.
            </p>
          </header>

          <div className="mt-20 border-t border-[#e5e7eb] pt-20">
            <figure className="w-full">
              <div className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-[#ffffff] shadow-sm transition-shadow hover:shadow-md">
                <Image
                  src="/znojmo.jpg"
                  alt="Panoramatický pohled na historické město Znojmo"
                  width={1280}
                  height={803}
                  className="h-auto w-full object-cover"
                  sizes="(max-width: 768px) 100vw, min(896px, 90vw)"
                  priority
                />
              </div>
              <figcaption className="mt-4 text-center text-sm font-light leading-relaxed text-[#6b7280] md:text-left">
                Panorama Znojma (zdroj obrázku: Wikimedia Commons, soubor
                „Znojmo – panorama od jihu obr1“)
              </figcaption>
            </figure>
          </div>
        </main>

        <footer className="border-t border-[#e5e7eb] bg-[#ffffff] px-6 py-10 text-center text-sm font-light text-[#6b7280]">
          <p>created by Pavel · {todayLabel}</p>
        </footer>
      </div>
    </div>
  );
}
