import { PocitaniExercise } from "@/components/matematika/PocitaniExercise";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Doplň číslo | Matematika",
  description: "Osm příkladů se sčítáním a odčítáním.",
};

export default function PocitaniPage() {
  return <PocitaniExercise />;
}
