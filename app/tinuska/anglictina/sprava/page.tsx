import { VocabularySprava } from "@/components/tinuska/anglictina/VocabularySprava";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Správa slovíček | Angličtina | Tinuška",
  description:
    "Doplň vlastní anglická slovíčka podle oblastí: barvy, nábytek, hračky, části těla, jídlo, čísla, škola, slovesa to be / to have.",
};

export default function AnglictinaSpravaPage() {
  return <VocabularySprava />;
}
