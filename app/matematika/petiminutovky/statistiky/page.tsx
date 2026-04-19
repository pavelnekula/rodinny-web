import { PetiminutovkyStats } from "@/components/matematika/PetiminutovkyStats";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Statistiky pětiminutovek | Matematika",
  description: "Celkové statistiky a graf posledních kol (volitelný přehled).",
};

export default function PetiminutovkyStatistikyPage() {
  return <PetiminutovkyStats />;
}
