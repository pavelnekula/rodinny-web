import { LuckyWheelApp } from "@/components/tinuska/anglictina/modes/LuckyWheelApp";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kolo štěstí | Angličtina Tinuška",
  description: "Roztoč kolo a odpověz na otázku z náhodné kategorie.",
};

export default function KoloStestiPage() {
  return <LuckyWheelApp />;
}
