import Link from "next/link";
import { UnitConverter } from "@/components/fyzika-teodor/UnitConverter";
import { FyzikaBackNav } from "@/components/fyzika-teodor/FyzikaBackNav";

export default function PrevodyPage() {
  return (
    <div>
      <FyzikaBackNav href="/fyzika-teodor" label="Fyzika — úvod" />
      <h1 className="mb-2 text-3xl font-bold text-white sm:text-4xl">
        Převody jednotek
      </h1>
      <p className="mb-8 text-slate-400">
        Žebříčky jednotek, převodník a drill mód. Vyber záložku nahoře.
      </p>
      <UnitConverter />
      <p className="mt-10 text-center text-sm text-slate-600">
        <Link href="/fyzika-teodor" className="text-cyan-400 hover:underline">
          ← Zpět na Fyziku
        </Link>
      </p>
    </div>
  );
}
