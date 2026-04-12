import { PisemneExercise } from "@/components/matematika/PisemneExercise";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Písemné příklady | Matematika",
  description: "Odčítání pod sebou se zkouškou.",
};

export default function PisemnePage() {
  return <PisemneExercise />;
}
