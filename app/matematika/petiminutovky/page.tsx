import { PetiminutovkyGame } from "@/components/matematika/PetiminutovkyGame";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tříminutovky | Matematika",
  description:
    "Tři minuty soutěžního počítání — násobilka a dělení (plné zadání), sčítání a odečítání po desítkách.",
};

export default function PetiminutovkyPage() {
  return <PetiminutovkyGame />;
}
