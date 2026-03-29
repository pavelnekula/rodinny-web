import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col bg-gradient-to-b from-amber-50 via-violet-50/40 to-sky-50">
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-6 py-12 sm:py-16 md:gap-14">
        <header className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-800 drop-shadow-sm sm:text-5xl">
            Rodinné vzdělávání 🏠
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600 sm:text-xl">
            Místo kde se Tinuška a Teo učí s radostí
          </p>
        </header>

        <div className="grid flex-1 gap-6 md:grid-cols-2 md:gap-8 md:items-stretch">
          <Link
            href="/tinuska"
            className="group relative flex flex-col overflow-hidden rounded-3xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-600 p-8 text-white shadow-xl shadow-purple-500/25 ring-2 ring-white/30 transition duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <span
              className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10 blur-2xl transition group-hover:bg-white/15"
              aria-hidden
            />
            <h2 className="text-2xl font-bold sm:text-3xl">📚 Výuka Tinuška</h2>
            <p className="mt-3 flex-1 text-base leading-relaxed text-violet-100">
              Úkoly, čtení a objevování – vše na jednom místě připravené pro
              Tinuščinu cestu za vědomostmi.
            </p>
            <span className="mt-8 inline-flex w-fit items-center justify-center rounded-full bg-white/90 px-6 py-3 text-sm font-semibold text-purple-700 shadow-md transition group-hover:bg-white group-hover:shadow-lg">
              Vstoupit
            </span>
          </Link>

          <Link
            href="/teo"
            className="group relative flex flex-col overflow-hidden rounded-3xl bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-600 p-8 text-white shadow-xl shadow-blue-500/25 ring-2 ring-white/30 transition duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <span
              className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10 blur-2xl transition group-hover:bg-white/15"
              aria-hidden
            />
            <h2 className="text-2xl font-bold sm:text-3xl">🚀 Výuka Teo</h2>
            <p className="mt-3 flex-1 text-base leading-relaxed text-sky-100">
              Hry, experimenty a rychlé pokroky – Teo se tu učí chytře a s
              úsměvem.
            </p>
            <span className="mt-8 inline-flex w-fit items-center justify-center rounded-full bg-white/90 px-6 py-3 text-sm font-semibold text-blue-700 shadow-md transition group-hover:bg-white group-hover:shadow-lg">
              Vstoupit
            </span>
          </Link>
        </div>
      </main>

      <footer className="border-t border-violet-100/80 bg-white/40 py-6 text-center text-sm text-slate-500 backdrop-blur-sm">
        Verze 0.1 – teprve začínáme 🚀
      </footer>
    </div>
  );
}
