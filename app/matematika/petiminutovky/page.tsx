import { PetiminutovkyGame } from "@/components/matematika/PetiminutovkyGame";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pětiminutovky | Matematika",
  description:
    "Dvacet příkladů najednou, vlastní tempo a stopky — klidné počítání pro Tinušku.",
};

export default function PetiminutovkyPage() {
  return <PetiminutovkyGame />;
}
