import { AnglictinaHub } from "@/components/tinuska/anglictina/AnglictinaHub";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Angličtina – slovíčka | Tinuška",
  description: "Výukové slovíčka: barvy, nábytek, hračky, části těla.",
};

export default function AnglictinaPage() {
  return <AnglictinaHub />;
}
