import { PetiminutovkyGame } from "@/components/matematika/PetiminutovkyGame";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pětiminutovky | Matematika",
  description:
    "Pět minut klidného počítání — násobilka, dělení a mix; bez času a skóre na obrazovce.",
};

export default function PetiminutovkyPage() {
  return <PetiminutovkyGame />;
}
