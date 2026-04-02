import Link from "next/link";
import { FyzikaHub } from "@/components/fyzika-teodor/FyzikaHub";

export default function FyzikaTeodorPage() {
  return (
    <div>
      <Link
        href="/"
        className="mb-8 inline-flex text-sm text-slate-500 hover:text-cyan-400"
      >
        ← Zpět na úvod
      </Link>
      <FyzikaHub />
    </div>
  );
}
