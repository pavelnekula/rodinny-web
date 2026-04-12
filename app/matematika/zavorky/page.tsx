import { ZavorkyExercise } from "@/components/matematika/ZavorkyExercise";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Závorky | Matematika",
  description: "Pořadí operací a závorky.",
};

export default function ZavorkyPage() {
  return <ZavorkyExercise />;
}
