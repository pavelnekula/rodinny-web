import { MathHub } from "@/components/matematika/MathHub";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Matematika | Tinuška",
  description: "Doplňování, písemné příklady, závorky, bleskovky a karty.",
};

export default function MatematikaPage() {
  return <MathHub />;
}
