import { MojeHvezdyPage } from "@/components/tinuska/anglictina/MojeHvezdyPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Moje hvězdy | Angličtina Tinuška",
  description: "Odznáčky a statistiky z her se slovíčky.",
};

export default function HvezdyPage() {
  return <MojeHvezdyPage />;
}
