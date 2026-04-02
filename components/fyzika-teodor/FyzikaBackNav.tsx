import Link from "next/link";

type FyzikaBackNavProps = {
  href: string;
  label: string;
};

export function FyzikaBackNav({ href, label }: FyzikaBackNavProps) {
  return (
    <Link
      href={href}
      className="mb-6 inline-flex w-fit rounded-lg border border-slate-600 bg-slate-800/80 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-500/50 hover:text-cyan-300 focus-visible:outline focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
    >
      ← {label}
    </Link>
  );
}
