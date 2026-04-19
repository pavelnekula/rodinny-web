import Link from "next/link";

const linkClass =
  "inline-flex items-center gap-2 rounded-full border border-app-border bg-app-card px-4 py-2 text-sm font-medium text-app-muted transition hover:border-app-border-hover hover:text-app-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent focus-visible:ring-offset-2 focus-visible:ring-offset-app-bg";

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
