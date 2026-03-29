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
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#0f0f1a] text-white md:flex-row">
      {/* Pozadí */}
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_30%,#000_40%,transparent_100%)]" />
        <div className="absolute -left-1/4 top-[-10%] h-[min(70vh,520px)] w-[min(70vw,520px)] rounded-full bg-violet-600/25 blur-[120px] animate-pulse" />
        <div
          className="absolute -right-1/4 top-1/3 h-[min(60vh,440px)] w-[min(65vw,440px)] rounded-full bg-blue-600/20 blur-[110px] animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-[-15%] left-1/3 h-[min(50vh,380px)] w-[min(55vw,380px)] rounded-full bg-indigo-500/15 blur-[100px] animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0f0f1a]/40 to-[#0f0f1a]" />
      </div>

      {/* Levé menu */}
      <aside className="relative z-10 flex w-full flex-col gap-8 border-b border-white/10 bg-[#14142a]/90 p-6 backdrop-blur-md md:w-80 md:min-h-screen md:max-w-sm md:border-b-0 md:border-r md:py-10">
        <div className="md:sticky md:top-10">
          <p className="mb-6 text-xs font-semibold uppercase tracking-widest text-slate-500">
            Nabídka
          </p>

          <nav className="flex flex-col gap-8" aria-label="Vzdělávání">
            <section>
              <h2 className="text-lg font-bold text-violet-200">
                Vzdělávání Tini
              </h2>
              <p className="mt-1 text-xs text-slate-500">Předměty</p>
              <ul className="mt-3 space-y-2">
                {tinuskaSubjects.map((s) => (
                  <li key={s.name}>
                    <Link
                      href={s.href}
                      className="flex items-center gap-2 rounded-xl border border-violet-500/20 bg-violet-500/10 px-3 py-2 text-sm text-slate-200 transition hover:border-violet-400/50 hover:bg-violet-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
                      aria-label={`Otevřít ${s.name}${s.href === "/tinuska/anglictina" ? " – slovíčka" : ""}`}
                    >
                      <span aria-hidden>{s.emoji}</span>
                      <span className="font-medium">{s.name}</span>
                      <span className="ml-auto text-violet-300/80" aria-hidden>
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-sky-200">
                Vzdělávání Teo
              </h2>
              <p className="mt-1 text-xs text-slate-500">Předměty</p>
              <ul className="mt-3 space-y-2">
                {teoSubjects.map((s) => (
                  <li key={s.name}>
                    <Link
                      href={s.href}
                      className="flex items-center gap-2 rounded-xl border border-sky-500/20 bg-sky-500/10 px-3 py-2 text-sm text-slate-200 transition hover:border-sky-400/50 hover:bg-sky-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
                      aria-label={`Otevřít ${s.name} (Teo)`}
                    >
                      <span aria-hidden>{s.emoji}</span>
                      <span className="font-medium">{s.name}</span>
                      <span className="ml-auto text-sky-300/80" aria-hidden>
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
      <div className="relative z-0 flex min-h-0 flex-1 flex-col">
        <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <header className="text-center md:text-left">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-sky-400 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(139,92,246,0.35)]">
                Rodinný web – Nekulovi 🏠
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base text-slate-400 sm:text-lg md:mx-0">
              Jsme doma ve Znojmě – městě s historií, výhledy a klidem na učení.
              Předměty a aktivity spustíš z menu vlevo.
            </p>
          </header>

          <figure className="mt-10 w-full">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40 shadow-2xl ring-1 ring-white/5">
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
            <figcaption className="mt-3 text-center text-xs text-slate-500 md:text-left">
              Panorama Znojma (zdroj obrázku: Wikimedia Commons, soubor
              „Znojmo – panorama od jihu obr1“)
            </figcaption>
          </figure>
        </main>

        <footer className="relative z-0 border-t border-white/10 bg-[#0f0f1a]/80 px-4 py-5 text-center text-sm text-slate-500 backdrop-blur-sm">
          <p>
            created by Pavel · {todayLabel}
          </p>
        </footer>
      </div>
    </div>
  );
}
