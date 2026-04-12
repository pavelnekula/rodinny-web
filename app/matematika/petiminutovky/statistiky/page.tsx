import { PetiminutovkyStats } from "@/components/matematika/PetiminutovkyStats";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Statistiky tříminutovek | Matematika",
  description: "Celkové statistiky a graf posledních soutěží.",
};

export default function PetiminutovkyStatistikyPage() {
  return <PetiminutovkyStats />;
}
