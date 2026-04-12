import { PetiminutovkyGame } from "@/components/matematika/PetiminutovkyGame";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pětiminutovky | Matematika",
  description: "Pět minut soutěžního počítání — násobilka, dělení, po desítkách.",
};

export default function PetiminutovkyPage() {
  return <PetiminutovkyGame />;
}
