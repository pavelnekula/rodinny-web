import { KartyGame } from "@/components/matematika/KartyGame";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Matematické karty | Matematika",
  description: "Pexeso s příklady a výsledky.",
};

export default function KartyPage() {
  return <KartyGame />;
}
