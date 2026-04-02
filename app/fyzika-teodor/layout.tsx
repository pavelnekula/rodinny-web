import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Fyzika pro Teodora | Nekulovi",
  description:
    "Výuka fyziky pro prima osmiletého gymnázia — výklad, cvičení, pexeso, převody jednotek.",
};

export default function FyzikaTeodorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link
            href="/fyzika-teodor"
            className="text-sm font-semibold text-cyan-400 hover:text-cyan-300"
          >
            ⚡ Fyzika pro Teodora
          </Link>
          <nav className="flex flex-wrap gap-4 text-sm text-slate-400">
            <Link href="/" className="hover:text-white">
              Úvod Nekulovi
            </Link>
            <Link href="/teo" className="hover:text-white">
              Teo
            </Link>
            <Link href="/fyzika-teodor/prevody" className="hover:text-cyan-400">
              Převody
            </Link>
          </nav>
        </div>
      </div>
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">{children}</div>
    </div>
  );
}
