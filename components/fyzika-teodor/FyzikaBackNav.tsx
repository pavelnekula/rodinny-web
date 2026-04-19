import Link from "next/link";

type FyzikaBackNavProps = {
  href: string;
  label: string;
};

export function FyzikaBackNav({ href, label }: FyzikaBackNavProps) {
  return (
    <Link
      href={href}
      className="app-btn-pill mb-6 inline-flex w-fit border border-app-border bg-app-card px-4 py-2 text-sm font-medium text-app-muted transition hover:border-app-border-hover hover:text-app-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent focus-visible:ring-offset-2 focus-visible:ring-offset-app-bg"
    >
      ← {label}
    </Link>
  );
}
