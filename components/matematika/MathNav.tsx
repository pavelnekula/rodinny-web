import Link from "next/link";

const linkClass =
  "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-white/60 focus-visible:outline focus-visible:ring-2 focus-visible:ring-blue-400";

export function MathNav() {
  return (
    <nav
      className="mb-6 flex flex-wrap items-center gap-2"
      aria-label="Navigace matematika"
    >
      <Link href="/matematika" className={linkClass}>
        ← Matematika
      </Link>
      <Link href="/" className={linkClass}>
        ← Nekulovi
      </Link>
    </nav>
  );
}
