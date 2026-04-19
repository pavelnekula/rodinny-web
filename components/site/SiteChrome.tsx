import Link from "next/link";

export type SiteAccent = "blue" | "green" | "purple" | "orange";

const NAV = [
  { href: "/", label: "Nekulovi" },
  { href: "/tinuska", label: "Tinuška" },
  { href: "/teo", label: "Teo" },
  { href: "/sklep-u-kaplicky", label: "Sklep u Kapličky" },
] as const;

export function SiteChrome({
  accent,
  children,
}: {
  accent: SiteAccent;
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-[100dvh] bg-app-bg text-app-fg"
      data-accent={accent}
    >
      <header
        className="fixed top-0 right-0 left-0 z-50 border-b border-app-nav-border bg-app-nav-bg backdrop-blur-[20px]"
        style={{
          WebkitBackdropFilter: "blur(20px)",
          paddingTop: "env(safe-area-inset-top, 0px)",
        }}
      >
        <div className="mx-auto flex min-h-14 max-w-6xl items-center px-4 py-2 sm:px-6 sm:py-0">
          <nav
            className="flex w-full flex-wrap items-center gap-x-4 gap-y-2 sm:gap-x-6"
            aria-label="Hlavní navigace"
          >
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-app-muted transition-colors hover:text-app-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent focus-visible:ring-offset-2 focus-visible:ring-offset-app-bg"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <div
        className="app-enter mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6"
        style={{
          paddingTop: "calc(3.5rem + env(safe-area-inset-top, 0px))",
        }}
      >
        {children}
      </div>
    </div>
  );
}
